import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
<<<<<<< HEAD
=======
import HeroVideoSection from '../components/HeroVideoSection'
import TrustSignals from '../components/TrustSignals'
import OptimizedCTA from '../components/OptimizedCTA'
import EnhancedChatWidget from '../components/EnhancedChatWidget'
>>>>>>> e4d0e0a
import { products } from '../lib/products'
import { ProductGrid } from '@/components/ProductGrid'

export default function Home() {
  const [mounted, setMounted] = useState(false)
<<<<<<< HEAD
  const [items, setItems] = useState(Array.isArray(products) ? products : [])
=======
  const [items] = useState(Array.isArray(products) ? products : [])
>>>>>>> e4d0e0a

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
<<<<<<< HEAD

      <main>
  {/* Hero / Trust sections temporarily removed (components missing) */}

        <section className="p-xl" style={{backgroundColor: 'white'}}>
          <div className="container">
            <div className="text-center mb-xl">
              <h2>Featured Products</h2>
              <p style={{fontSize: '1.1rem', color: 'var(--neutral-600)', maxWidth: '600px', margin: '0 auto'}}>
                Discover our range of organic soil amendments and fertilizers designed to restore soil health naturally.
              </p>
            </div>
            <ProductGrid products={items as any} />
          </div>
        </section>

        {/* Testimonials */}
        <section style={{padding: 'var(--space-2xl) var(--space-md)', background: 'var(--bg-secondary)'}}>
          <div style={{maxWidth: 'var(--container-lg)', margin: '0 auto'}}>
            <h2 style={{textAlign: 'center', marginBottom: 'var(--space-xl)', fontSize: 'var(--text-3xl)', fontWeight: 700}}>
              What Our Customers Say
            </h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-xl)'}}>
              <div style={{background: 'white', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)'}}>
                <div style={{display: 'flex', marginBottom: 'var(--space-sm)'}}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} style={{width: 20, height: 20, fill: 'var(--primary)'}} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p style={{marginBottom: 'var(--space-md)'}}>
                  "My tomatoes have never been healthier! The difference in soil quality is remarkable."
                </p>
                <p style={{fontWeight: 600}}>- Sarah M., Home Gardener</p>
              </div>

              <div style={{background: 'white', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)'}}>
                <div style={{display: 'flex', marginBottom: 'var(--space-sm)'}}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} style={{width: 20, height: 20, fill: 'var(--primary)'}} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p style={{marginBottom: 'var(--space-md)'}}>
                  "As a professional landscaper, I trust Nature's Way Soil for all my projects. Consistent quality every time."
                </p>
                <p style={{fontWeight: 600}}>- Mike R., Professional Landscaper</p>
              </div>

              <div style={{background: 'white', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)'}}>
                <div style={{display: 'flex', marginBottom: 'var(--space-sm)'}}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} style={{width: 20, height: 20, fill: 'var(--primary)'}} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p style={{marginBottom: 'var(--space-md)'}}>
                  "Finally, an organic solution that actually works! My vegetable garden is thriving."
                </p>
                <p style={{fontWeight: 600}}>- Jennifer L., Organic Farmer</p>
              </div>
            </div>
          </div>
        </section>

  {/* CTA and Chat widgets omitted until components added back */}
      </main>
    </>
  )
}
=======

      <main>
        {/* Hero Section with Video */}
        <HeroVideoSection />

        {/* Trust Signals */}
        <TrustSignals />

        {/* Why Choose Us Section */}
        <section style={{padding: 'var(--space-2xl) var(--space-md)', background: 'var(--bg-secondary)'}}>
          <div style={{maxWidth: 'var(--container-lg)', margin: '0 auto'}}>
            <h2 style={{textAlign: 'center', marginBottom: 'var(--space-xl)', fontSize: 'var(--text-3xl)', fontWeight: 700}}>
              Why Choose Nature's Way Soil?
            </h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-xl)'}}>
              <div>
                <h4 style={{color: 'var(--primary)', marginBottom: 'var(--space-sm)'}}>Science-Backed Formulas</h4>
                <p>Our products are formulated based on the latest soil science research, combining beneficial microbes, organic matter, and natural nutrients.</p>
              </div>
              <div className="mb-lg">
                <h4 style={{color: 'var(--primary)', marginBottom: 'var(--space-sm)'}}>Environmentally Safe</h4>
                <p>Every ingredient is carefully selected to be safe for children, pets, pollinators, and the environment.</p>
              </div>
              <div className="mb-lg">
                <h4 style={{color: 'var(--primary)', marginBottom: 'var(--space-sm)'}}>Proven Results</h4>
                <p>Join thousands of satisfied customers who have transformed their soil and seen remarkable improvements in plant health.</p>
              </div>
            </div>
            <div className="text-center">
              <Image
                src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=300&fit=crop"
                alt="Healthy soil comparison"
                width={500}
                height={300}
                style={{borderRadius: 'var(--radius-md)', margin: 'var(--space-xl) auto 0'}}
              />
            </div>
          </div>
        </section>

        <section className="p-xl" style={{backgroundColor: 'white'}}>
          <div className="container">
            <div className="text-center mb-xl">
              <h2>Featured Products</h2>
              <p style={{fontSize: '1.1rem', color: 'var(--neutral-600)', maxWidth: '600px', margin: '0 auto'}}>
                Discover our range of organic soil amendments and fertilizers designed to restore soil health naturally.
              </p>
            </div>
            <ProductGrid products={items as any} />
          </div>
        </section>
        {/* Testimonials */}
        <section style={{padding: 'var(--space-2xl) var(--space-md)', background: 'var(--bg-secondary)'}}>
          <div style={{maxWidth: 'var(--container-lg)', margin: '0 auto'}}>
            <h2 style={{textAlign: 'center', marginBottom: 'var(--space-xl)', fontSize: 'var(--text-3xl)', fontWeight: 700}}>
              What Our Customers Say
            </h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-xl)'}}>
              <div style={{background: 'white', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)'}}>
                <div style={{display: 'flex', marginBottom: 'var(--space-sm)'}}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} style={{width: 20, height: 20, fill: 'var(--primary)'}} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p style={{marginBottom: 'var(--space-md)'}}>
                  "My tomatoes have never been healthier! The difference in soil quality is remarkable."
                </p>
                <p style={{fontWeight: 600}}>- Sarah M., Home Gardener</p>
              </div>

              <div style={{background: 'white', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)'}}>
                <div style={{display: 'flex', marginBottom: 'var(--space-sm)'}}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} style={{width: 20, height: 20, fill: 'var(--primary)'}} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p style={{marginBottom: 'var(--space-md)'}}>
                  "As a professional landscaper, I trust Nature's Way Soil for all my projects. Consistent quality every time."
                </p>
                <p style={{fontWeight: 600}}>- Mike R., Professional Landscaper</p>
              </div>

              <div style={{background: 'white', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)'}}>
                <div style={{display: 'flex', marginBottom: 'var(--space-sm)'}}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} style={{width: 20, height: 20, fill: 'var(--primary)'}} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p style={{marginBottom: 'var(--space-md)'}}>
                  "Finally, an organic solution that actually works! My vegetable garden is thriving."
                </p>
                <p style={{fontWeight: 600}}>- Jennifer L., Organic Farmer</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <OptimizedCTA />

        {/* Chat Widget */}
        {mounted && <EnhancedChatWidget />}
      </main>
    </>
  )
}
>>>>>>> e4d0e0a
