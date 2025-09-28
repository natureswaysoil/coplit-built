import Head from 'next/head'
import Link from 'next/link'

export default function BlogIndex() {
  const title = "Blog — Nature's Way Soil"
  const description = "Tips, guides, and stories on organic gardening, soil health, and natural amendments."
  const canonical = `${process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_SITE_URL || 'https://natureswaysoil.com'}/blog`

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Head>

      <main className="p-xl">
        <div className="container">
          <section className="hero" style={{borderRadius: '1rem', marginBottom: 'var(--space-xl)'}}>
            <div className="container text-center">
              <h1>Our Blog</h1>
              <p className="mb-lg" style={{fontSize: '1.2rem'}}>
                Guides and updates for healthier soil and happier plants. New posts are on the way.
              </p>
              <div style={{display: 'flex', justifyContent: 'center', gap: 'var(--space-md)', flexWrap: 'wrap'}}>
                <Link href="/products" className="btn btn-secondary" style={{backgroundColor: 'white', color: 'var(--primary)'}}>
                  Shop Products
                </Link>
                <Link href="/contact" className="btn btn-primary" style={{backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.3)'}}>
                  Contact Us
                </Link>
              </div>
            </div>
          </section>

          <section>
            <div className="card text-center" style={{backgroundColor: 'var(--neutral-50)'}}>
              <h3 style={{color: 'var(--primary)', marginBottom: 'var(--space-md)'}}>Coming Soon</h3>
              <p style={{color: 'var(--neutral-600)', fontSize: '1.1rem'}}>
                We're preparing comprehensive articles on application rates, season-by-season care plans, 
                and troubleshooting common lawn and garden issues. Stay tuned for expert tips and guidance!
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
