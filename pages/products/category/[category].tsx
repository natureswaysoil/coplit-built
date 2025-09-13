// pages/category/[category].tsx
import { useRouter } from 'next/router';
import Link from 'next/link';

interface CatProduct { slug?: string; title?: string }
interface CategoryPageProps { products: CatProduct[] }

export default function CategoryPage({ products }: CategoryPageProps) {
  const router = useRouter();
  const { category } = router.query;

  return (
    <main style={{ padding: 20 }}>
      <h1>Category: {category}</h1>
      {products.map(prod => (
        <div key={prod.slug}>
          <Link href={`/products/${prod.slug}`}>
            <h3>{prod.title}</h3>
          </Link>
        </div>
      ))}
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
  // Placeholder: real implementation would query Supabase by keyword or category mapping
  let products: CatProduct[] = []
  try {
    // Intentionally skip external fetch in build to avoid failures
    products = []
  } catch {
    products = []
  }
  return { props: { products }, revalidate: 300 }
}
