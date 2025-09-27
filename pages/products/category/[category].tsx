// pages/category/[category].tsx
import { useRouter } from 'next/router';
import Link from 'next/link';

interface CatProduct { slug?: string; title?: string }
interface CategoryPageProps { products: CatProduct[] }

export default function CategoryPage({ products }: CategoryPageProps) {
  const router = useRouter();
  const { category } = router.query;

  return (
    <main className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-brand-700 mb-6">Category: {category}</h1>
      <div className="space-y-3">
        {(products || []).map(prod => (
          <div key={prod.slug || String(Math.random())} className="rounded-lg border p-4 bg-white">
            {prod.slug ? (
              <Link href={`/products/${prod.slug}`} className="text-brand-700 hover:underline">
                <h3 className="text-lg font-semibold">{prod.title || 'Untitled'}</h3>
              </Link>
            ) : <h3 className="text-lg font-semibold">{prod.title || 'Untitled'}</h3>}
          </div>
        ))}
      </div>
    </main>
  );
}

export async function getStaticPaths() {
  const categories = ["Fertilizers", "Soil Amendments", "Lawn Care", "Plant Boosters"];
  return {
    paths: categories.map(c => ({ params: { category: c } })),
    fallback: true,
  };
}

export async function getStaticProps({ params }: { params: { category: string } }) {
  // organic gardening solution: real implementation would query Supabase by keyword or category mapping
  let products: CatProduct[] = []
  try {
    // Intentionally skip external fetch in build to avoid failures
    products = []
  } catch {
    products = []
  }
  return { props: { products: products || [] }, revalidate: 300 }
}
