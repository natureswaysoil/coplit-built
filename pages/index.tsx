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
        {/* Simple Hero */}
        <section className="py-20 bg-gradient-to-b from-green-50 to-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Premium Organic Soil Amendments
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Natural solutions for healthier plants and thriving gardens
            </p>
            <Link
              href="/products"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold px-10 py-4 rounded-lg text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Shop Products
            </Link>
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
