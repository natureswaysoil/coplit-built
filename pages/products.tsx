import Image from 'next/image';
import Link from 'next/link';
import AutoCroppedImage from '../components/AutoCroppedImage';
import { useState } from 'react';
import { useCart } from '../lib/cartContext';
import { products } from '../lib/products';
import { useEffect } from 'react';
import { ocrImageToTokens, scoreTitleAgainstTokens } from '../lib/ocrMatcher';

export default function Products() {
  const { addItem } = useCart();
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [items, setItems] = useState(Array.isArray(products) ? products : []);

  // Client-side: verify each product's image matches its title using OCR; if a mismatch is detected,
  // try to find the best-matching image from the catalog and swap it for display.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const tokensCache = new Map<string, string[]>();
        async function getTokens(url: string) {
          if (tokensCache.has(url)) return tokensCache.get(url)!;
          const tokens = await ocrImageToTokens(url);
          tokensCache.set(url, tokens);
          return tokens;
        }
        const updated = await Promise.all(products.map(async (p) => {
          try {
            const tokens = await getTokens(p.image);
            const selfScore = scoreTitleAgainstTokens(p.title, tokens).score;
            if (selfScore >= 0.34) return p; // seems fine
            // find a better matching image from others
            let best = { score: selfScore, image: p.image };
            for (const candidate of products) {
              const ct = await getTokens(candidate.image);
              const s = scoreTitleAgainstTokens(p.title, ct).score;
              if (s > best.score) best = { score: s, image: candidate.image };
            }
            if (best.image !== p.image && best.score > selfScore && best.score >= 0.34) {
              return { ...p, image: best.image };
            }
            return p;
          } catch {
            return p;
          }
        }));
        if (!cancelled) setItems(updated);
      } catch {
        // ignore OCR failures
      }
    })();
    return () => { cancelled = true; };
  }, []);

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