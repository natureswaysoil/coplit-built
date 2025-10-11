import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabaseClient'
import { products as staticProducts } from '@/lib/products'

// Batch revalidation allowing chunked pagination over large catalogs.
// Params (query or JSON body):
//   page: 0-based page number (default 0)
//   size: page size (default 50, max 500)
//   includeIndex=true to also revalidate /products on first page
// Auth: X-ADMIN-TOKEN or x-revalidate-secret
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const adminToken = req.headers['x-admin-token']
  const revalSecret = req.headers['x-revalidate-secret'] || req.query.secret
  const secret = process.env.REVALIDATE_SECRET
  if (adminToken !== process.env.ADMIN_API_TOKEN && revalSecret !== secret) return res.status(401).json({ error: 'Unauthorized' })

  const page = Number((req.body?.page ?? req.query.page) || 0)
  let size = Number((req.body?.size ?? req.query.size) || 50)
  if (size > 500) size = 500
  const includeIndex = (req.body?.includeIndex ?? req.query.includeIndex) === 'true' || page === 0

  const offset = page * size
  const toRevalidate: string[] = []
  if (includeIndex && page === 0) toRevalidate.push('/products')

  // Try DB slice
  let usedDb = false
  try {
    const { data, error } = await (supabase as any).from('products').select('slug,id').range(offset, offset + size - 1)
    if (!error && data && data.length) {
      data.forEach((r: any) => toRevalidate.push(`/products/${r.slug || r.id}`))
      usedDb = true
    }
  } catch {}
  if (!usedDb) {
    staticProducts.slice(offset, offset + size).forEach(p => toRevalidate.push(`/products/${p.slug || p.id}`))
  }

  const results: Record<string,string|object> = {}
  for (const path of toRevalidate) {
    try { await res.revalidate(path); results[path] = 'ok' } catch (e: any) { results[path] = { error: e?.message || 'failed' } }
  }
  return res.status(200).json({ ok: true, page, size, revalidated: results, count: toRevalidate.length })
}
