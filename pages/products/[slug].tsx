import { useRouter } from 'next/router'
import Head from 'next/head'
import { fetchProductWithVariationsBySlug } from '@/lib/productFetch'
import { products as staticProducts } from '@/lib/products'
import { NormalizedProduct, normalizeFromStatic } from '@/lib/productNormalizer'
import { useState } from 'react'
import { useCart } from '@/lib/cartContext'

interface ProductPageProps { product: NormalizedProduct }

export default function ProductPage(props: ProductPageProps) {
  const router = useRouter()
  if (router.isFallback) return <div>Loading...</div>
  const { product } = props
  const { addItem } = useCart()
  const [sku, setSku] = useState<string>(() => product.variations?.[0]?.sku || '')
  const variant = product.variations?.find(v => v.sku === sku) || product.variations?.[0]

  return (
    <>
      <Head>
        <title>{product.title}</title>
        <meta name="description" content={product.shortDescription || product.description} />
      </Head>
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '2rem' }}>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '0 1 340px' }}>
            <img src={product.image} alt={product.title} style={{ width: '100%', borderRadius: 12, background: '#f6fff7', objectFit: 'cover' }} />
          </div>
          <div style={{ flex: '1 1 400px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 1rem' }}>{product.title}</h1>
            <p style={{ lineHeight: 1.5, marginBottom: '1rem' }}>{product.description}</p>
            {product.variations?.length ? (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Size</label>
                <select value={sku} onChange={e => setSku(e.target.value)} style={{ padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc' }}>
                  {product.variations.map(v => (
                    <option key={v.sku} value={v.sku}>{v.size} - ${v.price.toFixed(2)}</option>
                  ))}
                </select>
              </div>
            ) : null}
            <div style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
              {variant ? `$${variant.price.toFixed(2)}` : (product.price !== undefined ? `$${product.price.toFixed(2)}` : '')}
            </div>
            <button
              onClick={() => {
                if (!(variant || product.price !== undefined)) return
                const line = variant ? { sku: variant.sku, size: variant.size, price: variant.price } : { sku: product.id, size: 'Default', price: product.price! }
                addItem({ id: product.id, title: product.title, image: product.image, qty: 1, ...line })
              }}
              style={{ background: '#174F2E', color: 'white', border: 'none', borderRadius: 6, padding: '0.7rem 1.3rem', fontWeight: 600, cursor: 'pointer' }}
            >Add to Cart</button>
          </div>
        </div>
      </main>
    </>
  )
}

export async function getStaticPaths() {
  // Prebuild static product slugs (prefer slug, fallback to id)
  return {
    paths: staticProducts.map(p => ({ params: { slug: p.slug || String(p.id) } })),
    fallback: true
  }
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const slug = params.slug
  let product = await fetchProductWithVariationsBySlug(slug)
  if (!product) {
    // Try static fallback by slug or id
    const staticMatch = staticProducts.find(p => p.slug === slug || String(p.id) === slug)
    if (staticMatch) product = normalizeFromStatic(staticMatch)
  }
  if (!product) return { notFound: true }
  // Redirect numeric id path to canonical slug if needed
  if (product.slug && slug !== product.slug) {
    return {
      redirect: {
        destination: `/products/${product.slug}`,
        permanent: true
      }
    }
  }
  return { props: { product }, revalidate: 120 }
}



