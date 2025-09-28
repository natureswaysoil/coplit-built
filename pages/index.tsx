import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { products } from '../lib/products';
import { useCart } from '../lib/cartContext';

// products are imported from ../lib/products

export default function Home() {
  const { addItem } = useCart();
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [items, setItems] = useState(Array.isArray(products) ? products : []);

  useEffect(() => {
    // OCR functionality disabled - using predefined product data instead
    setItems(products);
  }, []);

  /*
  // Original OCR functionality - disabled to avoid CORS issues with external images
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
            if (selfScore >= 0.34) return p;
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
        // ignore
      }
    })();
    return () => { cancelled = true; };
  }, []);
  */

  return (
    <>
      <Head>
        <title>Nature’s Way Soil | Organic Soil Health & Fertility</title>
        <meta name="description" content="Bring life back to your soil with microbe-rich fertilizers, compost, and plant boosters. Safe for kids, pets, and pollinators." />
        <link rel="canonical" href={`${process.env.PUBLIC_SITE_URL || 'https://natureswaysoil.com'}/`} />
      </Head>
      <section className="hero">
        <div className="text-center text-lg mb-md">FREE SHIPPING ON ORDERS OVER $75</div>
        <div className="container">
          <div className="grid grid-2" style={{alignItems: 'center', gap: 'var(--space-xl)'}}>
            <div>
              <h1>Nature's Way Soil</h1>
            <p>
              At Nature’s Way Soil, our mission is simple: to bring life back to the soil, naturally.
              <br /><br />
              We’re a family-run farm that saw firsthand the damage years of synthetic fertilizers had done to the land. The soil was tired, lifeless, and unable to sustain the healthy crops and pastures we needed. Instead of following the same path, we set out to restore the earth the way nature intended—through biology, not chemistry.
              <br /><br />
              <b>Our Promise</b><br />
              Safe & Natural – Every product we make is safe for children, pets, and pollinators.
              <br />
              Microbe-Rich Formulas – We use beneficial microbes, worm castings, biochar, and natural extracts to restore soil health.
              <br />
              Sustainable Farming – From duckweed to compost teas, our ingredients are chosen to recycle nutrients and heal the land.
              <br />
              Results You Can See – Greener lawns, healthier pastures, stronger roots, and thriving gardens—without synthetic chemicals.
              <br /><br />
              <b>Why We Do It</b><br />
              Soil isn’t just dirt—it’s a living ecosystem. By nurturing the microbes and natural processes in the ground, we create healthier plants, stronger food systems, and a cleaner environment for future generations.
              <br /><br />
              Every bottle and bag of Nature’s Way Soil® carries this commitment: to restore the balance between people, plants, and the planet.
            </p>
            </div>
            <div className="text-center">
              <Image
                src="/screenshots/logo-with-tagline.png"
                alt="Nature's Way Soil Logo"
                width={300}
                height={150}
                className="card"
                style={{maxHeight: '200px', objectFit: 'contain'}}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="p-xl" style={{backgroundColor: 'var(--neutral-50)'}}>
        <div className="container">
          <h2 className="text-center mb-xl">Featured Products</h2>
          <div className="grid grid-3">
          {items.length === 0 && (
            <p className="col-span-full text-center text-brand-700">No products available.</p>
          )}
          {items.map((p) => (
            <div key={p.id} className="product-card text-center">
              <div style={{position: 'relative'}}>
                <Image
                  src={p.image}
                  alt={p.title}
                  width={180}
                  height={180}
                  style={{width: '100%', height: '200px', objectFit: 'contain'}}
                />
                {p.keyword && (
                  <span style={{
                    position: 'absolute',
                    top: '6px',
                    left: '6px',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    fontSize: '12px',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    {p.keyword}
                  </span>
                )}
              </div>
              <div className="product-card-content">
                <h3>{p.title}</h3>
                <p>{p.details}</p>
                <div className="mb-md">
                  <Link href={`/products/${p.slug}`} style={{color: 'var(--primary)', textDecoration: 'underline'}}>
                    View Details
                  </Link>
                </div>
                <div className="mb-md" style={{textAlign: 'left'}}>
                  <label htmlFor={`home-size-${p.id}`} style={{display: 'block', fontWeight: '600', marginBottom: 'var(--space-xs)'}}>Choose size</label>
                  <select
                    id={`home-size-${p.id}`}
                    value={selected[p.id] || ''}
                    onChange={(e) => setSelected((s) => ({ ...s, [p.id]: e.target.value }))}
                    style={{
                      width: '100%',
                      borderRadius: '0.5rem',
                      border: '1px solid var(--neutral-300)',
                      padding: 'var(--space-sm) var(--space-md)'
                    }}
                    disabled={!p.variations || p.variations.length === 0}
                  >
                  <option value="" disabled>Select a size</option>
                  {p.variations?.map(v => (
                    <option key={v.sku} value={v.sku}>{v.size} - ${v.price.toFixed(2)}</option>
                  ))}
                </select>
                  {(!p.variations || p.variations.length === 0) && (
                    <small style={{display: 'block', marginTop: 'var(--space-xs)', color: 'var(--neutral-500)'}}>Currently unavailable</small>
                  )}
                </div>
                <button
                  onClick={() => {
                    if (!p.variations || p.variations.length === 0) return;
                    const sku = selected[p.id] || p.variations[0]?.sku;
                    const variant = p.variations.find(v => v.sku === sku) || p.variations[0]!;
                    addItem({
                      id: String(p.id),
                      title: p.title,
                      image: p.image || '',
                      sku: variant.sku,
                      size: variant.size,
                      price: variant.price,
                      qty: 1,
                    });
                  }}
                  disabled={!p.variations || p.variations.length === 0}
                  className={(!p.variations || p.variations.length === 0) ? 'btn btn-secondary' : 'btn btn-primary'}
                >
                  {(!p.variations || p.variations.length === 0) ? 'Unavailable' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ...removed duplicate default exports...

