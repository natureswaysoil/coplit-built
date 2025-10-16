import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { products } from '../lib/products'
import { ProductGrid } from '@/components/ProductGrid'
import Footer from '../components/Footer'

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
        <meta name="description" content="Premium organic soil amendments for healthier plants and sustainable growing." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-white">
        {/* Video Hero Section */}
        <section className="relative h-screen w-full overflow-hidden">
          {/* Background Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover"
          >
            <source src="/untitled_project.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Overlay for better text readability */}
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30"></div>
          
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

        {/* Products Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
              Our Products
            </h2>
            <ProductGrid products={items as any} />
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
