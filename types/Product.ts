export interface Product {
  id: string
  slug?: string                    // Make optional to avoid conflicts
  title: string
  image: string
  keyword: string
  details: string
  variations: ProductVariation[]
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
