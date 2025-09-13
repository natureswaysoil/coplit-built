// pages/products.tsx
import Head from 'next/head';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { Product, resolveDisplayImage } from '@/types/Product';

interface ProductsPageProps {
  products: Product[];
}

export default function ProductsPage({ products }: ProductsPageProps) {
  return (
    <>
      <Head>
        <title>Our Products | Nature’s Way Soil</title>
        <meta
          name="description"
          content="Shop Nature’s Way Soil organic fertilizers, compost, and plant boosters."
        />
      </Head>

      <main className="px-6 py-10">
        <h1 className="text-3xl font-bold text-center text-green-800 mb-10">
          Our Products
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {products.map((product) => (
            <Link
              href={`/products/${product.slug}`}
              key={product.id}
              className="block border rounded-2xl shadow-md hover:shadow-lg transition p-4 bg-white"
            >
              <img
                src={resolveDisplayImage(product)}
                alt={product.title}
                className="w-full h-56 object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-semibold text-green-900 mb-2">
                {product.title}
              </h2>
              <p className="text-gray-600 text-sm mb-3">
                {product.short_description}
              </p>
              <p className="text-lg font-bold text-green-700">
                {product.price !== undefined
                  ? `$${product.price}`
                  : product.variations && product.variations.length > 0
                    ? `$${product.variations[0].price}`
                    : ''}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export async function getStaticProps() {
  const { data, error } = await supabase
    .from('products')
    .select('*');

  if (error) throw new Error(error.message);

  return {
  props: { products: (data || []) as any as Product[] },
    revalidate: 60, // ISR
  };
}
