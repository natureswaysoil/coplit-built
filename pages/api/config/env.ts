import type { NextApiRequest, NextApiResponse } from 'next'
import { redactKey } from '../../../lib/stripeConfig'

const NAMES = [
  // Publishable candidates
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_PUBLISHABLE_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLIC_KEY',
  'STRIPE_PUBLIC_KEY',
  'NEXT_PUBLIC_STRIPE_KEY',
  'NEXT_PUBLIC_STRIPE',
  'STRIPE_KEY',
  'STRIPE_PK',
  'NEXT_PUBLIC_STRIPE_PK',
  // Secret candidates
  'STRIPE_API_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_PRIVATE_KEY',
  'STRIPE_SECRET',
  'STRIPE_TOKEN',
  'STRIPE_SECRET_TOKEN',
  // Webhook candidates
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_WEBHOOK_SIGNING_SECRET',
  'STRIPE_SIGNING_SECRET',
  'STRIPE_WEBHOOK_SECRET_LIVE',
]

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const entries = NAMES.map(name => {
    const raw = process.env[name]
    const red = redactKey(raw || null)
    return { name, present: !!raw, redacted: red }
  })

  return res.status(200).json({
    ok: true,
    env: process.env.VERCEL_ENV || process.env.NODE_ENV || 'unknown',
    vercel: {
      url: process.env.VERCEL_URL || null,
      projectId: process.env.VERCEL_PROJECT_ID || null,
    },
    stripeEnv: entries,
  })
}
