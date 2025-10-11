import type { NextApiRequest, NextApiResponse } from 'next'

// Simple test endpoint to send a Resend email
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'Missing RESEND_API_KEY' })

  // Accept either query (GET) or body (POST)
  const payload = req.method === 'GET' ? req.query : (typeof req.body === 'string' ? JSON.parse(req.body) : req.body)

  const to = String(payload?.to || '').trim()
  const subject = String(payload?.subject || 'Test email from Nature\'s Way Soil').trim()
  const from = String(payload?.from || process.env.RESEND_FROM || "Nature's Way Soil <no-reply@natureswaysoil.com>")
  const text = String(payload?.text || 'This is a test email sent via Resend API.').trim()
  const html = String(payload?.html || `<p>This is a <strong>test email</strong> sent via Resend API.</p>`)

  if (!to) return res.status(400).json({ error: 'Missing to parameter (recipient email)' })

  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to: [to], subject, text, html }),
    })

    const data = await resp.json()
    if (!resp.ok) {
      // Bubble up Resend error but do not leak secrets
      return res.status(resp.status).json({ error: data?.error || 'Resend error', details: data })
    }

    return res.status(200).json({ ok: true, id: data?.id || null })
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Failed to send test email' })
  }
}
