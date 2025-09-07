import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const apiKeyPresent = Boolean(process.env.RESEND_API_KEY)
  const from = process.env.RESEND_FROM || ''
  const supportTo = process.env.SUPPORT_TO || ''
  const salesTo = process.env.SALES_TO || ''
  const dmarc = process.env.DMARC || null
  return res.status(200).json({
    ok: true,
    apiKeyPresent,
    from,
    supportTo,
    salesTo,
    notes: [
      'Ensure your domain is verified in Resend with 3 DKIM CNAMEs and SPF include:spf.resend.com',
      'Use a from address on your verified domain (e.g., support@natureswaysoil.com)'
    ],
  })
}
