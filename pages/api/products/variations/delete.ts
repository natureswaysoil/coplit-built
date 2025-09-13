import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' })
  if (req.headers['x-admin-token'] !== process.env.ADMIN_API_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const { id } = req.body || {}
  if (!id) return res.status(400).json({ error: 'Missing id' })
  const { error } = await supabase.from('product_variations').delete().eq('id', id)
  if (error) return res.status(500).json({ error: error.message })
  return res.json({ ok: true })
}
