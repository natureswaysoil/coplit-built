// pages/_app.tsx
import type { AppProps } from 'next/app'
import Link from 'next/link'
import { useEffect, useState } from 'react'

// ✅ Import the cart context ONCE and alias the provider to avoid any name collisions
import { CartProvider as CartCtxProvider, useCart } from '../lib/cartContext'

// Adjust to your actual CSS file
import '../styles/globals.css' // or: import '../styles.css'

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
  return (
    <CartCtxProvider>
      <TopNav />
      <Component {...pageProps} />
    </CartCtxProvider>
  )
}
