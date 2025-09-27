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
      <section className="bg-brand-700 text-white">
        <div className="text-center text-green-300 text-lg py-3">FREE SHIPPING ON ORDERS OVER $75</div>
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-wrap items-center justify-between gap-8">
          <div className="flex-1 min-w-[300px]">
            <h1 className="text-xl font-bold">Nature's Way Soil</h1>
            <p className="mt-4 leading-relaxed text-green-50">
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
          <div className="w-full sm:w-auto max-w-[300px] min-w-[200px] flex items-center justify-center p-4">
            <Image
              src="/screenshots/logo-with-tagline.png"
              alt="Nature's Way Soil Logo"
              width={300}
              height={150}
              className="rounded-2xl bg-white object-contain w-full h-auto max-h-[200px]"
            />
          </div>
        </div>
      </section>

      <section className="bg-green-50 text-brand-700 py-10">
        <h2 className="text-center font-bold text-3xl mb-8">Featured Products</h2>
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.length === 0 && (
            <p className="col-span-full text-center text-brand-700">No products available.</p>
          )}
          {items.map((p) => (
            <div key={p.id} className="bg-white rounded-xl shadow-md p-5 text-center">
              <div className="relative inline-block">
                <Image
                  src={p.image}
                  alt={p.title}
                  width={180}
                  height={180}
                  className="object-contain rounded-md bg-green-50"
                />
                {p.keyword && (
                  <span className="absolute top-1.5 left-1.5 bg-brand-700 text-white text-[12px] px-2 py-0.5 rounded-md tracking-wide">
                    {p.keyword}
                  </span>
                )}
              </div>
              <h3 className="font-bold mt-3 mb-2">{p.title}</h3>
              <p className="text-sm text-gray-700 mb-3">{p.details}</p>
              <div className="mb-3">
                <Link href={`/products/${p.slug}`} className="text-brand-700 underline">
                  View Details
                </Link>
              </div>
              <div className="mb-3 text-left">
                <label htmlFor={`home-size-${p.id}`} className="block font-semibold mb-1">Choose size</label>
                <select
                  id={`home-size-${p.id}`}
                  value={selected[p.id] || ''}
                  onChange={(e) => setSelected((s) => ({ ...s, [p.id]: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  disabled={!p.variations || p.variations.length === 0}
                >
                  <option value="" disabled>Select a size</option>
                  {p.variations?.map(v => (
                    <option key={v.sku} value={v.sku}>{v.size} - ${v.price.toFixed(2)}</option>
                  ))}
                </select>
                {(!p.variations || p.variations.length === 0) && (
                  <small className="block mt-1 text-gray-500">Currently unavailable</small>
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
                className={`rounded-md px-4 py-2 font-semibold text-white ${(!p.variations || p.variations.length === 0) ? 'bg-brand-700/60 cursor-not-allowed' : 'bg-brand-700 hover:bg-brand-800'}`}
              >
                {(!p.variations || p.variations.length === 0) ? 'Unavailable' : 'Add to Cart'}
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

// ...removed duplicate default exports...

