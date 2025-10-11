import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

// Server-side admin update (Node runtime, not edge) to adjust inventory.
// Auth: require header X-ADMIN-TOKEN == process.env.ADMIN_API_TOKEN

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const token = req.headers['x-admin-token']
  if (!process.env.ADMIN_API_TOKEN) {
    return res.status(500).json({ error: 'ADMIN_API_TOKEN not set on server' })
  }
  if (token !== process.env.ADMIN_API_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { id, inventory, is_active } = req.body || {}
  if (!id || (inventory !== 0 && !inventory && inventory !== 0)) {
    return res.status(400).json({ error: 'Missing id or inventory' })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    return res.status(500).json({ error: 'Server misconfigured for Supabase' })
  }

  const supabaseAdmin = createClient(url, serviceKey, { auth: { persistSession: false } })
  const updatePayload: any = { inventory }
  if (typeof is_active === 'boolean') updatePayload.is_active = is_active

  const { data, error } = await supabaseAdmin.from('products').update(updatePayload).eq('id', id).select('id, inventory, is_active').maybeSingle()
  if (error) return res.status(500).json({ error: error.message })

  return res.status(200).json({ ok: true, product: data })
}