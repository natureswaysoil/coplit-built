// pages/api/create-payment-intent-with-tax.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { supabaseAdmin } from "../../lib/supabaseAdmin";
import { loadSkuTaxCodeMap } from "../../lib/taxCodes";

const apiVersion = process.env.STRIPE_API_VERSION || "2024-06-20";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion } as any);

type CartItem = { id: string; title: string; image: string; sku: string; size: string; price: number; qty: number; };

function linesFromCart(items: CartItem[]) {
  return items.map(it => ({
    id: it.id,
    sku: it.sku,
    name: it.title,
    amount: Math.round(it.price), // cents
    quantity: Math.max(1, it.qty),
  }));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { items, customer, address, promoCode, shipping } = req.body as {
      items: CartItem[];
      customer?: { name?: string; email?: string };
      address: { line1: string; city: string; state: string; postal_code: string; country: string };
      promoCode?: string;
      shipping?: { amount?: number }; // cents
    };
    if (!items?.length) return res.status(400).json({ error: "No items" });

    // Validate required address fields
    if (!address?.line1?.trim()) return res.status(400).json({ error: "Address line 1 is required" });
    if (!address?.city?.trim()) return res.status(400).json({ error: "City is required" });
    if (!address?.state?.trim()) return res.status(400).json({ error: "State is required" });
    if (!address?.postal_code?.trim()) return res.status(400).json({ error: "ZIP code is required" });
    if (!customer?.name?.trim()) return res.status(400).json({ error: "Customer name is required" });
    if (!customer?.email?.trim()) return res.status(400).json({ error: "Customer email is required" });

    const customersTable = process.env.SUPABASE_CUSTOMERS_TABLE || "customers";
    const ordersTable = process.env.SUPABASE_ORDERS_TABLE || "orders";

    // Find-or-create Customer in Stripe and Supabase
    let stripeCustomerId: string | undefined;
    if (customer?.email) {
      try {
        const search = await stripe.customers.search({ query: `email:'${customer.email}'`, limit: 1 });
        stripeCustomerId = search.data[0]?.id;
      } catch {}
      if (!stripeCustomerId) {
        const list = await stripe.customers.list({ email: customer.email, limit: 1 });
        stripeCustomerId = list.data[0]?.id;
      }
      if (!stripeCustomerId) {
        const created = await stripe.customers.create({ email: customer.email, name: customer.name });
        stripeCustomerId = created.id;
      }
      await stripe.customers.update(stripeCustomerId, {
        name: customer?.name,
        shipping: { name: customer?.name ?? "", address }
      });
      await supabaseAdmin.from(customersTable).upsert({
        email: customer?.email,
        name: customer?.name ?? null,
        stripe_customer_id: stripeCustomerId,
        default_shipping: { name: customer?.name, address }
      }, { onConflict: "email" });
    }

    // Normalize lines & apply promo if valid
    let lines = linesFromCart(items);
    let discountCents = 0;
    if (promoCode) {
      const found = await stripe.promotionCodes.list({ code: promoCode, active: true, limit: 1 });
      const promo = found.data[0];
      if (promo?.coupon) {
        const subtotalBefore = lines.reduce((s, l) => s + l.amount * l.quantity, 0);
        if (promo.coupon.percent_off) {
          const factor = Math.max(0, 1 - (promo.coupon.percent_off / 100));
          lines = lines.map(l => ({ ...l, amount: Math.max(0, Math.round(l.amount * factor)) }));
        } else if (promo.coupon.amount_off) {
          const subtotal = subtotalBefore;
          let remaining = Math.min(promo.coupon.amount_off, subtotal);
          const ext = lines.map(l => l.amount * l.quantity);
          const shares = ext.map(a => a / subtotal);
          for (let i = 0; i < lines.length; i++) {
            let disc = Math.floor(shares[i] * promo.coupon.amount_off);
            if (i === lines.length - 1) disc = remaining;
            remaining -= disc;
            const newExt = Math.max(0, ext[i] - disc);
            const perUnit = Math.floor(newExt / lines[i].quantity);
            lines[i].amount = perUnit;
          }
        }
        const after = lines.reduce((s, l) => s + l.amount * l.quantity, 0);
        discountCents = Math.max(0, subtotalBefore - after);
      }
    }

    const sku2code = await loadSkuTaxCodeMap();

    const calc = await stripe.tax.calculations.create({
      currency: "usd",
      line_items: lines.map((l, idx) => ({
        amount: l.amount,
        reference: l.sku || l.id || `item_${idx}`,
        tax_code: sku2code[l.sku] || "txcd_99999999",
        quantity: l.quantity,
      })),
      customer_details: { address, address_source: "shipping" },
      shipping_cost: shipping?.amount ? { amount: Math.round(shipping.amount) } : undefined,
    });

  const subtotal = lines.reduce((sum, line) => sum + (line.amount * line.quantity), 0);
    const tax = calc.tax_amount_exclusive;
    const total = calc.amount_total;
    const shippingAmount = shipping?.amount ? Math.round(shipping.amount) : 0;

    const pi = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd",
      customer: stripeCustomerId,
      automatic_payment_methods: { enabled: true },
      receipt_email: customer?.email,
      shipping: { name: customer?.name ?? "", address },
      metadata: { tax_calculation: calc.id, promo_code: promoCode || "", discount_cents: String(discountCents) },
    });

    await supabaseAdmin.from(ordersTable).insert({
      stripe_payment_intent_id: pi.id,
      stripe_tax_calculation_id: calc.id,
      status: "created",
      customer_email: customer?.email ?? null,
      customer_name: customer?.name ?? null,
      shipping: { address },
      items: items.map(it => ({ sku: it.sku, title: it.title, qty: it.qty, unit_amount: Math.round(it.price) })),
      subtotal_cents: subtotal,
      discount_cents: discountCents,
      tax_cents: tax,
      total_cents: total,
      promo_code: promoCode || null,
    });

    return res.status(200).json({ clientSecret: pi.client_secret, breakdown: { subtotal, discount: discountCents, tax, shipping: shippingAmount, total } });
  } catch (err: any) {
    console.error("create-payment-intent-with-tax error:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
}
