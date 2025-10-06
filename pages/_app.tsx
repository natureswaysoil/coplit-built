import Head from 'next/head'
// pages/_app.tsx
import type { AppProps } from 'next/app'
import Script from 'next/script'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

// Canonical cart context (aliased to avoid name collisions)
import { CartProvider as CartCtxProvider } from '../lib/cartContext'
import Navbar from '@/components/Navbar'

// Global CSS (switch to '../styles.css' if that's your file)
import '../styles/globals.css'
// Modern CSS for enhanced styling
import '../styles/modern.css'

// ✅ Vercel Web Analytics
import { Analytics } from '@vercel/analytics/next'

// Conversion Optimization Components
import EducationalChatWidget from '@/components/EducationalChatWidget'
import ExitIntentPopup from '@/components/ExitIntentPopup'


export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  // Fire TikTok page events on client-side route changes
  useEffect(() => {
    const handleRoute = () => {
      try {
        const w = window as any
        if (w.ttq && typeof w.ttq.page === 'function') {
          w.ttq.page()
        }
      } catch {}
    }

    router.events.on('routeChangeComplete', handleRoute)
    router.events.on('hashChangeComplete', handleRoute)
    return () => {
      router.events.off('routeChangeComplete', handleRoute)
      router.events.off('hashChangeComplete', handleRoute)
    }
  }, [router.events])

  return (
    <>
      {/* 🎯 NEW SEO SECTION - ADD THIS */}
      <Head>
        <html lang="en" />
        <title>Nature's Way Soil - Natural Fertilizers & Soil Products | Horse-Safe & Pet-Friendly</title>
        <meta name="description" content="Premium natural soil products, compost, and fertilizers from Nature's Way Soil. Horse-safe, pet-friendly solutions for healthier gardens and pastures. Free shipping over $75." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://natureswaysoil.com" />
      
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Store',
              name: "Nature's Way Soil",
              description:
                "Premium organic fertilizers and soil amendments for natural gardening",
              url: 'https://natureswaysoil.com',
              category: 'Garden Center',
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Organic Gardening Products',
                itemListElement: [
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Product',
                      name: 'Organic Fertilizers',
                      category: 'Fertilizer',
                    },
                  },
                ],
              },
            }),
          }}
        />
        </Head>
      
      <CartCtxProvider>
        <Navbar />
        <Component {...pageProps} />
        {/* Sends pageview events to Vercel Analytics (cookieless) */}
        <Analytics />
        {/* Conversion Optimization Components */}
        <EducationalChatWidget />
        <ExitIntentPopup />

        {/* TikTok Pixel */}
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
  ttq.load('D2TQD1JC77UEJOI3AVC0');
  ttq.page();
}(window, document, 'ttq');
          `}
        </Script>
        {/* Ensure TikTok receives page events on client-side navigation */}
        <Script id="tiktok-route-events" strategy="afterInteractive">
          {`
            (function(){
              if (typeof window === 'undefined') return;
              var sendPage = function(){
                if (window.ttq && typeof window.ttq.page === 'function') {
                  window.ttq.page();
                }
              };
              // Initial page call handled by base snippet; this is a safety call
              sendPage();
            })();
          `}
        </Script>
      </CartCtxProvider>
    </>
  )
}
