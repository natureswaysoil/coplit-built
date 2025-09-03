// pages/checkout.tsx
import { useEffect, useMemo, useState } from 'react'
import { useCart } from '../lib/cartContext'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe, Stripe } from '@stripe/stripe-js'
import CheckoutForm_Tax from '../components/CheckoutForm_Tax'

export default function CheckoutPage() {
  const { items, subtotal } = useCart()
  const [mounted, setMounted] = useState(false)
  const [zip, setZip] = useState('')
  const [city, setCity] = useState('')
  const [stateCode, setStateCode] = useState('NC')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [intentId, setIntentId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [breakdown, setBreakdown] = useState<{subtotal: number; tax: number; shipping: number} | null>(null)
  const [stripe, setStripe] = useState<Stripe | null>(null)

  useEffect(() => setMounted(true), [])

  // Load publishable key at runtime and initialize Stripe
  useEffect(() => {
    if (!mounted) return
    let cancelled = false
    ;(async () => {
      try {
        const r = await fetch('/api/config/stripe-pk')
        const j = await r.json()
        if (!r.ok) throw new Error(j?.error || 'Failed to load Stripe key')
        const s = await loadStripe(j.publishableKey)
        if (!cancelled) setStripe(s)
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Stripe init failed')
      }
    })()
    return () => { cancelled = true }
  }, [mounted])

  const disabled = useMemo(() => {
    return !mounted || items.length === 0 || subtotal <= 0
  }, [mounted, items.length, subtotal])

  async function ensurePaymentIntent() {
    if (disabled) return
  // Stripe will be initialized separately; don't block on env here
    setLoading(true)
    setError(null)
    try {
      const resp = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intentId: intentId || undefined,
          items: items.map(it => ({ sku: it.sku, qty: it.qty, price: it.price })),
          state: (stateCode?.toUpperCase() === 'NC' ? 'NC' : 'Other') as 'NC' | 'Other',
          zip,
          city,
          email,
          name,
          billing: {
            name,
            email,
            phone,
            address1,
            address2,
            city,
            state: stateCode,
            zip,
          },
          shippingAddress: {
            name,
            email,
            phone,
            address1,
            address2,
            city,
            state: stateCode,
            zip,
          },
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
          <label style={{ display: 'block', marginTop: 8 }}>
            Phone (optional)
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 6 }} />
          </label>
          <label style={{ display: 'block', marginTop: 8 }}>
            Address line 1
            <input type="text" value={address1} onChange={e => setAddress1(e.target.value)} placeholder="Street address" style={{ width: '100%', padding: 8, marginTop: 6 }} />
          </label>
          <label style={{ display: 'block', marginTop: 8 }}>
            Address line 2 (optional)
            <input type="text" value={address2} onChange={e => setAddress2(e.target.value)} placeholder="Apt, suite, etc." style={{ width: '100%', padding: 8, marginTop: 6 }} />
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
            <label style={{ display: 'block', marginTop: 8, flex: 1 }}>
              State
              <input type="text" value={stateCode} onChange={e => setStateCode(e.target.value.toUpperCase())} placeholder="NC" maxLength={2} style={{ width: '100%', padding: 8, marginTop: 6 }} />
            </label>
          </div>
          <button disabled={disabled || loading} onClick={ensurePaymentIntent} style={{ marginTop: 12, padding: '10px 16px' }}>
            {loading ? 'Preparing…' : (clientSecret ? 'Refresh totals' : 'Calculate totals')}
          </button>
          {error && <p style={{ color: 'crimson', marginTop: 8 }}>{error}</p>}
        </div>
      </section>

      {/* Stripe Elements */}
    {clientSecret && stripe && (
        <section style={{ marginTop: 24 }}>
      <Elements stripe={stripe} options={{ clientSecret, appearance }}>
            <CheckoutForm_Tax
              intentId={intentId as string}
              email={email}
              name={name}
              address={{
                address1,
                address2,
                city,
                state: stateCode,
                zip,
                phone,
              }}
              onPaid={() => { /* noop, redirect happens in form */ }}
            />
          </Elements>
        </section>
      )}
    </main>
  )
}
