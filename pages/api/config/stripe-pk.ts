import type { NextApiRequest, NextApiResponse } from 'next'
import { getPublishableKey, redactKey } from '../../../lib/stripeConfig'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  try {
    const { key, source } = getPublishableKey()
    return res.status(200).json({ publishableKey: key, source, redacted: redactKey(key) })
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Stripe publishable key not configured' })
  }
}
