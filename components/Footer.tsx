

import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--neutral-800)',
      color: 'var(--neutral-100)',
      padding: 'var(--space-xl) 0',
      marginTop: 'var(--space-xl)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'var(--space-xl)',
          marginBottom: 'var(--space-xl)'
        }}>
          {/* Company Info */}
          <div>
            <h3 style={{color: 'var(--primary)', marginBottom: 'var(--space-md)'}}>Nature's Way Soil</h3>
            <p style={{fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--neutral-300)'}}>
              Premium organic fertilizers and soil amendments for natural gardening. Safe for kids, pets, and pollinators.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{color: 'var(--neutral-100)', marginBottom: 'var(--space-md)'}}>Quick Links</h4>
            <ul style={{listStyle: 'none', padding: 0}}>
              <li style={{marginBottom: 'var(--space-sm)'}}>
                <Link href="/products" style={{color: 'var(--neutral-300)', textDecoration: 'none'}}>Products</Link>
              </li>
              <li style={{marginBottom: 'var(--space-sm)'}}>
                <Link href="/about" style={{color: 'var(--neutral-300)', textDecoration: 'none'}}>About Us</Link>
              </li>
              <li style={{marginBottom: 'var(--space-sm)'}}>
                <Link href="/blog" style={{color: 'var(--neutral-300)', textDecoration: 'none'}}>Blog</Link>
              </li>
              <li style={{marginBottom: 'var(--space-sm)'}}>
                <Link href="/contact" style={{color: 'var(--neutral-300)', textDecoration: 'none'}}>Contact</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 style={{color: 'var(--neutral-100)', marginBottom: 'var(--space-md)'}}>Customer Service</h4>
            <ul style={{listStyle: 'none', padding: 0}}>
              <li style={{marginBottom: 'var(--space-sm)'}}>
                <Link href="/terms-of-service" style={{color: 'var(--neutral-300)', textDecoration: 'none'}}>Terms of Service</Link>
              </li>
              <li style={{marginBottom: 'var(--space-sm)'}}>
                <Link href="/privacy-policy" style={{color: 'var(--neutral-300)', textDecoration: 'none'}}>Privacy Policy</Link>
              </li>
              <li style={{marginBottom: 'var(--space-sm)'}}>
                <Link href="/refund-policy" style={{color: 'var(--neutral-300)', textDecoration: 'none'}}>Refund Policy</Link>
              </li>
              <li style={{marginBottom: 'var(--space-sm)'}}>
                <Link href="/cart" style={{color: 'var(--neutral-300)', textDecoration: 'none'}}>Shopping Cart</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{color: 'var(--neutral-100)', marginBottom: 'var(--space-md)'}}>Get In Touch</h4>
            <p style={{fontSize: '0.9rem', color: 'var(--neutral-300)', marginBottom: 'var(--space-sm)'}}>
              Questions about our products?
            </p>
            <Link href="/contact" className="btn btn-primary btn-sm">
              Contact Us
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--neutral-700)',
          paddingTop: 'var(--space-lg)',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: 'var(--neutral-400)'
        }}>
          <p>&copy; {new Date().getFullYear()} Nature's Way Soil. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
