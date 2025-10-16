import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import TrustSignals from '../components/TrustSignals'
import OptimizedCTA from '../components/OptimizedCTA'
import EnhancedChatWidget from '../components/EnhancedChatWidget'
import Footer from '../components/Footer'
import { products } from '../lib/products'
import { ProductGrid } from '@/components/ProductGrid'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [items] = useState(Array.isArray(products) ? products : [])

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      <Head>
        <title>Nature's Way Soil - Premium Organic Soil Amendments</title>
        <meta name="description" content="Transform your garden with Nature's Way Soil premium organic amendments. Science-backed formulas for healthier plants and sustainable growing." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-white">
        {/* Hero Section - MAXIMUM READABILITY with Solid Backgrounds */}
        <section 
          className="relative w-full overflow-hidden bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&h=800&fit=crop&q=80)',
            minHeight: '650px'
          }}
        >
          {/* Very Light overlay - shows image clearly */}
          <div className="absolute inset-0 bg-white/40"></div>
          
          {/* Hero Content with MAXIMUM TEXT CONTRAST */}
          <div className="relative z-10 container mx-auto px-4 py-28 md:py-36 lg:py-44">
            <div className="max-w-4xl space-y-6">
              {/* Main Headline - SOLID WHITE BACKGROUND for 100% readability */}
              <div className="bg-white px-10 py-8 rounded-3xl shadow-2xl">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight">
                  Transform Your Garden Naturally
                </h1>
              </div>
              
              {/* Subheadline - SOLID WHITE BACKGROUND */}
              <div className="bg-white px-10 py-6 rounded-3xl shadow-xl">
                <p className="text-xl md:text-2xl text-gray-800 leading-relaxed font-medium">
                  Premium organic soil amendments backed by science.<br className="hidden md:block" />
                  Restore your soil's health and watch your plants thrive.
                </p>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-5 pt-4">
                <Link
                  href="/products"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold px-12 py-6 rounded-2xl text-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 text-center"
                >
                  Shop Premium Soil
                </Link>
                <Link
                  href="#benefits"
                  className="inline-block bg-white hover:bg-gray-50 text-gray-900 font-bold px-12 py-6 rounded-2xl text-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 text-center border-2 border-gray-300"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Signals */}
        <TrustSignals />

        {/* Benefits Section - Clean & Professional */}
        <section id="benefits" className="py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why Choose Nature's Way Soil
              </h2>
              <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Professional-grade organic amendments trusted by thousands of gardeners nationwide
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
              {/* Benefit 1 */}
              <div className="bg-white p-10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-green-600 hover:-translate-y-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Science-Backed Formulas</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Developed using cutting-edge soil science research. Our formulas combine beneficial microbes, organic matter, and essential nutrients for optimal plant growth.
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="bg-white p-10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-green-600 hover:-translate-y-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">100% Safe & Natural</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Every ingredient is carefully selected to be completely safe for children, pets, pollinators, and the environment. Garden with complete confidence.
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="bg-white p-10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-green-600 hover:-translate-y-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Proven Results</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Join thousands of satisfied customers who have transformed their gardens. See remarkable improvements in soil quality, plant health, and harvest yields.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section id="featured" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Featured Products
              </h2>
              <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Discover our premium organic soil amendments and fertilizers designed to restore and enhance soil health naturally
              </p>
            </div>
            <ProductGrid products={items as any} />
          </div>
        </section>

        {/* CTA Section */}
        <OptimizedCTA />

        {/* Chat Widget */}
        {mounted && <EnhancedChatWidget />}
      </main>

      {/* Footer */}
      <Footer />
    </>
  )
}
