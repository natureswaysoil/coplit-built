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
        {/* Hero Section - Text OUTSIDE image, split layout */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-green-50 via-white to-green-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
              
              {/* Left: Text Content - ALWAYS READABLE */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight">
                    Transform Your Garden Naturally
                  </h1>
                  <p className="text-2xl md:text-3xl text-gray-700 leading-relaxed">
                    Premium organic soil amendments backed by science
                  </p>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Restore your soil's health and watch your plants thrive with our professional-grade organic formulas.
                  </p>
                </div>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/products"
                    className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold px-10 py-5 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-center"
                  >
                    Shop Premium Soil
                  </Link>
                  <Link
                    href="#benefits"
                    className="inline-block bg-white hover:bg-gray-50 text-gray-900 font-bold px-10 py-5 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-center border-2 border-green-600"
                  >
                    Learn More
                  </Link>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap gap-8 pt-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-gray-700 font-semibold">100% Organic</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-gray-700 font-semibold">Science-Backed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-gray-700 font-semibold">Fast Shipping</span>
                  </div>
                </div>
              </div>

              {/* Right: Image - NO text overlay */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=600&fit=crop&q=80"
                  alt="Beautiful healthy garden with organic soil"
                  className="w-full h-auto object-cover"
                  style={{ aspectRatio: '4/3' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Trust Signals */}
        <TrustSignals />

        {/* Benefits Section - Clean Design */}
        <section id="benefits" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Why Choose Nature's Way Soil
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Professional-grade organic amendments trusted by thousands of gardeners nationwide
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Benefit 1 */}
              <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border-2 border-green-100 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Science-Backed Formulas</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Developed using cutting-edge soil science research. Our formulas combine beneficial microbes, organic matter, and essential nutrients.
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border-2 border-green-100 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">100% Safe & Natural</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Every ingredient is carefully selected to be completely safe for children, pets, pollinators, and the environment.
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border-2 border-green-100 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Proven Results</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Join thousands of satisfied customers who have transformed their gardens with remarkable improvements in soil quality and plant health.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section id="featured" className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover our premium organic soil amendments designed to restore and enhance soil health naturally
              </p>
            </div>
            <ProductGrid products={items as any} />
          </div>
        </section>

        {/* Testimonials Section - NO STARS, clean design */}
        <section className="py-20 bg-white">
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
              <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border-2 border-green-100">
                <div className="mb-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                  <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">Verified Customer</span>
                </div>
                <p className="text-gray-800 mb-6 leading-relaxed text-lg italic">
                  "My tomatoes have never been healthier! The difference in soil quality is remarkable. Best product I've used in 20 years of gardening."
                </p>
                <div className="flex items-center pt-4 border-t-2 border-green-100">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-lg">SM</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Sarah M.</p>
                    <p className="text-gray-600 text-sm">Home Gardener</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border-2 border-green-100">
                <div className="mb-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                  <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">Verified Customer</span>
                </div>
                <p className="text-gray-800 mb-6 leading-relaxed text-lg italic">
                  "As a professional landscaper, I trust Nature's Way Soil for all my projects. Consistent quality every time, and my clients love the results."
                </p>
                <div className="flex items-center pt-4 border-t-2 border-green-100">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-lg">MR</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Mike R.</p>
                    <p className="text-gray-600 text-sm">Professional Landscaper</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border-2 border-green-100">
                <div className="mb-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                  <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">Verified Customer</span>
                </div>
                <p className="text-gray-800 mb-6 leading-relaxed text-lg italic">
                  "Finally, an organic solution that actually works! My vegetable garden is thriving and producing more than ever before."
                </p>
                <div className="flex items-center pt-4 border-t-2 border-green-100">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-lg">JL</span>
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
