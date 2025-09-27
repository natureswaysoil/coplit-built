import Link from 'next/link'
import { useCart } from '@/lib/cartContext'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const { items } = useCart()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const count = items.reduce((sum, i) => sum + i.qty, 0)

  return (
    <header className="bg-white/90 backdrop-blur border-b border-green-100 sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-brand-700 font-extrabold tracking-tight">Nature's Way Soil</Link>
          <div className="hidden sm:flex items-center gap-4 text-sm">
            <Link href="/products" className="text-green-900 hover:text-brand-700">Products</Link>
            <Link href="/about" className="text-green-900 hover:text-brand-700">About</Link>
            <Link href="/contact" className="text-green-900 hover:text-brand-700">Contact</Link>
            <Link href="/sales" className="text-green-900 hover:text-brand-700">Sales</Link>
            <Link href="/blog" className="text-green-900 hover:text-brand-700">Blog</Link>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/auth" className="text-green-900 hover:text-brand-700">Account</Link>
          <Link href="/cart" className="rounded-md bg-brand-700 hover:bg-brand-800 text-white px-3 py-1.5 font-semibold">
            Cart<span className="ml-1" suppressHydrationWarning>{mounted && count > 0 ? `(${count})` : ''}</span>
          </Link>
        </div>
      </nav>
      <div className="bg-green-50 border-t border-green-100 text-center text-xs text-green-800 py-1">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-center gap-4">
          <Link href="/tiktok-tools" className="text-green-700 hover:text-brand-700">📱 TikTok Tools</Link>
          <Link href="/database-setup" className="text-orange-600 hover:text-orange-700">🗄️ Database Setup</Link>
          <Link href="/admin/dashboard" className="text-brand-700 hover:text-brand-800">🛠 Admin</Link>
          <Link href="/privacy-policy" className="text-green-700 hover:text-brand-700">Privacy Policy</Link>
          <Link href="/refund-policy" className="text-green-700 hover:text-brand-700">Refund Policy</Link>
        </div>
      </div>
    </header>
  )
}