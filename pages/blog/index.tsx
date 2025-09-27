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

      <main className="max-w-6xl mx-auto px-6 py-10">
        <section className="rounded-2xl bg-gradient-to-br from-green-50 to-white border border-green-100 p-10 text-center">
          <h1 className="text-4xl font-bold text-green-900 mb-3">Our Blog</h1>
          <p className="text-gray-700 mb-6">Guides and updates for healthier soil and happier plants. New posts are on the way.</p>
          <div className="flex justify-center gap-3">
            <Link href="/products" className="rounded-md px-5 py-3 font-semibold text-white bg-brand-700 hover:bg-brand-800">Shop Products</Link>
            <Link href="/contact" className="rounded-md px-5 py-3 font-semibold border border-brand-700 text-brand-700 hover:bg-brand-50">Contact Us</Link>
          </div>
        </section>

        <section className="mt-10">
          <div className="rounded-xl border border-green-100 bg-white p-6 text-center text-gray-600">
            <div className="mb-2 font-semibold text-green-900">available now</div>
            <p>We\'re preparing articles on application rates, season-by-season plans, and troubleshooting common lawn & garden issues.</p>
          </div>
        </section>
      </main>
    </>
  )
}
