import type { GetServerSideProps } from 'next'
import { products as staticProducts } from '@/lib/products'
import fs from 'fs'
import path from 'path'

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const host = process.env.PUBLIC_SITE_URL || 'https://natureswaysoil.com'
  const now = new Date().toISOString()

  // Static pages
  const staticUrls = ['/', '/products', '/about', '/contact', '/sales', '/blog', '/privacy-policy', '/refund-policy']

  // Product pages
  const productUrls = staticProducts.map(p => `/products/${p.slug}`)

  // Blog posts from JSON file
  let blogUrls: { loc: string; lastmod: string }[] = []
  try {
    const blogPath = path.join(process.cwd(), 'public', 'blog_articles.json')
    const blogData = JSON.parse(fs.readFileSync(blogPath, 'utf-8'))
    blogUrls = blogData
      .filter((a: any) => a.slug)
      .map((a: any) => ({
        loc: `/blog/${a.slug}`,
        lastmod: a.date ? new Date(a.date).toISOString() : now
      }))
  } catch (e) {
    console.error('Failed to load blog articles for sitemap:', e)
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls.map(u => `  <url>
    <loc>${host}${u}</loc>
    <changefreq>${u === '/blog' ? 'daily' : 'weekly'}</changefreq>
    <priority>${u === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
${productUrls.map(u => `  <url>
    <loc>${host}${u}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
${blogUrls.map(u => `  <url>
    <loc>${host}${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n')}
</urlset>`

  res.setHeader('Content-Type', 'application/xml')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
  res.write(xml)
  res.end()

  return { props: {} }
}

export default function SiteMap() {
  return null
}
