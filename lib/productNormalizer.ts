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
  // 🎯 ADD THIS:
  usageInstructions?: {
    applicationRate: string
    mixing: string
    timing: string
    frequency: string
    method: string
    coverage?: string
    safety?: string
    tips?: string[]
  }
}

import { Product } from '@/types/Product'

function coerceId(id: string | number): string {
  return typeof id === 'number' ? String(id) : id
}

// Normalize a DB row into our app shape
export function normalizeFromRow(row: any): NormalizedProduct {
  const obj: any = {
    id: coerceId(row.id),
    slug: row.slug || coerceId(row.id),
    title: row.title || row.name || 'Untitled Product',
    description: row.description || row.details || row.short_description || row.title || 'Product',
    keyword: row.keyword || row.keywords || undefined,
    image: row.image_url || row.image || '/screenshots/logo-with-tagline.png',
    inventory: typeof row.inventory === 'number' ? row.inventory : null,
    available: row.is_active !== false,
    source: 'db' as const,
  }
  if (row.price != null) obj.price = Number(row.price)
  if (row.short_description) obj.shortDescription = row.short_description
  return obj as NormalizedProduct
}

// Normalize a static product into our app shape (includes usageInstructions)
export function normalizeFromStatic(p: Product): NormalizedProduct {
  const basePrice = (p as any).price ?? p.variations?.[0]?.price
  const obj: any = {
    id: coerceId(p.id),
    slug: p.slug || coerceId(p.id),
    title: p.title,
    description: (p as any).description || p.details || (p as any).short_description || p.title,
    keyword: (p as any).keyword,
    image: (p as any).image_url || (p as any).image || '/screenshots/logo-with-tagline.png',
    ...(basePrice !== undefined ? { price: basePrice } : {}),
    ...(p.variations?.length ? { variations: p.variations } : {}),
    // 🎯 ADD USAGE INSTRUCTIONS:
    ...(p.usageInstructions ? { usageInstructions: p.usageInstructions } : {}),
    inventory: null,
    available: true,
    source: 'static' as const,
  }
  if ((p as any).short_description) obj.shortDescription = (p as any).short_description
  return obj as NormalizedProduct
}

export function normalizeProducts(dbRows: any[] | null, includeStaticFallback = true): NormalizedProduct[] {
  try {
    if (dbRows && dbRows.length) {
      const mapped = dbRows.map(normalizeFromRow)
      return mapped
    }
  } catch (_) { /* ignore and fallback */ }

  if (!includeStaticFallback) return []
  try {
    const { products } = require('./products') as { products: Product[] }
    return products.map(normalizeFromStatic)
  } catch (e) {
    console.warn('Static products fallback failed:', (e as any)?.message || e)
    return []
  }
}

export function logProductAnomalies(list: NormalizedProduct[]) {
  list.forEach(p => {
    const issues: string[] = []
    if (!p.slug) issues.push('missing slug')
    if (!p.image) issues.push('missing image')
    if (p.price == null && !(p.variations && p.variations.length)) issues.push('no price or variations')
    if (issues.length) console.warn(`[product:anomaly] ${p.id} ${p.title}: ${issues.join(', ')}`)
  })
}