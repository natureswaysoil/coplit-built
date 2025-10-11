import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import { normalizeFromRow } from '@/lib/productNormalizer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (!process.env.ADMIN_API_TOKEN) return res.status(500).json({ error: 'ADMIN_API_TOKEN not set' })
  if (req.headers['x-admin-token'] !== process.env.ADMIN_API_TOKEN) return res.status(401).json({ error: 'Unauthorized' })
  const { title, slug, price, keyword, short_description, details, image_url, inventory, is_active } = req.body || {}
  if (!title) return res.status(400).json({ error: 'Missing title' })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return res.status(500).json({ error: 'Server misconfigured' })

  const supabaseAdmin = createClient(url, key, { auth: { persistSession: false } })
  const insert = [{ title, slug, price, keyword, short_description, details, image_url, inventory, is_active }]
  const { data, error } = await supabaseAdmin.from('products').insert(insert).select('*').limit(1)
  if (error) return res.status(500).json({ error: error.message })
  const product = normalizeFromRow(data![0] as any)
  return res.status(200).json({ ok: true, product })
}