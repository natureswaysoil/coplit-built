import { contactHTML } from '../../lib/emailTemplates'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { name, email, message, department } = req.body || {}
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM || 'Nature\'s Way Soil <no-reply@natureswaysoil.com>'
  const supportList = (process.env.SUPPORT_TO || 'support@natureswaysoil.com')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
  const salesList = (process.env.SALES_TO || 'sales@natureswaysoil.com')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
  const jamesList = (process.env.JAMES_TO || 'james@natureswaysoil.com')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

  const toList = department === 'sales' ? salesList : department === 'james' ? jamesList : supportList

  if (!apiKey) {
    return res.status(501).json({ error: 'Email not configured' })
  }

  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: toList,
        reply_to: email,
        subject: `New ${department || 'support'} contact from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
        html: contactHTML({ name, email, message, department }),
      }),
    })

    const data = await resp.json()
    if (!resp.ok) {
      return res.status(500).json({ error: 'Failed to send email', details: data })
    }

    return res.status(200).json({ ok: true })
  } catch (err: any) {
    return res.status(500).json({ error: 'Unexpected error', details: err?.message || String(err) })
  }
}
