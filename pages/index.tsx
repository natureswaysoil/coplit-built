
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { products } from '../lib/products';
import { useCart } from '../lib/cartContext';
import AutoplayHeroVideo from '../components/AutoplayHeroVideo';
import videoConfig from '../config/videos.json';

export default function Home() {
  const { addItem } = useCart();
  const [selected, setSelected] = useState<Record<string, string>>({});
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
      
      <AutoplayHeroVideo videoConfig={videoConfig.hero} className="hero">
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
      </AutoplayHeroVideo>

      <section className="p-xl" style={{backgroundColor: 'white'}}>
        <div className="container">
          <div className="text-center mb-xl">
            <h2>Featured Products</h2>
            <p style={{fontSize: '1.1rem', color: 'var(--neutral-600)', maxWidth: '600px', margin: '0 auto'}}>
              Transform your soil with our scientifically-backed, naturally-derived products. Each formula is designed to restore soil biology and promote sustainable growth.
            </p>
          </div>
          
          <div className="grid grid-3 gap-lg mb-xl">
            {items.slice(0, 6).map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <Image
                    src={product.image}
                    alt={product.title}
                    width={300}
                    height={300}
                    style={{width: '100%', height: '200px', objectFit: 'cover', borderRadius: '0.5rem'}}
                  />
                </div>
                <div className="p-md">
                  <h3 style={{fontSize: '1.1rem', marginBottom: 'var(--space-sm)'}}>{product.title}</h3>
                  <p style={{fontSize: '0.9rem', color: 'var(--neutral-600)', marginBottom: 'var(--space-md)'}}>{product.details.substring(0, 100)}...</p>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span style={{fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)'}}>${product.variations[0]?.price || 'N/A'}</span>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => addItem({
                        id: product.id,
                        title: product.title,
                        image: product.image,
                        sku: product.variations[0]?.sku || product.id,
                        size: product.variations[0]?.size,
                        price: product.variations[0]?.price || 0,
                        qty: 1
                      })}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link href="/products" className="btn btn-primary">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      <section className="p-xl" style={{backgroundColor: 'var(--neutral-50)'}}>
        <div className="container">
          <div className="grid grid-2 gap-xl" style={{alignItems: 'center'}}>
            <div>
              <h2>Why Choose Nature's Way Soil?</h2>
              <div className="mb-lg">
                <h4 style={{color: 'var(--primary)', marginBottom: 'var(--space-sm)'}}>🌱 Science-Based Solutions</h4>
                <p>Our products are formulated based on the latest soil science research, combining beneficial microbes, organic matter, and natural nutrients.</p>
              </div>
              <div className="mb-lg">
                <h4 style={{color: 'var(--primary)', marginBottom: 'var(--space-sm)'}}>🌍 Environmentally Safe</h4>
                <p>Every ingredient is carefully selected to be safe for children, pets, pollinators, and the environment.</p>
              </div>
              <div className="mb-lg">
                <h4 style={{color: 'var(--primary)', marginBottom: 'var(--space-sm)'}}>🚀 Proven Results</h4>
                <p>Join thousands of satisfied customers who have transformed their soil and seen remarkable improvements in plant health.</p>
              </div>
            </div>
            <div className="text-center">
              <Image
                src="/screenshots/soil-comparison.png"
                alt="Before and after soil comparison"
                width={500}
                height={300}
                style={{maxWidth: '100%', height: 'auto', borderRadius: '1rem'}}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="p-xl" style={{backgroundColor: 'white'}}>
        <div className="container text-center">
          <h2 className="mb-lg">Ready to Transform Your Soil?</h2>
          <p className="mb-xl" style={{fontSize: '1.1rem', color: 'var(--neutral-600)', maxWidth: '600px', margin: '0 auto var(--space-xl)'}}>
            Join the thousands of gardeners, farmers, and homeowners who have restored their soil naturally with Nature's Way Soil products.
          </p>
          <div style={{display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap'}}>
            <Link href="/products" className="btn btn-primary btn-lg">
              Shop Now
            </Link>
            <Link href="/about" className="btn btn-secondary btn-lg">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
