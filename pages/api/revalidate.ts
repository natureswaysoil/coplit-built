import type { NextApiRequest, NextApiResponse } from 'next'
import { products as staticProducts } from '@/lib/products'
import { supabase } from '@/lib/supabaseClient'

// Unified revalidation endpoint used by the admin dashboard.
// Auth: either X-ADMIN-TOKEN header OR x-revalidate-secret header / ?secret= param.
// Query / Body params:
//   slug: revalidate one product page
//   all=true: revalidate all product pages
//   skipIndex=true: skip /products index page
// If neither slug nor all provided revalidates only /products (unless skipIndex=true)
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const adminToken = req.headers['x-admin-token']
  const revalSecret = req.headers['x-revalidate-secret'] || req.query.secret
  const secret = process.env.REVALIDATE_SECRET
  if (!secret) return res.status(500).json({ error: 'REVALIDATE_SECRET not configured' })
  if (adminToken !== process.env.ADMIN_API_TOKEN && revalSecret !== secret) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { slug } = req.body || {}
  const all = req.body?.all || req.query.all === 'true'
  const skipIndex = req.body?.skipIndex || req.query.skipIndex === 'true'

  const toRevalidate: string[] = []
  if (!skipIndex) toRevalidate.push('/products')

  if (all) {
    let usedDb = false
    try {
      const { data: rows, error } = await (supabase as any).from('products').select('slug,id')
      if (!error && rows) {
        for (const r of rows as any[]) {
          const s = r.slug || r.id
          toRevalidate.push(`/products/${s}`)
        }
        usedDb = true
      }
    } catch (_) {}
    if (!usedDb) {
      for (const p of staticProducts) toRevalidate.push(`/products/${p.slug || p.id}`)
    }
  } else if (slug) {
    toRevalidate.push(`/products/${slug}`)
  }

  const results: Record<string,string|object> = {}
  for (const path of toRevalidate) {
    try { await res.revalidate(path); results[path] = 'ok' } catch (e: any) { results[path] = { error: e?.message || 'failed' } }
  }

  return res.status(200).json({ ok: true, revalidated: results, count: toRevalidate.length })
}
