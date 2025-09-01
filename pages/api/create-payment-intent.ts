// pages/api/create-payment-intent.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { amount = 0, currency = 'usd', shipping = 0, tax = 0, metadata = {} } = req.body || {};
    if (!process.env.STRIPE_SECRET_KEY) return res.status(500).json({ error: 'Missing STRIPE_SECRET_KEY' });
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

    const total = amount + shipping + tax;

    const pi = await stripe.paymentIntents.create({
      amount: total,
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: { ...metadata, subtotal_cents: String(amount), shipping_cents: String(shipping), tax_cents: String(tax) },
    });

    res.status(200).json({ clientSecret: pi.client_secret, total, breakdown: { subtotal: amount, shipping, tax } });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e?.message || 'Server error' });
  }
}
