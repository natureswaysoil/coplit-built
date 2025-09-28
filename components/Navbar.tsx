import Link from 'next/link'
import { useCart } from '@/lib/cartContext'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const { items } = useCart()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const count = items.reduce((sum, i) => sum + i.qty, 0)

  return (
    <header className="header" style={{position: 'sticky', top: 0, zIndex: 50}}>
      <nav className="nav container">
        <div style={{display: 'flex', alignItems: 'center', gap: 'var(--space-lg)'}}>
          <Link href="/" style={{color: 'var(--primary)', fontWeight: '800', fontSize: '1.25rem'}}>Nature's Way Soil</Link>
          <ul className="nav-links">
            <li><Link href="/products">Products</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/sales">Sales</Link></li>
            <li><Link href="/blog">Blog</Link></li>
          </ul>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 'var(--space-md)'}}>
          <Link href="/auth" style={{color: 'var(--neutral-700)', textDecoration: 'none'}}>Account</Link>
          <Link href="/cart" className="btn btn-primary">
            Cart<span style={{marginLeft: 'var(--space-xs)'}} suppressHydrationWarning>{mounted && count > 0 ? `(${count})` : ''}</span>
          </Link>
        </div>
      </nav>
      <div style={{
        backgroundColor: 'var(--neutral-100)',
        borderTop: '1px solid var(--neutral-200)',
        textAlign: 'center',
        fontSize: '0.75rem',
        padding: 'var(--space-xs) 0'
      }}>
        <div className="container" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-md)', flexWrap: 'wrap'}}>
          <Link href="/tiktok-tools" style={{color: 'var(--neutral-600)', textDecoration: 'none'}}>TikTok Tools</Link>
          <Link href="/database-setup" style={{color: '#ea580c', textDecoration: 'none'}}>Database Setup</Link>
          <Link href="/admin/dashboard" style={{color: 'var(--primary)', textDecoration: 'none'}}>Admin</Link>
          <Link href="/privacy-policy" style={{color: 'var(--neutral-600)', textDecoration: 'none'}}>Privacy Policy</Link>
          <Link href="/refund-policy" style={{color: 'var(--neutral-600)', textDecoration: 'none'}}>Refund Policy</Link>
        </div>
      </div>
    </header>
  )
}