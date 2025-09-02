// pages/checkout.tsx
import { useEffect, useMemo, useState } from 'react'
import { useCart } from '../lib/cartContext'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import CheckoutForm_Tax from '../components/CheckoutForm_Tax'

const stripePromise = typeof window !== 'undefined'
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')
  : null

export default function CheckoutPage() {
  const { items, subtotal } = useCart()
  const [mounted, setMounted] = useState(false)
  const [zip, setZip] = useState('')
  const [city, setCity] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [intentId, setIntentId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [breakdown, setBreakdown] = useState<{subtotal: number; tax: number; shipping: number} | null>(null)

  useEffect(() => setMounted(true), [])

  const disabled = useMemo(() => {
    return !mounted || items.length === 0 || subtotal <= 0
  }, [mounted, items.length, subtotal])

  async function ensurePaymentIntent() {
    if (disabled) return
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      setError('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const resp = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intentId: intentId || undefined,
          items: items.map(it => ({ sku: it.sku, qty: it.qty, price: it.price })),
          state: (process.env.NEXT_PUBLIC_TAX_STATE || 'NC') as 'NC' | 'Other',
          zip,
          city,
          email,
          name,
          shipping: 0,
          currency: 'usd',
          metadata: { orderSource: 'web' },
        }),
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data?.error || 'Failed to create/update PaymentIntent')
      setClientSecret(data.clientSecret || null)
      setIntentId(data.intentId || null)
      setBreakdown(data.breakdown || null)
    } catch (e: any) {
      setError(e?.message || 'Failed to prepare checkout')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // refresh PI when cart changes
    if (items.length > 0) {
      ensurePaymentIntent()
    } else {
      setClientSecret(null)
      setIntentId(null)
      setBreakdown(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.map(i => `${i.sku}:${i.qty}:${i.price}`).join('|')])

  const appearance = { theme: 'stripe' as const }

  return (
    <main style={{ maxWidth: 900, margin: '2rem auto', fontFamily: 'system-ui', padding: '0 1rem' }}>
      <h1>Checkout</h1>

      {/* Cart items */}
      <section style={{ display: 'grid', gap: 12, marginTop: 16 }}>
        {mounted && items.length === 0 && <p>Your cart is empty.</p>}
        {items.map((it) => (
          <div key={it.sku} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '8px 0' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <img src={it.image} alt={it.title} width={48} height={48} style={{ objectFit: 'cover', borderRadius: 4 }} />
              <div>
                <div style={{ fontWeight: 600 }}>{it.title}</div>
                <div style={{ fontSize: 12, color: '#555' }}>SKU: {it.sku}{it.size ? ` • ${it.size}` : ''}</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div>Qty: {it.qty}</div>
              <div>${(it.price * it.qty).toFixed(2)}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Summary */}
      <section style={{ marginTop: 16, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 260 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Subtotal</span>
            <strong>${subtotal.toFixed(2)}</strong>
          </div>
          {breakdown && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <span>Sales Tax</span>
                <strong>${(breakdown.tax / 100).toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <span>Total</span>
                <strong>${(((breakdown.subtotal + breakdown.tax + breakdown.shipping) / 100)).toFixed(2)}</strong>
              </div>
            </>
          )}
        </div>

        {/* Address / contact */}
        <div style={{ flex: 1, minWidth: 280 }}>
          <label style={{ display: 'block', marginTop: 8 }}>
            Name
            <input type="text" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 6 }} />
          </label>
          <label style={{ display: 'block', marginTop: 8 }}>
            Email
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 6 }} />
          </label>
          <div style={{ display: 'flex', gap: 12 }}>
            <label style={{ display: 'block', marginTop: 8, flex: 1 }}>
              ZIP
              <input type="text" value={zip} onChange={e => setZip(e.target.value)} placeholder="e.g., 28580" style={{ width: '100%', padding: 8, marginTop: 6 }} />
            </label>
            <label style={{ display: 'block', marginTop: 8, flex: 1 }}>
              City
              <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="e.g., Snow Hill" style={{ width: '100%', padding: 8, marginTop: 6 }} />
            </label>
          </div>
          <button disabled={disabled || loading} onClick={ensurePaymentIntent} style={{ marginTop: 12, padding: '10px 16px' }}>
            {loading ? 'Preparing…' : (clientSecret ? 'Refresh totals' : 'Calculate totals')}
          </button>
          {error && <p style={{ color: 'crimson', marginTop: 8 }}>{error}</p>}
        </div>
      </section>

      {/* Stripe Elements */}
      {clientSecret && stripePromise && (
        <section style={{ marginTop: 24 }}>
          <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
            <CheckoutForm_Tax intentId={intentId as string} email={email} name={name} onPaid={() => { /* noop, redirect happens in form */ }} />
          </Elements>
        </section>
      )}
    </main>
  )
}
