// @ts-nocheck
import Stripe from '../../lib/stripe-node-mock'

/**
 * Optional server-side price book. If a SKU exists here, we ignore any client
 * price and use this value (USD dollars). Leave empty to trust client prices.
 */
const PRICE_BY_SKU: Record<string, number> = {
  // 'SEAWEED-HUMIC-32OZ': 29.99,
  // 'BONE-MEAL-LIQ-1GAL': 39.99,
}

type CartItem = { sku: string; qty: number; price?: number }
type Address = {
  name?: string
  email?: string
  phone?: string
  address1?: string
  address2?: string
  city?: string
  state?: string
  zip?: string
  county?: string
}

type Body = {
  intentId?: string
  // Option A: itemized cart in dollars
  items?: CartItem[]
  // Option B: precomputed subtotal (in cents)
  amount?: number // cents
  // Common fields
  shipping?: number // cents
  email?: string
  name?: string
  currency?: string
  state?: 'NC' | 'Other'
  county?: string
  zip?: string
  city?: string
  billing?: Address
  shippingAddress?: Address
}

const norm = (s?: string) => (s ?? '').trim().toLowerCase()

// Parse county rates JSON from env, normalize keys (e.g., "wake" -> 0.02)
const COUNTY_RATES: Record<string, number> = (() => {
  try {
    const stripe = new Stripe(secret)

    const { currency = 'usd', email, name, items = [], shipping } = req.body || {}

      ? items.reduce((s, it) => {
          const price = Number(it.price);
          const qty = Number(it.qty);
          return s + (Number.isFinite(price) && Number.isFinite(qty) ? price * qty : 0);
        }, 0)
      : 0
    const baseRate = Number(process.env.NEXT_PUBLIC_NC_TAX_RATE || 0.0475)
    let countyRates: Record<string, number> = {}
    if (process.env.NEXT_PUBLIC_NC_COUNTY_RATES) {
      try {
        countyRates = JSON.parse(process.env.NEXT_PUBLIC_NC_COUNTY_RATES)
      } catch {}
    }
    const norm = (s: string) => s.trim().toLowerCase()
      shipping?.state === 'NC' && typeof shipping?.county === 'string' && shipping.county.trim() !== ''
        ? countyRates[norm(shipping.county)] || 0
        : 0
    const tax = shipping?.state === 'NC' ? subtotal * (baseRate + countyRate) : 0
    const total = subtotal + tax

    const amt = Math.round(total * 100)
    if (!Number.isFinite(amt) || amt < 50) return res.status(400).json({ error: 'Invalid amount (min 50¢)' })

    const pi = await stripe.paymentIntents.create({
      amount: amt,
      currency,
      payment_method_types: ['card', 'link'],   // stay on-site with Link + card
      receipt_email: email || undefined,
      metadata: {
        order_name: String(name ?? '').slice(0, 120),
        order_email: String(email ?? '').slice(0, 120),
        items: items ? JSON.stringify(items).slice(0, 450) : '',
        tax: tax.toFixed(2),
        subtotal: subtotal.toFixed(2),
      },
      shipping: shipping?.address1
        ? {
            name: name || email || 'Customer',
            phone: shipping.phone || undefined,
            address: {
              line1: shipping.address1,
              line2: shipping.address2 || undefined,
              city: shipping.city,
              state: shipping.state,
              postal_code: shipping.zip,
              country: 'US',
            },
          }
        : undefined,
    })

    return res.status(200).json({ clientSecret: pi.client_secret, subtotal, tax, total })
  } catch (err) {
    return res.status(500).json({ error: err?.message || 'Stripe error' })
  }
  add('name'); add('email'); add('phone')
  add('address1'); add('address2'); add('city'); add('state'); add('zip'); add('county')
  return m
}

// Instantiate Stripe using centralized key resolution
const stripe = new Stripe(getSecretKey().key, {
  apiVersion: STRIPE_API_VERSION as any,
} as any)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Secret key is resolved at module load via getSecretKey; if misconfigured, module would have thrown.

  let body: Body
  try {
    body = (typeof req.body === 'string') ? JSON.parse(req.body) : (req.body as Body)
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' })
  }

  const {
    intentId,
    items,
    amount: amountCents,
    shipping: shippingCents = 0,
    email = '',
    name = '',
    currency = 'usd',
  state = 'Other',
  county: countyRaw = '',
  zip = '',
  city = '',
    billing,
    shippingAddress,
  } = body

  try {
  const resolvedCounty = resolveCounty(zip, city, countyRaw)
  const { subtotal, tax, total, totalCents, subtotalCents, taxCents, combinedRate, shippingTaxable } = calcTotals({
      items,
      amountCents,
      state,
      county: resolvedCounty,
      shippingCents,
    })

    const baseMeta: Record<string, string> = {
      email,
      name,
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
      state,
  county: resolvedCounty || '',
      tax_rate_percent: (combinedRate * 100).toFixed(4),
      shipping_taxable: shippingTaxable ? 'true' : 'false'
    }
    const metadata = {
      ...baseMeta,
  ...metaFrom('billing', billing),
  ...metaFrom('shipping', shippingAddress),
    }

    const resp = intentId
      ? await stripe.paymentIntents.update(intentId, {
          amount: totalCents,
          currency,
          receipt_email: email || undefined,
          metadata,
        })
      : await stripe.paymentIntents.create({
          amount: totalCents,
          currency,
          automatic_payment_methods: { enabled: true },
          receipt_email: email || undefined,
          metadata,
        })

    return res.status(200).json({
      clientSecret: resp.client_secret,
      intentId: resp.id,
      totals: { subtotal, tax, total }, // dollars
      breakdown: { subtotal: subtotalCents, tax: taxCents, shipping: Math.round(shippingCents), taxRatePercent: Number((combinedRate * 100).toFixed(4)) }, // cents for UI + rate
    })
  } catch (err: any) {
    console.error('PI error:', err)
    const msg = err?.raw?.message || err?.message || 'Stripe error'
    return res.status(500).json({ error: msg })
  }
}
