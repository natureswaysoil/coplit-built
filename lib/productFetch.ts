import { supabase } from '@/lib/supabaseClient'
import { normalizeFromRow, normalizeFromStatic, NormalizedProduct } from '@/lib/productNormalizer'
import { products as staticProducts } from '@/lib/products'

function slugify(input: string): string {
  return (input || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export async function fetchProductWithVariationsBySlug(slugOrId: string): Promise<NormalizedProduct | null> {
  // Try DB: look up by slug first then fallback to id matching
  try {
    const { data: rows, error } = await (supabase as any)
      .from('products')
      .select('*')
      .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
      .limit(1)
    if (!error && rows && rows.length) {
      const base = normalizeFromRow(rows[0])
      // Enrich with static metadata (usageInstructions) using multiple matching strategies
      try {
        const candidates = new Set<string>()
        if (base.slug) candidates.add(base.slug)
        if (rows[0]?.slug) candidates.add(String(rows[0].slug))
        if (rows[0]?.title) candidates.add(slugify(String(rows[0].title)))
        candidates.add(String(slugOrId))

        let staticMatch = undefined as any
        for (const s of Array.from(candidates)) {
          staticMatch = staticProducts.find(p => (p as any).slug === s)
          if (staticMatch) break
        }
        // Fallback: try keyword match
        if (!staticMatch && rows[0]?.keyword) {
          staticMatch = staticProducts.find(p => (p as any).keyword === rows[0].keyword)
        }
        // Fallback: loose title match
        if (!staticMatch && rows[0]?.title) {
          staticMatch = staticProducts.find(p => slugify((p as any).title) === slugify(String(rows[0].title)))
        }
        if (staticMatch && (staticMatch as any).usageInstructions && !(base as any).usageInstructions) {
          ;(base as any).usageInstructions = (staticMatch as any).usageInstructions
        }
      } catch {}
      // fetch variations
      try {
        const { data: vars, error: vErr } = await (supabase as any)
          .from('product_variations')
          .select('size,price,sku,inventory,product_id')
          .eq('product_id', rows[0].id)
        if (!vErr && Array.isArray(vars) && vars.length) {
          base.variations = vars.map((v: any) => ({ size: v.size, price: v.price, sku: v.sku }))
          // choose base price if missing
          if (!base.price) {
            const min = [...vars].sort((a,b) => a.price - b.price)[0]
            if (min) base.price = min.price
          }
        }
      } catch (_) { /* ignore variation fetch errors */ }
      return base
    }
  } catch (_) { /* ignore DB errors */ }

  // Static fallback: match id or slug (we only have ids currently) 
  const staticMatch = staticProducts.find(p => p.id === slugOrId || (p as any).slug === slugOrId)
  if (staticMatch) return normalizeFromStatic(staticMatch as any)
  return null
}
