// pages/api/create-payment-intent.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

type ReqBody = {
  amount: number;         // subtotal in cents (without shipping/tax)
  currency?: string;      // default 'usd'
  zip?: string;
  state?: string;         // default from NEXT_PUBLIC_TAX_STATE
  shipping?: number;      // shipping in cents (optional)
  tax?: number;           // explicit tax in cents (optional)
  metadata?: Record<string, string>;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const {
      amount,
      currency = 'usd',
      zip,
      state = process.env.NEXT_PUBLIC_TAX_STATE || 'NC',
      shipping = 0,
      tax: taxFromClient,
      metadata = {},
    } = (req.body || {}) as ReqBody;

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: 'Missing STRIPE_SECRET_KEY' });
    }
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // --- Simple NC tax fallback (replace with your ZIP→county logic when ready)
    let tax = typeof taxFromClient === 'number' ? taxFromClient : 0;
    if (tax === 0 && (state || '').toUpperCase() === 'NC') {
      const defaultRate = parseFloat(process.env.NEXT_PUBLIC_TAX_DEFAULT_RATE || '0.0725'); // 7.25% default
      // You can branch per-county using the ZIP later
      tax = Math.round((amount + shipping) * defaultRate);
    }

    const total = amount + shipping + tax;

    const pi = await stripe.paymentIntents.create({
      amount: total,
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: {
        ...metadata,
        state,
        zip: zip || '',
        shipping_cents: String(shipping ?? 0),
        tax_cents: String(tax),
        subtotal_cents: String(amount),
      },
    });

    return res.status(200).json({
      clientSecret: pi.client_secret,
      total,
      breakdown: { subtotal: amount, shipping, tax },
    });
  } catch (err: any) {
    console.error('create-payment-intent error', err);
    return res.status(500).json({ error: err?.message || 'Server error' });
  }
}

