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
        {/* Hero Section - Professional & Clean */}
        <section 
          className="relative w-full overflow-hidden bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&h=800&fit=crop&q=80)',
            minHeight: '600px'
          }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-green-800/70"></div>

          {/* Hero Content */}
          <div className="relative z-10 container mx-auto px-4 py-24 md:py-32 lg:py-40">
            <div className="max-w-4xl">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Transform Your Garden with Premium Soil Amendments
              </h1>
              <p className="text-xl md:text-2xl text-green-50 mb-8 max-w-2xl leading-relaxed">
                Science-backed organic formulas that restore soil health and deliver exceptional plant growth naturally.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="inline-block bg-white hover:bg-green-50 text-green-900 font-bold px-10 py-5 rounded-lg text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105 text-center"
                >
                  Shop Now
                </Link>
                <Link
                  href="#benefits"
                  className="inline-block bg-transparent hover:bg-white/10 text-white font-bold px-10 py-5 rounded-lg text-lg transition-all border-2 border-white text-center"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Signals */}
        <TrustSignals />

        {/* Benefits Section */}
        <section id="benefits" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Why Choose Nature's Way Soil?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Professional-grade soil amendments trusted by gardeners and landscapers nationwide
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Benefit 1 */}
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-green-600">
                <h3 className="text-2xl font-bold text-green-700 mb-4">Science-Backed Formulas</h3>
                <p className="text-gray-600 leading-relaxed">
                  Developed using the latest soil science research, combining beneficial microbes, organic matter, and natural nutrients for optimal results.
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-green-600">
                <h3 className="text-2xl font-bold text-green-700 mb-4">Safe & Natural</h3>
                <p className="text-gray-600 leading-relaxed">
                  Every ingredient is carefully selected to be safe for children, pets, pollinators, and the environment. Grow with confidence.
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-green-600">
                <h3 className="text-2xl font-bold text-green-700 mb-4">Proven Results</h3>
                <p className="text-gray-600 leading-relaxed">
                  Join thousands of satisfied customers who have transformed their soil and seen remarkable improvements in plant health and yields.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section id="featured" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover our range of premium organic soil amendments and fertilizers designed to restore soil health naturally
              </p>
            </div>
            <ProductGrid products={items as any} />
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gradient-to-b from-green-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                What Our Customers Say
              </h2>
              <p className="text-xl text-gray-600">
                Real results from real gardeners
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Testimonial 1 */}
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "My tomatoes have never been healthier! The difference in soil quality is remarkable. I've been gardening for 20 years and this is the best product I've used."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-700 font-bold text-lg">SM</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Sarah M.</p>
                    <p className="text-gray-600 text-sm">Home Gardener</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "As a professional landscaper, I trust Nature's Way Soil for all my projects. Consistent quality every time, and my clients love the results."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-700 font-bold text-lg">MR</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Mike R.</p>
                    <p className="text-gray-600 text-sm">Professional Landscaper</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "Finally, an organic solution that actually works! My vegetable garden is thriving and producing more than ever before."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-700 font-bold text-lg">JL</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Jennifer L.</p>
                    <p className="text-gray-600 text-sm">Organic Farmer</p>
                  </div>
                </div>
              </div>
            </div>
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
