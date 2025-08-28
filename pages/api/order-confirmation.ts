import { orderConfirmationHTML } from '../../lib/emailTemplates'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return res.status(501).json({ error: 'Email not configured' })

  const { orderId, email, name, items, subtotal, tax = 0, total } = req.body || {}
  if (!orderId || !email || !name || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const from = process.env.RESEND_FROM || 'Nature\'s Way Soil <no-reply@natureswaysoil.com>'
  const support = process.env.SUPPORT_TO || 'support@natureswaysoil.com'
  const bccList = support.split(',').map((s) => s.trim()).filter(Boolean)

  const lines = items.map((it: any) => `${it.title} – ${it.size} – ${it.qty} × $${Number(it.price).toFixed(2)} (SKU: ${it.sku})`).join('\n')
  const text = `Hi ${name},\n\nThanks for your order!\n\nOrder ID: ${orderId}\n\nItems:\n${lines}\n\nSubtotal: $${Number(subtotal).toFixed(2)}\nSales Tax: $${Number(tax).toFixed(2)}\nTotal: $${Number(total ?? (Number(subtotal) + Number(tax))).toFixed(2)}\n\nIf you have any questions, reply to this email or contact ${support}.\n\n— Nature's Way Soil`

  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [email],
        bcc: bccList,
        subject: `Your Nature's Way Soil order ${orderId}`,
        text,
  html: orderConfirmationHTML({ orderId, name, email, items, subtotal, tax, total }),
      }),
    })
    const data = await resp.json()
    if (!resp.ok) return res.status(500).json({ error: 'Failed to send', details: data })
    return res.status(200).json({ ok: true })
  } catch (err: any) {
    return res.status(500).json({ error: 'Unexpected error', details: err?.message || String(err) })
  }
}
