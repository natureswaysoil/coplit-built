import '../styles/globals.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CartProvider, useCart } from '../lib/cartContext';

function TopNav() {
  const { items } = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const count = items.reduce((sum, i) => sum + i.qty, 0);
  return (
    <nav style={{
      padding: '1rem', background: '#1a202c', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    }}>
      <div>
        <Link href="/" style={{ color: '#fff', marginRight: 16 }}>Home</Link>
        <Link href="/products" style={{ color: '#fff', marginRight: 16 }}>Products</Link>
        <Link href="/cart" style={{ color: '#fff', marginRight: 16, position: 'relative' }}>
          Cart
          <span suppressHydrationWarning>{mounted && count > 0 ? ` (${count})` : ''}</span>
        </Link>
  <Link href="/checkout" style={{ color: '#fff', marginRight: 16 }}>Checkout</Link>
        <Link href="/auth" style={{ color: '#fff', marginRight: 16 }}>Account</Link>
        <Link href="/about" style={{ color: '#fff', marginRight: 16 }}>About</Link>
        <Link href="/contact" style={{ color: '#fff', marginRight: 16 }}>Contact</Link>
  <Link href="/sales" style={{ color: '#fff', marginRight: 16 }}>Sales</Link>
  <Link href="/privacy-policy" style={{ color: '#fff', marginRight: 16 }}>Privacy</Link>
  <Link href="/refund-policy" style={{ color: '#fff', marginRight: 16 }}>Refunds</Link>
      </div>
    </nav>
  );
}

export default function App({ Component, pageProps }) {
  return (
    <CartProvider>
      <TopNav />
      <Component {...pageProps} />
    </CartProvider>
  );
}