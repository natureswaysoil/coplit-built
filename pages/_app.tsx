// pages/_app.tsx
import type { AppProps } from 'next/app'
import Script from 'next/script'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// Canonical cart context (aliased to avoid name collisions)
import { CartProvider as CartCtxProvider, useCart } from '../lib/cartContext'

// Global CSS (switch to '../styles.css' if that's your file)
import '../styles/globals.css'

// ✅ Vercel Web Analytics
import { Analytics } from '@vercel/analytics/next'

function TopNav() {
  const { items } = useCart()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const count = items.reduce((sum, i) => sum + i.qty, 0)

  return (
    <nav
      style={{
        padding: '1rem',
        background: '#1a202c',
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', gap: 16 }}>
        <Link href="/" style={{ color: '#fff' }}>Home</Link>
        <Link href="/products" style={{ color: '#fff' }}>Products</Link>
        <Link href="/cart" style={{ color: '#fff' }}>
          Cart<span suppressHydrationWarning>{mounted && count > 0 ? ` (${count})` : ''}</span>
        </Link>
        <Link href="/checkout" style={{ color: '#fff' }}>Checkout</Link>
        <Link href="/auth" style={{ color: '#fff' }}>Account</Link>
        <Link href="/about" style={{ color: '#fff' }}>About</Link>
        <Link href="/contact" style={{ color: '#fff' }}>Contact</Link>
        <Link href="/sales" style={{ color: '#fff' }}>Sales</Link>
        <Link href="/privacy-policy" style={{ color: '#fff' }}>Privacy</Link>
        <Link href="/refund-policy" style={{ color: '#fff' }}>Refunds</Link>
      </div>
    </nav>
  )
}

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
    <CartCtxProvider>
      <TopNav />
      <Component {...pageProps} />
      {/* Sends pageview events to Vercel Analytics (cookieless) */}
      <Analytics />

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
  )
}

