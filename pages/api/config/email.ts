import type { NextApiRequest, NextApiResponse } from 'next'

function redact(val?: string | null, show = 6) {
  if (!val) return null
  return `${val.slice(0, show)}…`
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const from = process.env.RESEND_FROM || null
  const key = process.env.RESEND_API_KEY || null
  const env = process.env.VERCEL_ENV || process.env.NODE_ENV || 'unknown'

  return res.status(200).json({
    ok: true,
    env,
    resend: {
      hasApiKey: !!key,
      apiKeyRedacted: redact(key || null),
      from,
      hints: !key || !from ? 'Set RESEND_API_KEY and RESEND_FROM env vars. Verify your domain DKIM in Resend.' : undefined,
    },
  })
}
