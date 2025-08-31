// pages/api/webhooks/stripe.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export const config = { api: { bodyParser: false } };

function buffer(readable: any) {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: any[] = [];
    readable.on("data", (chunk: any) => chunks.push(Buffer.from(chunk)));
    readable.on("end", () => resolve(Buffer.concat(chunks)));
    readable.on("error", reject);
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const ordersTable = process.env.SUPABASE_ORDERS_TABLE || "orders";
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
  const apiVersion = (process.env.STRIPE_API_VERSION as Stripe.LatestApiVersion | undefined) || "2024-06-20";
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion });

  const buf = await buffer(req);
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig as string, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object as Stripe.PaymentIntent;
      const calcId = (pi.metadata as any)?.tax_calculation;
      let taxTxId: string | null = null;
      if (calcId) {
        try {
          const tx = await stripe.tax.transactions.createFromCalculation({ calculation: calcId, reference: pi.id } as any);
          taxTxId = (tx as any).id || null;
          await stripe.paymentIntents.update(pi.id, { metadata: { ...pi.metadata, tax_transaction: taxTxId || "created" } });
        } catch (e) {
          console.error("Tax transaction creation failed:", e);
        }
      }
      await supabaseAdmin.from(ordersTable).update({ status: "paid", stripe_tax_transaction_id: taxTxId }).eq("stripe_payment_intent_id", pi.id);
    }

    if (event.type === "payment_intent.payment_failed") {
      const pi = event.data.object as Stripe.PaymentIntent;
      await supabaseAdmin.from(ordersTable).update({ status: "failed" }).eq("stripe_payment_intent_id", pi.id);
    }
  } catch (err) {
    console.error("Webhook handler failed:", err);
    return res.status(500).send("Webhook handler error");
  }

  res.json({ received: true });
}
