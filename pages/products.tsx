import Image from 'next/image';
import Link from 'next/link';
import AutoCroppedImage from '../components/AutoCroppedImage';
import { useState } from 'react';
import { useCart } from '../lib/cartContext';
import { products } from '../lib/products';

export default function Products() {
  const { addItem } = useCart();
  const [selected, setSelected] = useState<Record<string, string>>({});
  const items = Array.isArray(products) ? products : [];

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Products</h1>
      <input placeholder="Search products..." style={{ marginBottom: 16, width: '100%' }} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
        {items.length === 0 && (
          <p style={{ color: '#555' }}>No products available.</p>
        )}
        {items.map(p => (
          <div key={p.id} style={{ background: 'white', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: '1.5rem', minWidth: 220, maxWidth: 320, textAlign: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <AutoCroppedImage src={p.image} alt={p.title} width={180} height={180} />
              {p.keyword && (
                <span style={{ position: 'absolute', top: 6, left: 6, background: '#174F2E', color: 'white', fontSize: 12, padding: '2px 6px', borderRadius: 6, letterSpacing: 0.5 }}>
                  {p.keyword}
                </span>
              )}
            </div>
            <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{p.title}</h3>
            <p style={{ fontSize: '1rem', marginBottom: '1rem' }}>{p.details}</p>
            <div style={{ marginBottom: '0.75rem' }}>
              <Link href={`/products/${p.id}`} style={{ color: '#174F2E', textDecoration: 'underline' }}>
                View Details
              </Link>
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label htmlFor={`size-${p.id}`} style={{ display: 'block', fontWeight: 'bold', marginBottom: 6 }}>Choose size</label>
              <select
                id={`size-${p.id}`}
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
                <small style={{ display: 'block', marginTop: 6, color: '#777' }}>Currently unavailable</small>
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
              style={{ background: '#174F2E', color: 'white', border: 'none', borderRadius: 6, padding: '0.6rem 1.2rem', fontWeight: 'bold', cursor: (!p.variations || p.variations.length === 0) ? 'not-allowed' : 'pointer', opacity: (!p.variations || p.variations.length === 0) ? 0.6 : 1 }}
            >
              {(!p.variations || p.variations.length === 0) ? 'Unavailable' : 'Add to Cart'}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}