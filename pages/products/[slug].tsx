import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import { fetchProductWithVariationsBySlug } from '@/lib/productFetch'
import { products as staticProducts } from '@/lib/products'
import { NormalizedProduct, normalizeFromStatic } from '@/lib/productNormalizer'
import { useState } from 'react'
import UsageInstructionsSection from '@/components/UsageInstructions'
import { useCart } from '@/lib/cartContext'
import ReviewSection from '@/components/ReviewSection'
import UrgencyBadges from '@/components/UrgencyBadges'
import MoneyBackGuarantee from '@/components/MoneyBackGuarantee'
import ProductBundles from '@/components/ProductBundles'
import EmailCaptureSection from '@/components/EmailCaptureSection'

interface ProductPageProps { product: NormalizedProduct }

export default function ProductPage(props: ProductPageProps) {
  const router = useRouter()
  if (router.isFallback) return <div>Loading...</div>
  const { product } = props
  const { addItem } = useCart()
  const [sku, setSku] = useState<string>(() => product.variations?.[0]?.sku || '')
  const variant = product.variations?.find(v => v.sku === sku) || product.variations?.[0]
  // Debug logs removed for production cleanliness

  return (
    <>
      <Head>
        <title>{product.title}</title>
        <meta name="description" content={product.shortDescription || product.description} />
        <link rel="canonical" href={`${process.env.PUBLIC_SITE_URL || 'https://natureswaysoil.com'}/products/${product.slug}`} />
        <meta property="og:type" content="product" />
        <meta property="og:title" content={product.title} />
        <meta property="og:description" content={product.shortDescription || product.description} />
        <meta property="og:image" content={product.image} />
        <meta property="og:url" content={`${process.env.PUBLIC_SITE_URL || 'https://natureswaysoil.com'}/products/${product.slug}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product.title} />
        <meta name="twitter:description" content={product.shortDescription || product.description} />
        <meta name="twitter:image" content={product.image} />
        <script
          type="application/ld+json"
          // Basic Product structured data for richer results
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: product.title,
              image: [product.image],
              description: product.shortDescription || product.description,
              sku: product.variations?.[0]?.sku || product.id,
              offers: (product.variations && product.variations.length > 0)
                ? product.variations.map(v => ({
                    '@type': 'Offer',
                    priceCurrency: 'USD',
                    price: v.price,
                    availability: 'https://schema.org/InStock',
                  }))
                : product.price !== undefined
                  ? {
                      '@type': 'Offer',
                      priceCurrency: 'USD',
                      price: product.price,
                      availability: 'https://schema.org/InStock',
                    }
                  : undefined,
            })
          }}
        />
      </Head>
      <main className="container p-xl">
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xl)', alignItems: 'start'}}>
          <div>
            <Image
              src={product.image}
              alt={product.title}
              width={600}
              height={600}
              style={{width: '100%', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--neutral-50)', objectFit: 'contain'}}
            />
          </div>
          <div>
            <h1 style={{color: 'var(--primary)', marginBottom: 'var(--space-lg)'}}>{product.title}</h1>
            <p style={{marginBottom: 'var(--space-lg)', lineHeight: '1.6', color: 'var(--neutral-700)'}}>{product.description}</p>
            {product.variations?.length ? (
              <div style={{marginBottom: 'var(--space-lg)'}}>
                <label className="form-label">Size</label>
                <select
                  value={sku}
                  onChange={e => setSku(e.target.value)}
                  className="form-input"
                >
                  {product.variations.map(v => (
                    <option key={v.sku} value={v.sku}>{v.size} - ${v.price.toFixed(2)}</option>
                  ))}
                </select>
              </div>
            ) : null}
            <div style={{fontWeight: 'bold', marginBottom: 'var(--space-lg)', fontSize: '1.5rem', color: 'var(--primary)'}}>
              {variant ? `$${variant.price.toFixed(2)}` : (product.price !== undefined ? `$${product.price.toFixed(2)}` : '')}
            </div>
            {/* Urgency Badges */}
            <UrgencyBadges 
              stockLevel="low"
              recentPurchases={Math.floor(Math.random() * 20) + 5}
              showFreeShipping={true}
            />

            {/* Money-Back Guarantee */}
            <MoneyBackGuarantee />

            <button
              onClick={() => {
                if (!(variant || product.price !== undefined)) return
                const line = variant ? { sku: variant.sku, size: variant.size, price: variant.price } : { sku: product.id, size: 'Default', price: product.price! }
                addItem({ id: product.id, title: product.title, image: product.image, qty: 1, ...line })
              }}
              className="btn btn-primary"
            >Add to Cart</button>
          </div>
        </div>

        {/* Product Bundles */}
        <div style={{marginTop: 'var(--space-xl)'}}>
          <ProductBundles 
            currentProduct={{
              id: product.id,
              title: product.title,
              slug: product.slug || String(product.id),
              price: variant?.price || product.price || 0,
              image: product.image,
              category: (product as any).category || 'soil-health',
              active: true
            }}
            relatedProducts={staticProducts
              .filter(p => (p as any).category === (product as any).category && p.id !== product.id)
              .map(p => ({
                id: p.id,
                title: (p as any).title,
                slug: p.slug || String(p.id),
                price: (p as any).price || 0,
                image: (p as any).image || '',
                category: (p as any).category || 'soil-health',
                active: true
              }))
            }
          />
        </div>

        {/* Customer Reviews */}
        <div style={{marginTop: 'var(--space-xl)'}}>
          <ReviewSection 
            productCategory={(product as any).category || 'soil-health'}
            averageRating={4.8}
            reviewCount={127}
          />
        </div>

        {/* Email Capture Section */}
        <div style={{marginTop: 'var(--space-xl)'}}>
          <EmailCaptureSection />
        </div>

        {/* Usage instructions */}
        {product.usageInstructions ? (
          <UsageInstructionsSection instructions={product.usageInstructions} />
        ) : (
          <section className="card" style={{marginTop: 'var(--space-xl)', backgroundColor: 'var(--warning-50)', border: '1px solid var(--warning-200)'}}>
            <h2 style={{color: 'var(--primary)', marginBottom: 'var(--space-md)'}}>How to Use This Product</h2>
            <p style={{color: 'var(--neutral-800)', marginBottom: 'var(--space-md)'}}>Detailed usage instructions for this product are being added. In the meantime, follow these general best practices:</p>
            <ul style={{paddingLeft: 'var(--space-lg)', color: 'var(--primary)', lineHeight: '1.6'}}>
              <li>Shake well before use.</li>
              <li>If concentrate, dilute with water per the label or 1–2 oz per gallon as a general starting point.</li>
              <li>Apply in early morning or evening; avoid peak heat.</li>
              <li>Water lightly after soil applications to aid uptake.</li>
              <li>Reapply every 2–4 weeks during active growth.</li>
            </ul>
            <p className="text-sm text-gray-600 mt-4">Need specific guidance? <a className="underline text-brand-700" href="/contact">Contact us</a> and we’ll recommend rates for your plants.</p>
          </section>
        )}
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
  // Ensure usageInstructions are present if available in static catalog
  if (!(product as any).usageInstructions) {
    const simpleSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    const staticMatch = staticProducts.find(p =>
      p.slug === product!.slug ||
      simpleSlug((p as any).title) === simpleSlug(product!.title) ||
      ((p as any).keyword && (p as any).keyword === (product as any).keyword)
    )
    if (staticMatch && (staticMatch as any).usageInstructions) {
      ;(product as any).usageInstructions = (staticMatch as any).usageInstructions
    }
  }
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



