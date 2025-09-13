// pages/category/[category].tsx
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function CategoryPage({ products }) {
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

export async function getStaticProps({ params }) {
  const res = await fetch(`https://your-api.com/category/${params.category}`);
  const products = await res.json();
  return {
    props: { products },
    revalidate: 60,
  };
}
