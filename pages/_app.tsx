import '../styles/globals.css';
import Link from 'next/link';

export default function App({ Component, pageProps }) {
  return (
    <>
      <nav style={{
        padding: '1rem', background: '#1a202c', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div>
          <Link href="/" style={{ color: '#fff', marginRight: 16 }}>Home</Link>
          <Link href="/products" style={{ color: '#fff', marginRight: 16 }}>Products</Link>
          <Link href="/cart" style={{ color: '#fff', marginRight: 16 }}>Cart</Link>
          <Link href="/auth" style={{ color: '#fff', marginRight: 16 }}>Account</Link>
          <Link href="/about" style={{ color: '#fff', marginRight: 16 }}>About</Link>
          <Link href="/contact" style={{ color: '#fff', marginRight: 16 }}>Contact</Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </>
  );
}