export interface ProductVariation {
  size: string
  price: number
  sku: string
}

export interface Product {
  id: string
  slug: string                      // Make it required, not optional
  title: string
  image: string
  keyword: string
  details: string
  variations: ProductVariation[]
  // 🎯 ADD USAGE INSTRUCTIONS:
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
