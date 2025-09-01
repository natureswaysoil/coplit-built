import { useState, useEffect } from 'react'

interface Order {
  id: string
  orderNumber: string
  customer: {
    name: string
    email: string
    phone: string
    address1: string
    address2?: string
    city: string
    state: string
    zip: string
    county?: string
  }
  items: Array<{
    sku: string
    title: string
    size: string
    qty: number
    price: number
    total: number
  }>
  subtotal: number
  tax: number
  total: number
  status: string
  createdAt: string
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (!response.ok) throw new Error('Failed to fetch orders')
      const data = await response.json()
      setOrders(data.orders)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Loading orders...</h1>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
        <h1>Error: {error}</h1>
        <button onClick={fetchOrders} style={{ padding: '0.5rem 1rem', marginTop: '1rem' }}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Order Dashboard</h1>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Total Orders: {orders.length}</h2>
        <h3>Total Revenue: {formatCurrency(orders.reduce((sum, order) => sum + order.total, 0))}</h3>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {orders.map((order) => (
          <div key={order.id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1rem',
            backgroundColor: '#f9f9f9'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>{order.orderNumber}</h3>
              <span style={{
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                backgroundColor: order.status === 'confirmed' ? '#d4edda' : '#f8d7da',
                color: order.status === 'confirmed' ? '#155724' : '#721c24'
              }}>
                {order.status}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <h4>Customer</h4>
                <p><strong>{order.customer.name}</strong></p>
                <p>{order.customer.email}</p>
                <p>{order.customer.phone}</p>
              </div>

              <div>
                <h4>Shipping Address</h4>
                <p>{order.customer.address1}</p>
                {order.customer.address2 && <p>{order.customer.address2}</p>}
                <p>{order.customer.city}, {order.customer.state} {order.customer.zip}</p>
                {order.customer.county && <p>{order.customer.county} County</p>}
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <h4>Items</h4>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {order.items.map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.5rem',
                    backgroundColor: 'white',
                    borderRadius: '4px'
                  }}>
                    <div>
                      <strong>{item.title}</strong> - {item.size}
                      <br />
                      <small>SKU: {item.sku}</small>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div>{item.qty} × {formatCurrency(item.price)}</div>
                      <div><strong>{formatCurrency(item.total)}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem',
              backgroundColor: 'white',
              borderRadius: '4px'
            }}>
              <div>
                <strong>Order Date:</strong> {formatDate(order.createdAt)}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div>Subtotal: {formatCurrency(order.subtotal)}</div>
                <div>Tax: {formatCurrency(order.tax)}</div>
                <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
                  Total: {formatCurrency(order.total)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          <h2>No orders yet</h2>
          <p>Orders will appear here once customers start placing them.</p>
        </div>
      )}
    </div>
  )
}
