import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'PATCH') return res.status(405).json({ error: 'Method not allowed' })
  if (req.headers['x-admin-token'] !== process.env.ADMIN_API_TOKEN) return res.status(401).json({ error: 'Unauthorized' })
  const { id, ...payload } = req.body || {}
  if (!id) return res.status(400).json({ error: 'Missing id' })
  if (payload.discount_type && !['percent','fixed'].includes(payload.discount_type)) return res.status(400).json({ error: 'Invalid discount_type' })
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return res.status(500).json({ error: 'Server misconfigured' })
  const supabaseAdmin = createClient(url, key, { auth: { persistSession: false } })
  const { data, error } = await supabaseAdmin.from('promo_codes').update(payload).eq('id', id).select('*').limit(1)
  if (error) return res.status(500).json({ error: error.message })
  if (!data || !data.length) return res.status(404).json({ error: 'Not found' })
  return res.status(200).json({ ok: true, promo: data[0] })
}
