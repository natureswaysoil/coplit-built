import type { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const host = process.env.PUBLIC_SITE_URL || 'https://natureswaysoil.com'
  const content = `User-agent: *\nAllow: /\nSitemap: ${host}/sitemap.xml\n`
  res.setHeader('Content-Type', 'text/plain')
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate')
  res.write(content)
  res.end()
  return { props: {} }
}

export default function Robots() { return null }
