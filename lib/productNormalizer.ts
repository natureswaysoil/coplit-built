import { Product } from '@/types/Product'
import { ProductsRow } from '@/types/supabase'
import { products as staticProducts } from '@/lib/products'

export interface NormalizedProduct {
  id: string
  slug: string
  title: string
  description: string
  shortDescription?: string
  keyword?: string
  image: string
  price?: number
  variations?: { size: string; price: number; sku: string }[]
  inventory?: number | null
  available: boolean
  source: 'db' | 'static'
}

function coerceId(id: any): string {
  return typeof id === 'string' ? id : String(id)
}

export function normalizeFromRow(row: ProductsRow): NormalizedProduct {
  const inventory = (row as any).inventory ?? null
  const isActive = (row as any).is_active ?? true
  const obj: any = {
    id: coerceId(row.id),
    slug: row.slug || coerceId(row.id),
    title: row.title,
    description: row.details || row.short_description || row.title,
    keyword: row.keyword || undefined,
    image: row.image_url || '/screenshots/logo-with-tagline.png',
    // price only if value present
    ...(row.price !== undefined && row.price !== null ? { price: row.price } : {}),
    inventory,
    available: isActive && (inventory === null || inventory > 0),
    source: 'db'
  }
  if (row.short_description) obj.shortDescription = row.short_description
  // variations placeholder omitted unless future support added
  return obj as NormalizedProduct
}

export function normalizeFromStatic(p: Product): NormalizedProduct {
  const basePrice = p.price !== undefined ? p.price : p.variations?.[0]?.price
  const obj: any = {
    id: coerceId(p.id),
    slug: p.slug || coerceId(p.id),
    title: p.title,
    description: p.details || p.short_description || p.title,
    keyword: p.keyword,
    image: p.image_url || (p as any).image || '/screenshots/logo-with-tagline.png',
    ...(basePrice !== undefined ? { price: basePrice } : {}),
    ...(p.variations?.length ? { variations: p.variations } : {}),
    inventory: null,
    available: true,
    source: 'static'
  }
  if ((p as any).short_description) obj.shortDescription = (p as any).short_description
  return obj as NormalizedProduct
}

export function normalizeProducts(rows: ProductsRow[] | null, fallbackStatic = true): NormalizedProduct[] {
  const list: NormalizedProduct[] = []
  if (rows && rows.length) {
    for (const r of rows) list.push(normalizeFromRow(r))
  } else if (fallbackStatic) {
    for (const s of staticProducts) list.push(normalizeFromStatic(s))
  }
  return list
}

export function findProductBySlug(slug: string, rows: ProductsRow[] | null): NormalizedProduct | null {
  const normalized = normalizeProducts(rows, true)
  return normalized.find(p => p.slug === slug) || null
}

// Dev-time guard logging
export function logProductAnomalies(list: NormalizedProduct[]) {
  if (process.env.NODE_ENV === 'production') return
  for (const p of list) {
    if (!p.image || p.image.includes('logo-with-tagline')) {
      console.warn('[productNormalizer] Missing image for product', p.id, p.title, 'source=', p.source)
    }
    if (p.price === undefined && !p.variations?.length) {
      console.warn('[productNormalizer] Missing price and variations for product', p.id, p.title, 'source=', p.source)
    }
  }
}
