import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'PATCH') return res.status(405).json({ error: 'Method not allowed' })
  if (req.headers['x-admin-token'] !== process.env.ADMIN_API_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const { id, size, price, sku, inventory } = req.body || {}
  if (!id) return res.status(400).json({ error: 'Missing id' })
  const patch: any = {}
  if (size !== undefined) patch.size = size
  if (price !== undefined) patch.price = price
  if (sku !== undefined) patch.sku = sku
  if (inventory !== undefined) patch.inventory = inventory
  if (Object.keys(patch).length === 0) return res.status(400).json({ error: 'No fields to update' })
  const { data, error } = await (supabase as any).from('product_variations').update(patch).eq('id', id).select('*').single()
  if (error) return res.status(500).json({ error: error.message })
  return res.json({ ok: true, variation: data })
}
