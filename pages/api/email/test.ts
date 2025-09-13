import type { NextApiRequest, NextApiResponse } from 'next'

// Sends a simple test email through Resend to verify configuration.
// Secured by X-ADMIN-TOKEN to prevent abuse.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (req.headers['x-admin-token'] !== process.env.ADMIN_API_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM || "Nature's Way Soil <no-reply@natureswaysoil.com>"
  const to = (req.body?.to as string) || process.env.SUPPORT_TO || 'support@natureswaysoil.com'

  if (!apiKey) return res.status(501).json({ error: 'Email not configured' })

  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: 'Resend Test Email',
        text: 'This is a test email sent from /api/email/test.',
        html: '<p>This is a test email sent from <code>/api/email/test</code>.</p>',
      }),
    })
    const data = await resp.json()
    if (!resp.ok) return res.status(500).json({ error: 'Failed to send', details: data })
    return res.status(200).json({ ok: true, details: data })
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Unexpected error' })
  }
}
