import { useState, useEffect } from 'react'
import { useCart } from '../lib/cartContext'

export default function DebugPage() {
  const { items, addItem, clearCart } = useCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const testItem = {
    id: 'test-1',
    title: 'Test Product',
    image: '/test-image.jpg',
    sku: 'TEST-001',
    size: '1 Gallon',
    price: 25.00,
    qty: 1
  }

  const addTestItem = () => {
    addItem(testItem)
    alert('Test item added to cart!')
  }

  const testOrderAPI = async () => {
    try {
      const response = await fetch('/api/order-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: 'Test Customer',
            email: 'test@example.com',
            phone: '555-123-4567',
            address1: '123 Test St',
            city: 'Raleigh',
            state: 'NC',
            zip: '27601',
            county: 'Wake'
          },
          items: [{
            sku: 'TEST-001',
            title: 'Test Product',
            size: '1 Gallon',
            qty: 1,
            price: 25.00
          }],
          subtotal: 25.00,
          tax: 1.19,
          total: 26.19
        })
      })

      const result = await response.json()
      alert(`API Test Result: ${response.ok ? 'SUCCESS' : 'FAILED'}\n${JSON.stringify(result, null, 2)}`)
    } catch (error) {
      alert(`API Test Error: ${error}`)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Debug & Testing Page</h1>

      <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Cart Status</h2>
        <p><strong>Mounted:</strong> {mounted ? 'Yes' : 'No'}</p>
        <p><strong>Items in Cart:</strong> {items.length}</p>
        <div>
          <strong>Cart Items:</strong>
          <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', fontSize: '12px' }}>
            {JSON.stringify(items, null, 2)}
          </pre>
        </div>
      </div>

      <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Test Actions</h2>
        <button
          onClick={addTestItem}
          style={{ marginRight: '1rem', padding: '0.5rem 1rem', background: '#174F2E', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Add Test Item to Cart
        </button>

        <button
          onClick={clearCart}
          style={{ marginRight: '1rem', padding: '0.5rem 1rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Clear Cart
        </button>

        <button
          onClick={testOrderAPI}
          style={{ padding: '0.5rem 1rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Test Order API
        </button>
      </div>

      <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Navigation Links</h2>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/products">Products</a></li>
          <li><a href="/cart">Cart</a></li>
          <li><a href="/checkout">Checkout</a></li>
          <li><a href="/admin">Admin Dashboard</a></li>
        </ul>
      </div>

      <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Environment Check</h2>
        <p><strong>Next.js Version:</strong> {process.env.NEXT_RUNTIME || 'Unknown'}</p>
        <p><strong>Node Environment:</strong> {process.env.NODE_ENV || 'development'}</p>
      </div>

      <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Local Storage</h2>
        <button
          onClick={() => {
            const cart = localStorage.getItem('cart')
            alert(`Cart in localStorage: ${cart || 'Empty'}`)
          }}
          style={{ padding: '0.5rem 1rem', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Check LocalStorage
        </button>
      </div>
    </div>
  )
}
