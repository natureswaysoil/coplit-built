import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useCart } from '../lib/cartContext'

export default function Cart() {
  const { items, updateQty, removeItem, clearCart } = useCart()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const subtotal = mounted ? items.reduce((sum, it) => sum + it.price * it.qty, 0) : 0

  return (
    <main style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Your Cart</h1>
      {!mounted ? (
        <p suppressHydrationWarning>Loading cart…</p>
      ) : items.length === 0 ? (
        <p>Your cart is empty. <a href="/products" style={{ color: '#174F2E', fontWeight: 'bold' }}>Browse products</a></p>
      ) : (
        <>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {items.map((it) => (
              <div key={it.sku} style={{ display: 'flex', gap: '1rem', alignItems: 'center', border: '1px solid #eee', borderRadius: 8, padding: '0.75rem' }}>
                <Image src={it.image} alt={it.title} width={64} height={64} style={{ objectFit: 'contain' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold' }}>{it.title}</div>
                  <div style={{ color: '#555' }}>Size: {it.size} • SKU: {it.sku}</div>
                </div>
                <div>
                  <input
                    type="number"
                    min={1}
                    value={it.qty}
                    onChange={(e) => updateQty(it.sku, Math.max(1, Number(e.target.value)))}
                    style={{ width: 64, padding: 6 }}
                  />
                </div>
                <div style={{ width: 100, textAlign: 'right' }}>${(it.price * it.qty).toFixed(2)}</div>
                <button onClick={() => removeItem(it.sku)} style={{ marginLeft: 8 }}>Remove</button>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
            <a href="/checkout" style={{ background: '#174F2E', color: 'white', borderRadius: 6, padding: '0.6rem 1.2rem', fontWeight: 'bold' }}>Checkout</a>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
              Subtotal: <span suppressHydrationWarning>${subtotal.toFixed(2)}</span>
            </div>
            <button onClick={clearCart} style={{ marginTop: '0.5rem' }}>Clear Cart</button>
          </div>
        </>
      )}
    </main>
  )
}
