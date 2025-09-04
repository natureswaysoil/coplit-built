import Link from 'next/link'

export default function Navbar() {
  return (
    <nav style={{
      display: 'flex',
      gap: '2rem',
      padding: '1rem',
      background: '#e8f5e9',
      borderBottom: '1px solid #b2dfdb'
    }}>
      <Link href="/">Home</Link>
      <Link href="/products">Products</Link>
      <Link href="/cart">Cart</Link>
      <Link href="/tiktok-tools" style={{ color: '#22c55e', fontWeight: 'bold' }}>📱 TikTok Tools</Link>
      <Link href="/database-setup" style={{ color: '#ff6b35', fontWeight: 'bold' }}>🗄️ Database Setup</Link>
      <Link href="/privacy-policy">Privacy Policy</Link>
      <Link href="/refund-policy">Refund Policy</Link>
      <Link href="/auth">Sign In/Up</Link>
    </nav>
  )
}