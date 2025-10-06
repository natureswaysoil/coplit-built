import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.ico" />
        
        {/* SEO Meta Tags */}
        <meta name="theme-color" content="#2d5016" />
        <meta name="google-site-verification" content="BqQM4alYBSVlcmM4Y252DprrpLJiCQ9dc8AiX26N5WA" />
        <meta name="tiktok-developers-site-verification" content="Vppdkkg17zPwMXE5vCnTmcHXvGI2moBj" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://video.pictory.ai" />
        
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: "Nature's Way Soil",
              url: 'https://natureswaysoil.com',
              logo: 'https://natureswaysoil.com/logo.png',
              description: 'Premium organic fertilizers that work with nature, not against it. Restore soil health and boost plant growth naturally.',
              sameAs: [
                'https://twitter.com/natureswaysoil',
                'https://facebook.com/natureswaysoil'
              ]
            })
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
