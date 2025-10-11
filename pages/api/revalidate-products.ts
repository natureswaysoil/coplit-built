import type { NextApiRequest, NextApiResponse } from 'next'
import { products as staticProducts } from '@/lib/products'
import { supabase } from '@/lib/supabaseClient'

// Simple ISR revalidation endpoint.
// Requires a secret token to prevent abuse. Set REVALIDATE_SECRET in your env.
// Optional query params:
//   ?all=true  -> revalidate /products and every product slug
//   ?slug=foo  -> revalidate a single product page
// Without params defaults to revalidating the products index only.

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const secret = process.env.REVALIDATE_SECRET
  if (!secret) {
    return res.status(500).json({ error: 'REVALIDATE_SECRET not configured' })
  }
  if ((req.query.secret || req.headers['x-revalidate-secret']) !== secret) {
    return res.status(401).json({ error: 'Invalid secret' })
  }

  // Always revalidate index unless explicitly skipped (skipIndex=true)
  const toRevalidate: string[] = []
  const skipIndex = req.query.skipIndex === 'true'
  if (!skipIndex) toRevalidate.push('/products')

  const all = req.query.all === 'true'
  const oneSlug = typeof req.query.slug === 'string' ? req.query.slug : undefined

  if (all) {
    // Try live DB slugs first
    let usedDb = false
    try {
      const { data: rows, error } = await (supabase as any).from('products').select('slug,id')
      if (!error && rows) {
        for (const r of rows as any[]) {
          const slug = r.slug || r.id
          toRevalidate.push(`/products/${slug}`)
        }
        usedDb = true
      }
    } catch (_) {
      // ignore
    }
    if (!usedDb) {
      for (const p of staticProducts) {
        toRevalidate.push(`/products/${p.id}`)
      }
    }
  } else if (oneSlug) {
    toRevalidate.push(`/products/${oneSlug}`)
  }

  const results: Record<string, any> = {}
  for (const path of toRevalidate) {
    try {
      await res.revalidate(path)
      results[path] = 'ok'
    } catch (e: any) {
      results[path] = { error: e?.message || 'revalidate failed' }
    }
  }

  return res.json({ revalidated: results, attempted: toRevalidate.length })
}
