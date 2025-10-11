import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabaseClient'
import { normalizeProducts } from '@/lib/productNormalizer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const q = (req.query.q as string || '').trim()
  const limit = Math.min(50, parseInt(req.query.limit as string, 10) || 20)
  if (!q) return res.status(400).json({ error: 'Missing q parameter' })

  // Try RPC trigram search
  try {
    const { data, error } = await (supabase as any).rpc('search_products', { q, lim: limit })
    if (!error && Array.isArray(data)) {
      return res.json({ ok: true, source: 'rpc', count: data.length, results: data })
    }
  } catch (_) { /* ignore and fallback */ }

  // Fallback simple ilike on products
  try {
    let query = supabase.from('products').select('*').ilike('title', `%${q}%`).limit(limit)
    const { data: fallback, error: fbErr } = await query
    if (fbErr) return res.status(500).json({ error: fbErr.message })
    const normalized = normalizeProducts(fallback as any, false)
    return res.json({ ok: true, source: 'fallback', count: normalized.length, results: normalized })
  } catch (e: any) {
    return res.status(500).json({ error: e.message || 'Search failed' })
  }
}
