// Central Product type used across pages and data fetching.
// If you later migrate to a Supabase table, align column names to these where possible.

export interface Product {
  id: string | number;          // Allow either until DB schema is enforced
  slug?: string;                // Used in dynamic routes like /products/[slug]
  title: string;
  short_description?: string;   // Optional: some static seed data may not have this
  details?: string;             // Longer text (maps to `details` in lib/products.ts)
  image_url?: string;           // For DB-backed products
  image?: string;               // For locally defined products (`lib/products.ts`)
  price?: number;               // Direct price if single priced item
  variations?: Array<{
    size: string;
    price: number;
    sku: string;
  }>;                           // Multiple size/price options
  keyword?: string;             // Badge / category label
}

// Helper type when a canonical image url field is needed in rendering
export type ResolvedProduct = Product & { displayImage: string };

export function resolveDisplayImage(p: Product): string {
  return p.image_url || p.image || '/screenshots/logo-with-tagline.png';
}
export interface Product {
  id: string
  slug: string
  title: string
  image: string
  keyword: string
  details: string
  variations: ProductVariation[]
  // 🎯 ADD THIS NEW FIELD:
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
