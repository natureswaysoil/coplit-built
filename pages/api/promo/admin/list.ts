import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  if (req.headers['x-admin-token'] !== process.env.ADMIN_API_TOKEN) return res.status(401).json({ error: 'Unauthorized' })
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return res.status(500).json({ error: 'Server misconfigured' })
  const supabaseAdmin = createClient(url, key, { auth: { persistSession: false } })
  const { data, error } = await supabaseAdmin.from('promo_codes').select('*').order('created_at', { ascending: false }).limit(200)
  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ ok: true, promo_codes: data })
}
