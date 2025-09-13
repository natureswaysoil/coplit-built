import { GetStaticPaths, GetStaticProps } from 'next';
import { products as staticProducts } from '../../lib/products';
import { supabase } from '@/lib/supabaseClient';
import { normalizeProducts, findProductBySlug, NormalizedProduct, normalizeFromStatic } from '@/lib/productNormalizer';
import { useCart } from '../../lib/cartContext';
import { useState } from 'react';

type Props = { product: NormalizedProduct };

export default function ProductDetail({ product }: Props) {
  const { addItem } = useCart();
  const [sku, setSku] = useState<string>(product.variations?.[0]?.sku || '');
  const hasVariants = !!(product.variations && product.variations.length);
  const variant = hasVariants ? (product.variations!.find(v => v.sku === sku) || product.variations![0]!) : undefined;

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: '0 1 320px', background: 'white', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img 
              src={product.image} 
              alt={product.title} 
              width={280} 
              height={280} 
              style={{ objectFit: 'contain', borderRadius: 8, backgroundColor: '#f6fff7' }}
            />
            {product.keyword && (
              <span style={{ position: 'absolute', top: 6, left: 6, background: '#174F2E', color: 'white', fontSize: 12, padding: '2px 6px', borderRadius: 6, letterSpacing: 0.5 }}>
                {product.keyword}
              </span>
            )}
          </div>
        </div>
        <div style={{ flex: '1 1 360px' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>{product.title}</h1>
          <p style={{ marginBottom: '1rem', lineHeight: 1.5 }}>{product.description}</p>

          <div style={{ marginBottom: '0.75rem' }}>
            <label htmlFor="size" style={{ display: 'block', fontWeight: 'bold', marginBottom: 6 }}>Choose size</label>
            <select
              id="size"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              disabled={!hasVariants}
              style={{ width: '100%', maxWidth: 320, padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc' }}
            >
              <option value="" disabled>Select a size</option>
              {product.variations?.map(v => (
                <option key={v.sku} value={v.sku}>{v.size} - ${v.price.toFixed(2)}</option>
              ))}
            </select>
            {!hasVariants && (
              <small style={{ display: 'block', marginTop: 6, color: '#777' }}>Currently unavailable</small>
            )}
          </div>

          {variant && (
            <div style={{ margin: '0.5rem 0', fontWeight: 'bold' }}>
              Price: ${variant.price.toFixed(2)}
            </div>
          )}

          <button
            onClick={() => {
              if (!variant) return;
              addItem({
                id: product.id,
                title: product.title,
                image: product.image,
                sku: variant.sku,
                size: variant.size,
                price: variant.price,
                qty: 1,
              });
            }}
            disabled={!variant}
            style={{ background: '#174F2E', color: 'white', border: 'none', borderRadius: 6, padding: '0.6rem 1.2rem', fontWeight: 'bold', cursor: variant ? 'pointer' : 'not-allowed', opacity: variant ? 1 : 0.6 }}
          >
            {variant ? 'Add to Cart' : 'Unavailable'}
          </button>
        </div>
      </div>
    </main>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
  paths: staticProducts.map(p => ({ params: { id: p.id } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
  const id = ctx.params?.id as string | undefined;
  if (!id) return { notFound: true };

  // Try DB first
  const { data, error } = await supabase.from('products').select('*').eq('id', id).limit(1);
  if (error) {
    console.warn('[product-detail] DB fetch error', error.message);
  }
  let product: NormalizedProduct | null = null;
  if (data && data.length) {
    const normalized = normalizeProducts(data as any, false);
    product = normalized[0] || null;
  }
  if (!product) {
    const staticMatch = staticProducts.find(p => p.id === id);
    if (staticMatch) product = normalizeFromStatic(staticMatch);
  }
  if (!product) return { notFound: true };
  return { props: { product }, revalidate: 120 };
};
