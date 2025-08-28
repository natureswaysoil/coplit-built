import Image from 'next/image';
import Link from 'next/link';
import AutoCroppedImage from '../components/AutoCroppedImage';
import { useState } from 'react';
import { products } from '../lib/products';
import { useCart } from '../lib/cartContext';

// products are imported from ../lib/products

export default function Home() {
  const { addItem } = useCart();
  const [selected, setSelected] = useState<Record<string, string>>({});
  const items = Array.isArray(products) ? products : [];

  return (
    <div style={{ background: '#174F2E', color: 'white', padding: '1rem 0' }}>
      <div style={{ background: '#0e3b22', textAlign: 'center', padding: '6px 12px', fontWeight: 'bold', letterSpacing: 0.3 }}>
        FREE SHIPPING ON ALL PRODUCTS
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1200, margin: '0 auto', padding: '1rem' }}>
        <div style={{ maxWidth: 600 }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Nature's Way Soil</h1>
          <p style={{ fontSize: '1rem', margin: '1rem 0' }}>
            At Nature’s Way Soil, our mission is simple: to bring life back to the soil, naturally.<br /><br />
            We’re a family-run farm that saw firsthand the damage years of synthetic fertilizers had done to the land. The soil was tired, lifeless, and unable to sustain the healthy crops and pastures we needed. Instead of following the same path, we set out to restore the earth the way nature intended—through biology, not chemistry.<br /><br />
            <b>Our Promise</b><br />
            Safe & Natural – Every product we make is safe for children, pets, and pollinators.<br />
            Microbe-Rich Formulas – We use beneficial microbes, worm castings, biochar, and natural extracts to restore soil health.<br />
            Sustainable Farming – From duckweed to compost teas, our ingredients are chosen to recycle nutrients and heal the land.<br />
            Results You Can See – Greener lawns, healthier pastures, stronger roots, and thriving gardens—without synthetic chemicals.<br /><br />
            <b>Why We Do It</b><br />
            Soil isn’t just dirt—it’s a living ecosystem. By nurturing the microbes and natural processes in the ground, we create healthier plants, stronger food systems, and a cleaner environment for future generations.<br /><br />
            Every bottle and bag of Nature’s Way Soil® carries this commitment: to restore the balance between people, plants, and the planet.
          </p>
        </div>
        <div style={{ minWidth: 120, maxWidth: 240, flex: '0 1 240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Image src="/screenshots/logo-with-tagline.png" alt="Nature's Way Soil Logo" width={240} height={120} style={{ borderRadius: 16, background: 'white', objectFit: 'contain', width: '100%', height: 'auto' }} />
        </div>
      </div>
      <div style={{ background: '#F6FFF7', color: '#174F2E', padding: '2rem 0', borderRadius: '0 0 16px 16px' }}>
        <h2 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '2rem', marginBottom: '2rem' }}>Featured Products</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          {items.length === 0 && (
            <p style={{ color: '#174F2E' }}>No products available.</p>
          )}
          {items.map(p => (
            <div key={p.id} style={{ background: 'white', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: '1.5rem', minWidth: 220, maxWidth: 320, textAlign: 'center' }}>
              <AutoCroppedImage src={p.image} alt={p.title} width={180} height={180} />
              <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{p.title}</h3>
              <p style={{ fontSize: '1rem', marginBottom: '1rem' }}>{p.details}</p>
              <div style={{ marginBottom: '0.75rem' }}>
                <Link href={`/products/${p.id}`} style={{ color: '#174F2E', textDecoration: 'underline' }}>
                  View Details
                </Link>
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <label htmlFor={`home-size-${p.id}`} style={{ display: 'block', fontWeight: 'bold', marginBottom: 6 }}>Choose size</label>
                <select
                  id={`home-size-${p.id}`}
                  value={selected[p.id] || ''}
                  onChange={(e) => setSelected((s) => ({ ...s, [p.id]: e.target.value }))}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc' }}
                  disabled={!p.variations || p.variations.length === 0}
                >
                  <option value="" disabled>Select a size</option>
                  {p.variations?.map(v => (
                    <option key={v.sku} value={v.sku}>{v.size} - ${v.price.toFixed(2)}</option>
                  ))}
                </select>
                {(!p.variations || p.variations.length === 0) && (
                  <small style={{ display: 'block', marginTop: 6, color: '#666' }}>Currently unavailable</small>
                )}
              </div>
              <button
                onClick={() => {
                  if (!p.variations || p.variations.length === 0) return;
                  const sku = selected[p.id] || p.variations[0]?.sku;
                  const variant = p.variations.find(v => v.sku === sku) || p.variations[0]!;
                  addItem({
                    id: p.id,
                    title: p.title,
                    image: p.image,
                    sku: variant.sku,
                    size: variant.size,
                    price: variant.price,
                    qty: 1,
                  });
                }}
                disabled={!p.variations || p.variations.length === 0}
                style={{ background: '#174F2E', color: 'white', border: 'none', borderRadius: 6, padding: '0.5rem 1.2rem', fontWeight: 'bold', cursor: (!p.variations || p.variations.length === 0) ? 'not-allowed' : 'pointer', opacity: (!p.variations || p.variations.length === 0) ? 0.6 : 1, marginTop: '0.5rem' }}
              >
                {(!p.variations || p.variations.length === 0) ? 'Unavailable' : 'Add to Cart'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}