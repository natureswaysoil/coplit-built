import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const to = String((req.body?.to || req.query.to || '')).trim()
  if (!to) return res.status(400).json({ error: 'Missing to' })

  const key = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM
  if (!key || !from) return res.status(500).json({ error: 'Missing RESEND_API_KEY or RESEND_FROM' })

  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: 'Resend test email',
        text: 'Hello from Nature\'s Way Soil — test email via Resend.'
      }),
    })
    const data = await resp.json()
    if (!resp.ok) return res.status(resp.status).json({ error: data?.message || 'Resend error', data })
    return res.status(200).json({ ok: true, data })
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Failed to send test email' })
  }
}
