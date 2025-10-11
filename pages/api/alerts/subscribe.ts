import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (req.headers['x-admin-token'] !== process.env.ADMIN_API_TOKEN) return res.status(401).json({ error: 'Unauthorized' })
  const { email, product_id, threshold, is_active } = req.body || {}
  if (!email) return res.status(400).json({ error: 'Missing email' })
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return res.status(500).json({ error: 'Server misconfigured' })
  const supabaseAdmin = createClient(url, key, { auth: { persistSession: false } })
  const insert = [{ email, product_id, threshold: threshold ?? 5, is_active: is_active !== false }]
  const { data, error } = await supabaseAdmin.from('inventory_alert_subscriptions').insert(insert).select('*').limit(1)
  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ ok: true, subscription: data![0] })
}
