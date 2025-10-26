import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useCart } from '../lib/cartContext'
import { FREE_SHIPPING_MINIMUM } from '../lib/shippingCalculator'
import FreeShippingProgress from '../components/FreeShippingProgress'

export default function Cart() {
  const { items, updateQty, removeItem, clearCart } = useCart()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const subtotal = mounted ? items.reduce((sum, it) => sum + it.price * it.qty, 0) : 0
  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_MINIMUM) * 100, 100)

  return (
    <>
      <Head>
        <title>Shopping Cart | Nature's Way Soil</title>
        <meta name="description" content="Review your Nature's Way Soil products before checkout." />
      </Head>
      
      <main className="p-xl">
        <div className="container" style={{maxWidth: '1000px'}}>
          <div className="mb-xl">
            <h1>Your Cart</h1>
            {mounted && items.length > 0 && (
              <p style={{color: 'var(--neutral-600)'}}>
                {items.length} item{items.length !== 1 ? 's' : ''} in your cart
              </p>
            )}
          </div>
          
          {!mounted ? (
            <div className="card text-center">
              <p>Loading cart...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="card text-center">
              <h3>Your cart is empty</h3>
              <p className="mb-lg">Discover our range of organic soil products to get started.</p>
              <Link href="/products" className="btn btn-primary">
                Browse Products
              </Link>
            </div>
          ) : (
            <>
              {/* Free Shipping Progress Bar */}
              <FreeShippingProgress />
              
              <div style={{ display: 'grid', gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
                {items.map((it) => (
                  <div key={it.sku} className="card" style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto auto auto',
                    gap: 'var(--space-lg)',
                    alignItems: 'center'
                  }}>
                    <Image 
                      src={it.image} 
                      alt={it.title} 
                      width={80} 
                      height={80} 
                      style={{ objectFit: 'contain', borderRadius: '0.5rem' }} 
                    />
                    <div>
                      <h4 style={{marginBottom: 'var(--space-xs)', color: 'var(--neutral-800)'}}>{it.title}</h4>
                      <p style={{color: 'var(--neutral-600)', fontSize: '0.9rem', margin: 0}}>
                        Size: {it.size} • SKU: {it.sku}
                      </p>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: 'var(--space-sm)'}}>
                      <label style={{fontSize: '0.9rem', color: 'var(--neutral-600)'}}>Qty:</label>
                      <input
                        type="number"
                        min={1}
                        value={it.qty}
                        onChange={(e) => updateQty(it.sku, Math.max(1, Number(e.target.value)))}
                        style={{
                          width: '70px',
                          padding: 'var(--space-xs) var(--space-sm)',
                          border: '1px solid var(--neutral-300)',
                          borderRadius: '0.25rem',
                          textAlign: 'center'
                        }}
                      />
                    </div>
                    <div style={{ 
                      fontSize: '1.1rem', 
                      fontWeight: '600', 
                      color: 'var(--primary)',
                      minWidth: '80px',
                      textAlign: 'right'
                    }}>
                      ${(it.price * it.qty).toFixed(2)}
                    </div>
                    <button 
                      onClick={() => removeItem(it.sku)}
                      style={{
                        background: 'none',
                        border: '1px solid var(--neutral-300)',
                        borderRadius: '0.25rem',
                        padding: 'var(--space-xs) var(--space-sm)',
                        color: 'var(--neutral-600)',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Free Shipping Progress Bar */}
              {subtotal < FREE_SHIPPING_MINIMUM ? (
                <div className="card" style={{
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                  border: '2px solid #86efac',
                  marginBottom: 'var(--space-lg)'
                }}>
                  <div style={{marginBottom: 'var(--space-sm)'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xs)'}}>
                      <span style={{fontSize: '0.95rem', fontWeight: '600', color: '#166534'}}>
                        🚚 Progress to FREE Shipping
                      </span>
                      <span style={{fontSize: '1.1rem', fontWeight: '700', color: '#15803d'}}>
                        ${(FREE_SHIPPING_MINIMUM - subtotal).toFixed(2)} away!
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '12px',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '9999px',
                      overflow: 'hidden',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{
                        width: `${shippingProgress}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)',
                        borderRadius: '9999px',
                        transition: 'width 0.5s ease-in-out',
                        boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)'
                      }} />
                    </div>
                    <p style={{fontSize: '0.8rem', color: '#065f46', marginTop: 'var(--space-xs)', marginBottom: 0}}>
                      💰 Add ${(FREE_SHIPPING_MINIMUM - subtotal).toFixed(2)} more to save on shipping!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="card" style={{
                  background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                  border: '2px solid #22c55e',
                  marginBottom: 'var(--space-lg)'
                }}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 'var(--space-sm)'}}>
                    <span style={{fontSize: '1.5rem'}}>✅</span>
                    <p style={{fontSize: '1.1rem', fontWeight: '700', color: '#166534', margin: 0}}>
                      🎉 You qualify for FREE shipping!
                    </p>
                  </div>
                </div>
              )}
              
              <div className="card" style={{backgroundColor: 'var(--neutral-50)'}}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 'var(--space-lg)'
                }}>
                  <div style={{display: 'flex', gap: 'var(--space-md)'}}>
                    <Link href="/checkout" className="btn btn-primary">
                      Proceed to Checkout
                    </Link>
                    <button 
                      onClick={clearCart}
                      className="btn btn-secondary"
                    >
                      Clear Cart
                    </button>
                  </div>
                  <div style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: '600',
                    color: 'var(--neutral-800)'
                  }}>
                    Subtotal: <span suppressHydrationWarning style={{color: 'var(--primary)'}}>${subtotal.toFixed(2)}</span>
                  </div>
                </div>
                {subtotal >= 75 && (
                  <div style={{
                    marginTop: 'var(--space-md)',
                    padding: 'var(--space-sm)',
                    backgroundColor: '#dcfce7',
                    border: '1px solid #bbf7d0',
                    borderRadius: '0.5rem',
                    color: '#166534',
                    textAlign: 'center',
                    fontSize: '0.9rem'
                  }}>
                    Congratulations! You qualify for free shipping.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  )
}
