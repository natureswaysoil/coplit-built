// pages/products.tsx
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { Product } from '@/types/Product';
import { normalizeProducts, logProductAnomalies, NormalizedProduct } from '@/lib/productNormalizer'
import { products as staticProducts } from '@/lib/products'

interface ProductsPageProps { products: NormalizedProduct[] }

export default function ProductsPage({ products }: ProductsPageProps) {
  return (
    <>
      <Head>
  <title>Our Products | Nature&apos;s Way Soil</title>
        <meta
          name="description"
          content="Shop Nature&apos;s Way Soil organic fertilizers, compost, and plant boosters."
        />
      </Head>

      <main className="p-xl">
        <div className="container">
          <div className="text-center mb-xl">
            <h1>Professional Soil Solutions</h1>
            <p style={{fontSize: '1.1rem', color: 'var(--neutral-600)', maxWidth: '700px', margin: '0 auto'}}>
              Premium organic fertilizers and soil amendments formulated with advanced microbiology to enhance soil health and maximize plant performance.
            </p>
          </div>

          <div className="grid grid-3">
            {products.map((product) => (
              <Link
                href={`/products/${product.slug}`}
                key={product.id}
                className="product-card"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Image
                  src={product.image}
                  alt={product.title}
                  width={300}
                  height={200}
                  style={{ width: '100%', height: '200px', objectFit: 'contain' }}
                  unoptimized
                />
                <div className="product-card-content">
                  <h3 style={{color: 'var(--neutral-800)', marginBottom: 'var(--space-sm)'}}>
                    {product.title}
                  </h3>
                  <p style={{color: 'var(--neutral-600)', fontSize: '0.9rem', marginBottom: 'var(--space-md)'}}>
                    {product.shortDescription}
                  </p>
                  <div className="product-price">
                    {product.price !== undefined
                      ? `$${product.price}`
                      : product.variations && product.variations.length > 0
                        ? `Starting at $${product.variations[0].price}`
                        : 'Price varies'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

export async function getStaticProps() {
  let data: any[] | null = null
  try {
    const { data: rows, error } = await supabase.from('products').select('*')
    if (!error) data = rows || null
  } catch (e) {
    // swallow error; fallback below
  }
  const normalized = normalizeProducts(data, true)
  logProductAnomalies(normalized)
  return { props: { products: normalized }, revalidate: 120 }
}
