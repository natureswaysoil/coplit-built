import { supabase } from '@/lib/supabaseClient'
import { normalizeFromRow, normalizeFromStatic, NormalizedProduct } from '@/lib/productNormalizer'
import { products as staticProducts } from '@/lib/products'

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
