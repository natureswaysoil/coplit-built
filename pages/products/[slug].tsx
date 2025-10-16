import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { fetchProductWithVariationsBySlug } from '@/lib/productFetch'
import { products as staticProducts } from '@/lib/products'
import { NormalizedProduct, normalizeFromStatic } from '@/lib/productNormalizer'
import { useState, useEffect } from 'react'
import { useCart } from '@/lib/cartContext'
import ProductVideoPlayer from '@/components/ProductVideoPlayer'
import { findProductVideo } from '@/lib/videoHelper'
import EnhancedChatWidget from '@/components/EnhancedChatWidget'
import Footer from '@/components/Footer'
import ExitIntentPopup from '@/components/ExitIntentPopup'

let trackProductView: any = () => Promise.resolve()
try {
  trackProductView = require('@/lib/supabase_client').trackProductView || trackProductView
} catch {}

interface ProductPageProps { product: NormalizedProduct }

export default function ProductPage(props: ProductPageProps) {
  const router = useRouter()
  const { product } = props
  const { addItem } = useCart()
  const [sku, setSku] = useState<string>(() => product?.variations?.[0]?.sku || '')
  const [quantity, setQuantity] = useState(1)
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  const variant = product?.variations?.find(v => v.sku === sku) || product?.variations?.[0]
  const videoInfo = product ? findProductVideo(product) : { found: false, url: '', name: '' }
  
  useEffect(() => {
    if (typeof window !== 'undefined' && product?.id) {
      trackProductView(product.id, sessionId).catch((err: unknown) => {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to track product view:', err)
        }
      })
    }
  }, [product?.id, sessionId])
  
  if (router.isFallback || !product) return <div className="min-h-screen flex items-center justify-center"><p className="text-xl">Loading...</p></div>

  const currentPrice = variant?.price ?? product.price ?? 0

  const handleAddToCart = () => {
    if (currentPrice === 0) return
    
    addItem({
      id: product.id,
      title: product.title,
      price: currentPrice,
      image: product.image,
      sku: variant?.sku || product.id,
      qty: quantity
    })
    
    alert('Added to cart!')
  }

  return (
    <>
      <Head>
        <title>{product.title} | Nature&apos;s Way Soil</title>
        <meta name="description" content={product.shortDescription || product.description} />
        <link rel="canonical" href={`${process.env.PUBLIC_SITE_URL || 'https://natureswaysoil.com'}/products/${product.slug}`} />
        <meta property="og:type" content="product" />
        <meta property="og:title" content={product.title} />
        <meta property="og:description" content={product.shortDescription || product.description} />
        <meta property="og:image" content={product.image} />
      </Head>

      <main className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-gray-50 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-green-600">Home</Link>
              <span>/</span>
              <Link href="/products" className="hover:text-green-600">Products</Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">{product.title}</span>
            </div>
          </div>
        </div>

        {/* Product Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 max-w-7xl mx-auto">
              
              {/* Left Column - Images & Video */}
              <div className="space-y-6">
                {/* Product Video */}
                {videoInfo.found && (
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                    <ProductVideoPlayer 
                      videoUrl={videoInfo.url}
                      productName={product.title}
                      posterUrl={product.image}
                    />
                  </div>
                )}
                
                {/* Product Image */}
                <div className="bg-gray-50 rounded-lg p-2 w-24 h-24 mx-auto flex items-center justify-center">
                  <Image
                    src={product.image}
                    alt={product.title}
                    width={80}
                    height={80}
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Right Column - Product Info */}
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                  {product.title}
                </h1>

                {/* Price */}
                <div className="text-4xl font-bold text-green-600">
                  ${currentPrice.toFixed(2)}
                </div>

                {/* Short Description */}
                {product.shortDescription && (
                  <p className="text-xl text-gray-700 leading-relaxed">
                    {product.shortDescription}
                  </p>
                )}

                {/* Key Benefits */}
                <div className="bg-green-50 rounded-xl p-6 space-y-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <span className="text-green-600 font-bold text-xl">✓</span>
                    <span>100% Organic & Natural</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <span className="text-green-600 font-bold text-xl">✓</span>
                    <span>Safe for Kids, Pets & Pollinators</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <span className="text-green-600 font-bold text-xl">✓</span>
                    <span>30-Day Money-Back Guarantee</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <span className="text-green-600 font-bold text-xl">✓</span>
                    <span>Free Shipping on Orders Over $50</span>
                  </div>
                </div>

                {/* Size Selection */}
                {product.variations && product.variations.length > 0 && (
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">
                      Select Size
                    </label>
                    <select
                      value={sku}
                      onChange={e => setSku(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-lg"
                    >
                      {product.variations.map(v => (
                        <option key={v.sku} value={v.sku}>
                          {v.size} - ${v.price.toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-32 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-lg"
                  />
                </div>

                {/* Add to Cart & Checkout Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-5 px-8 rounded-xl text-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Add to Cart - ${(currentPrice * quantity).toFixed(2)}
                  </button>
                  
                  <Link
                    href="/cart"
                    onClick={() => {
                      handleAddToCart();
                    }}
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 px-8 rounded-xl text-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Buy Now - Go to Checkout
                  </Link>
                </div>

                {/* Description */}
                <div className="pt-6 border-t-2 border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Product Description</h3>
                  <div className="text-gray-700 leading-relaxed space-y-4">
                    {product.description}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Chat Widget */}
        <EnhancedChatWidget />
      </main>

      <ExitIntentPopup />
      <Footer />
    </>
  )
}

export async function getStaticPaths() {
  const paths = staticProducts.map(p => ({ params: { slug: p.slug } }))
  return { paths, fallback: true }
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const slug = params.slug
  let product = await fetchProductWithVariationsBySlug(slug)
  if (!product) {
    const static_ = staticProducts.find(p => p.slug === slug)
    if (static_) product = normalizeFromStatic(static_)
  }
  if (!product) return { notFound: true }
  return { props: { product }, revalidate: 300 }
}
