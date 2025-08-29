import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || process.env.STRIPE_PUBLISHABLE_KEY || ''
  const enabled = Boolean(process.env.STRIPE_SECRET_KEY) && Boolean(publishableKey)
  res.status(200).json({ publishableKey, enabled })
}
