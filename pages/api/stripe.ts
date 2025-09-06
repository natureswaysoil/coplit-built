import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { getSecretKey, STRIPE_API_VERSION } from '../../lib/stripeConfig'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let secret: string
  try {
    secret = getSecretKey().key
  } catch {
    return res.status(500).json({ error: 'Missing STRIPE_SECRET_KEY' })
  }

  try {
    const stripe = new Stripe(secret, { apiVersion: STRIPE_API_VERSION } as any)
    const { amount, currency = 'usd' } = req.body || {}

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' })
    }

    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // cents
      currency,
      automatic_payment_methods: { enabled: true },
    })

    return res.status(200).json({ clientSecret: intent.client_secret })
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Stripe error' })
  }
}
