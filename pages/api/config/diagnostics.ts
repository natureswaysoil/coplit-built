import type { NextApiRequest, NextApiResponse } from 'next'
import { getPublishableKey, getSecretKey, getWebhookSecret, redactKey, STRIPE_API_VERSION, listSecretKeyCandidates, listPublishableKeyCandidates } from '../../../lib/stripeConfig'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const pk = getPublishableKey()
    const sk = getSecretKey()
    const wh = getWebhookSecret()
    return res.status(200).json({
      ok: true,
      env: process.env.VERCEL_ENV || process.env.NODE_ENV || 'unknown',
      stripeApiVersion: STRIPE_API_VERSION,
      publishableKey: { source: pk.source, redacted: redactKey(pk.key) },
  publishableKeyCandidates: listPublishableKeyCandidates(),
      secretKey: { source: sk.source, redacted: redactKey(sk.key) },
      secretKeyCandidates: listSecretKeyCandidates(),
      webhookSecret: wh ? { source: wh.source, redacted: redactKey(wh.key) } : null,
    })
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message })
  }
}
