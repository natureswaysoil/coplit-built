import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (req.headers['x-admin-token'] !== process.env.ADMIN_API_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const { product_id, size, price, sku, inventory } = req.body || {}
  if (!product_id || !size || typeof price !== 'number' || !sku) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  const { data, error } = await (supabase as any).from('product_variations').insert({ product_id, size, price, sku, inventory }).select('*').single()
  if (error) return res.status(500).json({ error: error.message })
  return res.json({ ok: true, variation: data })
}
