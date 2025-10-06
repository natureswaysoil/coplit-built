
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { products } from '../lib/products';
import { useCart } from '../lib/cartContext';
import HeroVideoSection from '../components/HeroVideoSection';
import EnhancedChatWidget from '../components/EnhancedChatWidget';
import AdvancedEmailCapture from '../components/AdvancedEmailCapture';
import PersonalizedRecommendations from '../components/PersonalizedRecommendations';
import SocialProofBanner from '../components/SocialProofBanner';
import Footer from '../components/Footer';

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
        <title>Nature's Way Soil | Premium Organic Fertilizers & Soil Health Solutions</title>
        <meta name="description" content="Restore soil health naturally with our premium organic fertilizers. Work with nature, not against it. Safe for kids, pets, and pollinators. Free shipping on orders over $50." />
        <meta name="keywords" content="organic fertilizer, soil health, mycorrhizal fungi, organic gardening, sustainable agriculture, natural fertilizer, soil microbes" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://natureswaysoil.com/" />
        <meta property="og:title" content="Nature's Way Soil | Premium Organic Fertilizers" />
        <meta property="og:description" content="Restore soil health naturally with our premium organic fertilizers. Work with nature, not against it." />
        <meta property="og:image" content="https://media.springernature.com/m685/springer-static/image/art%3A10.1038%2Fs43017-022-00366-w/MediaObjects/43017_2022_366_Fig1_HTML.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://natureswaysoil.com/" />
        <meta property="twitter:title" content="Nature's Way Soil | Premium Organic Fertilizers" />
        <meta property="twitter:description" content="Restore soil health naturally with our premium organic fertilizers. Work with nature, not against it." />
        <meta property="twitter:image" content="https://m.media-amazon.com/images/I/718tWBNNfkL.jpg" />
        
        <link rel="canonical" href={`${process.env.PUBLIC_SITE_URL || 'https://natureswaysoil.com'}/`} />
      </Head>
      
      {/* Hero Video Section with Educational Content */}
      <HeroVideoSection 
        videoUrl="https://d3uryq9bhgb5qr.cloudfront.net/Pictory-API-Self-Service-USD-Monthly/6brpmrpiu3k3kud3b4eb7nc1rs/a2a35808-5743-40eb-8023-22b2c6b6cf2d/VIDEO/soil_symbiosis_hero_video.mp4"
        posterUrl="/videos/hero-poster.jpg"
      />

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
                <h4 style={{color: 'var(--primary)', marginBottom: 'var(--space-sm)'}}>Science-Based Solutions</h4>
                <p>Our products are formulated based on the latest soil science research, combining beneficial microbes, organic matter, and natural nutrients.</p>
              </div>
              <div className="mb-lg">
                <h4 style={{color: 'var(--primary)', marginBottom: 'var(--space-sm)'}}>Environmentally Safe</h4>
                <p>Every ingredient is carefully selected to be safe for children, pets, pollinators, and the environment.</p>
              </div>
              <div className="mb-lg">
                <h4 style={{color: 'var(--primary)', marginBottom: 'var(--space-sm)'}}>🚀 Proven Results</h4>
                <p>Join thousands of satisfied customers who have transformed their soil and seen remarkable improvements in plant health.</p>
              </div>
            </div>
            <div className="text-center">
              <Image
                src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=300&fit=crop"
                alt="Healthy soil comparison"
                width={500}
                height={300}
                style={{maxWidth: '100%', height: 'auto', borderRadius: '1rem'}}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Personalized Product Recommendations */}
      <PersonalizedRecommendations />

      {/* Email Capture Section */}
      <section className="p-xl" style={{backgroundColor: 'white'}}>
        <div className="container">
          <AdvancedEmailCapture 
            source="homepage_bottom"
            headline="Get Expert Soil Health Tips & Exclusive Offers"
            subheadline="Join our community and learn how to transform your soil naturally"
            incentive="Get 10% off your first order"
            showTimer={true}
          />
        </div>
      </section>

      <section className="p-xl" style={{backgroundColor: 'var(--neutral-50)'}}>
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

      {/* Enhanced Chat Widget */}
      <EnhancedChatWidget />
      
      {/* Social Proof Banner */}
      <SocialProofBanner />

      {/* Footer */}
      <Footer />
    </>
  );
}
