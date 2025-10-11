import type { NextApiRequest, NextApiResponse } from 'next'
import { sendBasicEmail, isEmailConfigured } from '../../../lib/resendClient'
import { renderBrandedShell } from '../../../lib/emailTemplates'

// Sends a branded test email through Resend (or logs in mock mode) to verify configuration.
// Secured by X-ADMIN-TOKEN to prevent abuse.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (req.headers['x-admin-token'] !== process.env.ADMIN_API_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const to = (req.body?.to as string) || process.env.SUPPORT_TO || 'support@natureswaysoil.com'
  const subject = 'Resend Test Email'
  const bodyHtml = `<p>This is a test email sent from <code>/api/email/test</code>.</p>
    <p style='font-size:12px;color:#64748b'>Mode: ${isEmailConfigured() ? 'live (SDK)' : 'mock (no API key set)'}</p>`
  const html = renderBrandedShell({ title: 'Email Delivery Test', bodyHtml })

  if (!isEmailConfigured()) {
    // Still call sendBasicEmail which will console.log mock send and return mock id.
    try {
      const details = await sendBasicEmail({ to, subject, html })
      return res.status(200).json({ ok: true, details, configured: false })
    } catch (e: any) {
      return res.status(500).json({ error: e?.message || 'Unexpected error (mock path)' })
    }
  }

  try {
    const details = await sendBasicEmail({ to, subject, html })
    return res.status(200).json({ ok: true, details, configured: true })
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Unexpected error' })
  }
}
