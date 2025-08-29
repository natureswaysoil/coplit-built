// pages/api/create-payment-intent.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const secret = process.env.STRIPE_SECRET_KEY
  if (!secret) return res.status(500).json({ error: 'Missing STRIPE_SECRET_KEY' })

  try {
    // ✅ do NOT hard-code apiVersion; let the SDK’s pinned version match its types
    const stripe = new Stripe(secret)

    // pass dollars (default) or cents with isCents=true
    const { amount, currency = 'usd', isCents = false } =
      (req.body || {}) as { amount: number; currency?: string; isCents?: boolean }

    const amt = isCents ? Math.floor(amount) : Math.round(amount * 100)
    if (!Number.isFinite(amt) || amt < 50) return res.status(400).json({ error: 'Invalid amount (min 50¢)' })

    const intent = await stripe.paymentIntents.create({
      amount: amt,
      currency,
      automatic_payment_methods: { enabled: true },
    })

    return res.status(200).json({ clientSecret: intent.client_secret })
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Stripe error' })
  }
}
