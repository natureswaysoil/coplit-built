
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { products } from '../lib/products';
import { useCart } from '../lib/cartContext';
import HeroVideoSection from '../components/HeroVideoSection'
import EnhancedChatWidget from '../components/EnhancedChatWidget';
import PersonalizedRecommendations from '../components/PersonalizedRecommendations';
import SocialProofBanner from '../components/SocialProofBanner';
import Footer from '../components/Footer';
import TrustSignals from '../components/TrustSignals';
import OptimizedCTA from '../components/OptimizedCTA';

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      <Head>
        <title>Nature's Way Soil | Organic Soil Health & Fertility Products</title>
        <meta name="description" content="Bring life back to your soil with microbe-rich fertilizers, compost, and plant boosters. Safe for kids, pets, and pollinators." />
        <link rel="canonical" href={`${process.env.PUBLIC_SITE_URL || 'https://natureswaysoil.com'}/`} />
        <link rel="preconnect" href="https://d3uryq9bhgb5qr.cloudfront.net" />
        <link rel="dns-prefetch" href="https://d3uryq9bhgb5qr.cloudfront.net" />
      </Head>

      <main>
        {/* Re-enable video hero section */}
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

        {/* Featured Products */}
        <section style={{padding: 'var(--space-2xl) var(--space-md)'}}>
          <div style={{maxWidth: 'var(--container-lg)', margin: '0 auto'}}>
            <h2 style={{textAlign: 'center', marginBottom: 'var(--space-xl)', fontSize: 'var(--text-3xl)', fontWeight: 700}}>
              Our Premium Products
            </h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-xl)'}}>
              {/* Product 1 */}
              <div style={{border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-lg)', textAlign: 'center'}}>
                <Image
                  src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&h=300&fit=crop"
                  alt="Soil Amendment"
                  width={300}
                  height={300}
                  style={{borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)'}}
                />
                <h3 style={{marginBottom: 'var(--space-sm)'}}>Premium Soil Amendment</h3>
                <p style={{color: 'var(--text-secondary)', marginBottom: 'var(--space-md)'}}>
                  Our flagship product enriches soil with beneficial microbes and organic matter.
                </p>
                <div style={{fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--primary)', marginBottom: 'var(--space-md)'}}>
                  $24.99
                </div>
                <Link href="/products" style={{display: 'inline-block', padding: 'var(--space-sm) var(--space-lg)', background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-md)', textDecoration: 'none', fontWeight: 600}}>
                  Shop Now
                </Link>
              </div>

              {/* Product 2 */}
              <div style={{border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-lg)', textAlign: 'center'}}>
                <Image
                  src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=300&h=300&fit=crop"
                  alt="Compost Activator"
                  width={300}
                  height={300}
                  style={{borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)'}}
                />
                <h3 style={{marginBottom: 'var(--space-sm)'}}>Compost Activator</h3>
                <p style={{color: 'var(--text-secondary)', marginBottom: 'var(--space-md)'}}>
                  Speed up your composting process with our powerful microbial blend.
                </p>
                <div style={{fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--primary)', marginBottom: 'var(--space-md)'}}>
                  $19.99
                </div>
                <Link href="/products" style={{display: 'inline-block', padding: 'var(--space-sm) var(--space-lg)', background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-md)', textDecoration: 'none', fontWeight: 600}}>
                  Shop Now
                </Link>
              </div>

              {/* Product 3 */}
              <div style={{border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-lg)', textAlign: 'center'}}>
                <Image
                  src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=300&h=300&fit=crop"
                  alt="Plant Booster"
                  width={300}
                  height={300}
                  style={{borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)'}}
                />
                <h3 style={{marginBottom: 'var(--space-sm)'}}>Plant Growth Booster</h3>
                <p style={{color: 'var(--text-secondary)', marginBottom: 'var(--space-md)'}}>
                  Give your plants the nutrients they need for explosive growth.
                </p>
                <div style={{fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--primary)', marginBottom: 'var(--space-md)'}}>
                  $29.99
                </div>
                <Link href="/products" style={{display: 'inline-block', padding: 'var(--space-sm) var(--space-lg)', background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-md)', textDecoration: 'none', fontWeight: 600}}>
                  Shop Now
                </Link>
              </div>
            </div>
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
