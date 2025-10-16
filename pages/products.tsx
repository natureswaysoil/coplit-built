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
        <title>Our Products | Nature's Way Soil</title>
        <meta
          name="description"
          content="Shop Nature's Way Soil organic fertilizers, compost, and plant boosters."
        />
      </Head>

      <main className="min-h-screen bg-white">
        {/* Hero Section - Clean & Professional */}
        <section className="bg-gradient-to-b from-gray-50 to-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Professional Soil Solutions
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed">
                Premium organic fertilizers and soil amendments formulated with advanced microbiology to enhance soil health and maximize plant performance.
              </p>
            </div>
          </div>
        </section>

        {/* Products Grid - Professional Layout */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {products.map((product) => (
                <Link
                  href={`/products/${product.slug}`}
                  key={product.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:-translate-y-1"
                >
                  {/* Product Image */}
                  <div className="relative w-full h-64 bg-gray-50 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors">
                      {product.title}
                    </h3>
                    
                    {product.shortDescription && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {product.shortDescription}
                      </p>
                    )}
                    
                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-600">
                        {product.price !== undefined
                          ? `$${product.price.toFixed(2)}`
                          : product.variations && product.variations.length > 0
                            ? `From $${product.variations[0].price.toFixed(2)}`
                            : 'See Details'}
                      </span>
                      <span className="text-gray-500 text-sm font-medium group-hover:text-green-600 transition-colors">
                        View Details →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-16 bg-gradient-to-b from-green-50 to-white">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Choose Nature's Way Soil?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-3">🌱</div>
                <h3 className="font-bold text-gray-900 mb-2">100% Organic</h3>
                <p className="text-gray-600 text-sm">Natural ingredients safe for all plants</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🔬</div>
                <h3 className="font-bold text-gray-900 mb-2">Science-Backed</h3>
                <p className="text-gray-600 text-sm">Formulated by soil experts</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">✓</div>
                <h3 className="font-bold text-gray-900 mb-2">Proven Results</h3>
                <p className="text-gray-600 text-sm">Trusted by thousands nationwide</p>
              </div>
            </div>
          </div>
        </section>
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
