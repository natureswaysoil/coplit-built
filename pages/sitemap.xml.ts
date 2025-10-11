import type { GetServerSideProps } from 'next'
import { products as staticProducts } from '@/lib/products'

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const host = process.env.PUBLIC_SITE_URL || 'https://natureswaysoil.com'
  const urls = ['/', '/products', '/about', '/contact', '/sales', '/blog', '/privacy-policy', '/refund-policy']
  const productUrls = staticProducts.map(p => `/products/${p.slug}`)
  const all = [...urls, ...productUrls]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    all.map(u => `\n  <url><loc>${host}${u}</loc></url>`).join('') +
    `\n</urlset>`

  res.setHeader('Content-Type', 'application/xml')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
  res.write(xml)
  res.end()

  return { props: {} }
}

export default function SiteMap() {
  return null
}
