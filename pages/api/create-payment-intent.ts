import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const secret = process.env.STRIPE_SECRET_KEY
  if (!secret) return res.status(500).json({ error: 'Missing STRIPE_SECRET_KEY' })

  try {
    const { amount, currency = 'usd' } = req.body || {}

    if (typeof amount !== 'number' || !(amount > 0)) {
      return res.status(400).json({ error: 'Invalid amount' })
    }

    const body = new URLSearchParams()
    body.append('amount', String(Math.round(amount * 100)))
    body.append('currency', currency)
    body.append('automatic_payment_methods[enabled]', 'true')

    const resp = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secret}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    })

    const data = await resp.json()
    if (!resp.ok) {
      return res.status(resp.status).json({ error: data?.error?.message || 'Stripe error' })
    }

    return res.status(200).json({ clientSecret: data.client_secret })
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Stripe error' })
  }
}
