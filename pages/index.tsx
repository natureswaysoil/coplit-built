import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { products } from '../lib/products'
import { ProductGrid } from '@/components/ProductGrid'
import Footer from '../components/Footer'
import EmailCouponCapture from '../components/EmailCouponCapture'
import EnhancedChatWidget from '../components/EnhancedChatWidget'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [items] = useState(Array.isArray(products) ? products : [])

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      <Head>
        <title>Nature&apos;s Way Soil - Premium Organic Soil Amendments</title>
        <meta name="description" content="Premium organic soil amendments for healthier plants and sustainable growing." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-white">
        {/* Video Hero Section */}
        <section className="relative h-screen w-full overflow-hidden">
          {/* YouTube Background Video */}
          <iframe
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{
              width: '100vw',
              height: '100vh',
              objectFit: 'cover',
              transform: 'scale(1.5)',
            }}
            src="https://www.youtube.com/embed/c2rSWaWTGK4?autoplay=1&mute=1&loop=1&playlist=c2rSWaWTGK4&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1"
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
          
          {/* Overlay for better text readability */}
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 pointer-events-none"></div>
          
          {/* Hero Content */}
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
                Premium Organic Soil Amendments
              </h1>
              <p className="text-2xl md:text-3xl text-white mb-10 max-w-3xl mx-auto drop-shadow-lg">
                Natural solutions for healthier plants and thriving gardens
              </p>
              <Link
                href="/products"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold px-12 py-5 rounded-lg text-xl transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105"
              >
                Shop Products
              </Link>
            </div>
          </div>
        </section>

        {/* Simple Text Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Free shipping on orders over $50
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              100% organic • Safe for kids, pets & pollinators • 30-day money-back guarantee
            </p>
          </div>
        </section>

        {/* Email Coupon Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <EmailCouponCapture />
          </div>
        </section>

        {/* Products Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
              Our Products
            </h2>
            <ProductGrid products={items as any} />
          </div>
        </section>

        {/* Natural Gardening Help Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-green-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                🌱 Natural Gardening Questions?
              </h2>
              <p className="text-lg text-gray-600 text-center mb-6">
                Get expert advice on organic soil care, natural fertilizers, and sustainable growing practices
              </p>
              <EnhancedChatWidget />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
