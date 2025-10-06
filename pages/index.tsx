import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { products } from '../lib/products';
import { ProductGrid } from '@/components/ProductGrid';

export default function Home() {
  const [items, setItems] = useState(Array.isArray(products) ? products : []);

  useEffect(() => {
    setItems(products);
  }, []);

  return (
    <>
      <Head>
        <title>Nature's Way Soil | Organic Soil Health & Fertility</title>
        <meta name="description" content="Bring life back to your soil with microbe-rich fertilizers, compost, and plant boosters. Safe for kids, pets, and pollinators." />
        <link rel="canonical" href={`${process.env.PUBLIC_SITE_URL || 'https://natureswaysoil.com'}/`} />
      </Head>
      
      <section className="hero">
        <div className="container">
          <div className="text-center mb-lg">
            <div className="mb-md" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: 'var(--space-sm)',
              borderRadius: '0.5rem',
              display: 'inline-block',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              FREE SHIPPING ON ORDERS OVER $75
            </div>
          </div>
          <div className="grid grid-2" style={{alignItems: 'center', gap: 'var(--space-xl)'}}>
            <div>
              <h1>Restore Your Soil Naturally</h1>
              <p className="mb-lg">
                At Nature's Way Soil, our mission is simple: to bring life back to the soil, naturally.
              </p>
              <p className="mb-lg">
                We're a family-run farm that saw firsthand the damage years of synthetic fertilizers had done to the land. 
                The soil was tired, lifeless, and unable to sustain the healthy crops and pastures we needed. Instead of 
                following the same path, we set out to restore the earth the way nature intended—through biology, not chemistry.
              </p>
              <div className="mb-lg">
                <h3 style={{color: 'white', marginBottom: 'var(--space-md)'}}>Our Promise</h3>
                <ul style={{listStyle: 'none', padding: 0}}>
                  <li className="mb-sm">✓ Safe & Natural – Every product we make is safe for children, pets, and pollinators</li>
                  <li className="mb-sm">✓ Microbe-Rich Formulas – We use beneficial microbes, worm castings, biochar, and natural extracts</li>
                  <li className="mb-sm">✓ Sustainable Farming – From duckweed to compost teas, our ingredients recycle nutrients and heal the land</li>
                  <li className="mb-sm">✓ Results You Can See – Greener lawns, healthier pastures, stronger roots, and thriving gardens</li>
                </ul>
              </div>
              <Link href="/products" className="btn btn-secondary" style={{backgroundColor: 'white', color: 'var(--primary)'}}>
                Shop Our Products
              </Link>
            </div>
            <div className="text-center">
              <Image
                src="/screenshots/logo-with-tagline.png"
                alt="Nature's Way Soil Logo"
                width={400}
                height={200}
                style={{maxWidth: '100%', height: 'auto', borderRadius: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: 'var(--space-lg)'}}
              />
            </div>
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

      <section className="p-xl" style={{backgroundColor: 'var(--neutral-50)'}}>
        <div className="container">
          <div className="text-center">
            <h2>Why Choose Nature's Way Soil?</h2>
            <p className="mb-xl" style={{fontSize: '1.1rem', color: 'var(--neutral-600)', maxWidth: '700px', margin: '0 auto var(--space-xl)'}}>
              Soil isn't just dirt—it's a living ecosystem. By nurturing the microbes and natural processes in the ground, 
              we create healthier plants, stronger food systems, and a cleaner environment for future generations.
            </p>
            <p style={{fontSize: '1.2rem', fontWeight: '600', color: 'var(--neutral-800)'}}>
              Every bottle and bag of Nature's Way Soil carries this commitment: to restore the balance between people, plants, and the planet.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}