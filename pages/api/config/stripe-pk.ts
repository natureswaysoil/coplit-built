import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  // Allow either var; publishable keys are safe to expose.
  const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || process.env.STRIPE_PUBLISHABLE_KEY || ''
  if (!pk) return res.status(500).json({ error: 'Stripe publishable key not configured' })
  return res.status(200).json({ publishableKey: pk })
}
