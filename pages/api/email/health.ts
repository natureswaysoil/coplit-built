import type { NextApiRequest, NextApiResponse } from 'next'

// Health / diagnostics for email provider (currently Resend).
// Secured by X-ADMIN-TOKEN like other admin endpoints.
// Does NOT leak secrets. Provides high-level status only.
// Response shape:
// { ok: boolean, provider: 'resend', configured: boolean, reachable?: boolean, from?: string, error?: string }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  if (req.headers['x-admin-token'] !== process.env.ADMIN_API_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM || 'alerts@natureswaysoil.com'
  const configured = Boolean(apiKey)

  if (!configured) {
    return res.status(200).json({ ok: true, provider: 'resend', configured: false })
  }

  // Probe Resend API with a lightweight request (list domains) to confirm reachability.
  let reachable = false
  let domains: any[] | undefined
  let error: string | undefined
  try {
    const r = await fetch('https://api.resend.com/domains', {
      method: 'GET',
      headers: { Authorization: `Bearer ${apiKey}` }
    })
    if (r.ok) {
      const data = await r.json()
      domains = Array.isArray(data?.data) ? data.data.map((d: any) => ({ id: d.id, name: d.name, status: d.status })) : undefined
      reachable = true
    } else {
      error = `resend_http_${r.status}`
    }
  } catch (e: any) {
    error = e?.message || 'fetch_failed'
  }

  // Infer from domain portion of FROM address
  const fromDomain = from.split('@')[1] || null
  const fromDomainStatus = domains?.find(d => d.name === fromDomain)?.status

  return res.status(200).json({
    ok: true,
    provider: 'resend',
    configured,
    reachable,
    from,
    fromDomain,
    fromDomainStatus,
    domains,
    error
  })
}
