import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabaseClient'
import { normalizeProducts, NormalizedProduct } from '@/lib/productNormalizer'
import { products as staticProducts } from '@/lib/products'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { searchParams } = new URL(req.url || 'http://localhost')
  const source = searchParams.get('source') // 'db' | 'static' | null
  const search = (searchParams.get('search') || searchParams.get('q') || '').trim()
  const includeInactive = searchParams.get('include') === 'inactive' || searchParams.get('include_inactive') === 'true'
  const limitParam = searchParams.get('limit')
  const limit = limitParam ? Math.min(100, Math.max(1, parseInt(limitParam, 10) || 20)) : 50

  let normalized: NormalizedProduct[] = []
  let used = 'db'
  let error: string | undefined

  if (source !== 'static') {
    try {
      let query = supabase.from('products').select('*').limit(limit)
      if (!includeInactive) query = query.eq('is_active', true)
      if (search) {
        // Simple ILIKE filter; for better relevance combine fields
        query = query.or(`title.ilike.%${search}%,keyword.ilike.%${search}%`)
      }
      const { data, error: dbError } = await query
      if (dbError) {
        error = dbError.message
      } else if (data && data.length) {
        normalized = normalizeProducts(data as any, false)
      }
    } catch (e: any) {
      error = e?.message || 'Unknown DB error'
    }
  }

  if (!normalized.length) {
    used = 'static'
    // Simple fallback slice
    normalized = normalizeProducts(null, true).slice(0, limit)
  }

  return res.status(200).setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300').json({
    ok: true,
    count: normalized.length,
    source: used,
    fallback: used === 'static',
    error: error || null,
    products: normalized
  })
}