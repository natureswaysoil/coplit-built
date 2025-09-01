import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCart } from '../lib/cartContext'

export default function SmokeUI() {
  const { items, addItem, clearCart } = useCart()
  const [added, setAdded] = useState(false)
  const [orderResult, setOrderResult] = useState<any>(null)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    // Ensure at least one test item in cart
    if (!items.some(i => i.sku === 'SMOKE-001')) {
      addItem({ id: 'smoke-1', title: 'Smoke Test Item', image: '', sku: 'SMOKE-001', size: '1 Gallon', price: 10.0, qty: 1 })
      setAdded(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const createOrder = async () => {
    setCreating(true)
    try {
      const resp = await fetch('/api/order-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: 'UI Smoke',
            email: 'ui-smoke@example.com',
            phone: '555-000-0000',
            address1: '1 Test Way',
            city: 'Raleigh',
            state: 'NC',
            zip: '27601',
            county: 'Wake'
          },
          items: items.length ? items.map(i => ({ sku: i.sku, title: i.title, size: i.size, qty: i.qty, price: i.price })) : [
            { sku: 'SMOKE-001', title: 'Smoke Test Item', size: '1 Gallon', qty: 1, price: 10.0 }
          ],
          subtotal: items.length ? items.reduce((s, i) => s + i.price * i.qty, 0) : 10.0,
          tax: 0.48,
          total: (items.length ? items.reduce((s, i) => s + i.price * i.qty, 0) : 10.0) + 0.48
        })
      })
      const jr = await resp.json().catch(() => ({}))
      setOrderResult({ ok: resp.ok, status: resp.status, body: jr })
      if (resp.ok) clearCart()
    } catch (e: any) {
      setOrderResult({ ok: false, error: e?.message || String(e) })
    } finally {
      setCreating(false)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
      <h1>Add → Checkout Smoke (UI)</h1>
      <p>This page adds a test item to your cart and can create an order via the API.</p>
      <div style={{ margin: '12px 0', padding: 12, background: '#f5f5f5', borderRadius: 6 }}>
        <div><b>Cart Items:</b> {items.length}</div>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(items, null, 2)}</pre>
        {added && <div style={{ color: '#174F2E' }}>Test item added.</div>}
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link href="/checkout" style={{ background: '#174F2E', color: 'white', padding: '8px 12px', borderRadius: 6 }}>Go to Checkout</Link>
        <button onClick={createOrder} disabled={creating} style={{ background: '#007bff', color: 'white', padding: '8px 12px', border: 'none', borderRadius: 6 }}>
          {creating ? 'Creating Order…' : 'Create Order via API'}
        </button>
      </div>
      {orderResult && (
        <div style={{ marginTop: 16 }}>
          <h3>Order Result</h3>
          <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 6 }}>{JSON.stringify(orderResult, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
