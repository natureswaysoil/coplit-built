import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { Elements, PaymentElement, LinkAuthenticationElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useCart } from '../lib/cartContext'
import { NC_COUNTIES, NC_CITY_TO_COUNTY, NC_ZIP_TO_COUNTY } from '../lib/nc_data'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

function PaymentForm({
  email,
  setEmail,
}: {
  email: string
  setEmail: (v: string) => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    setError(null)
    const { error: submitError } = await stripe.confirmPayment({
      elements,
      // You can also set receipt_email on the server when creating the PI
      confirmParams: {
        return_url: window.location.origin + '/success',
      },
    })
    if (submitError) setError(submitError.message || 'Payment failed')
    setLoading(false)
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, maxWidth: 420, marginTop: 12 }}>
      {/* This enables the "Stripe Link" login/verification UI */}
      <LinkAuthenticationElement
        onChange={(e) => {
          if (e?.value?.email) setEmail(e.value.email)
        }}
        options={{ defaultValues: { email } }}
      />
      <PaymentElement options={{ layout: 'tabs' }} />
      <button disabled={!stripe || loading} style={{ padding: '10px 16px', fontWeight: 700 }}>
        {loading ? 'Processing…' : 'Pay with Link / Card'}
      </button>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
    </form>
  )
}

export default function Checkout() {
  const { items, clearCart } = useCart()

  // Customer/contact fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState<'NC' | 'Other'>('NC')
  const [zip, setZip] = useState('')
  const [county, setCounty] = useState('')

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Totals
  const subtotal = mounted ? items.reduce((sum, it) => sum + it.price * it.qty, 0) : 0
  const ncRate = useMemo(() => {
    const env = process.env.NEXT_PUBLIC_NC_TAX_RATE
    const parsed = env ? Number(env) : NaN
    return Number.isFinite(parsed) ? parsed : 0.0475 // default 4.75%
  }, [])
  const countyRatesMap = useMemo(() => {
    const raw = process.env.NEXT_PUBLIC_NC_COUNTY_RATES
    if (!raw) return {} as Record<string, number>
    try { return JSON.parse(raw) as Record<string, number> } catch { return {} as Record<string, number> }
  }, [])
  const norm = (s: string) => s.trim().toLowerCase()
  const countyRate = state === 'NC' && county ? (countyRatesMap[norm(county)] || 0) : 0
  const tax = mounted && state === 'NC' ? subtotal * (ncRate + countyRate) : 0
  const total = subtotal + tax

  // Autofill county from ZIP / city
  useEffect(() => {
    if (state !== 'NC') return
    const zipGuess = NC_ZIP_TO_COUNTY[zip]
    if (zipGuess && !county) { setCounty(zipGuess); return }
    const cityGuess = NC_CITY_TO_COUNTY[norm(city)]
    if (cityGuess && !county) setCounty(cityGuess)
  }, [zip, city, state]) // eslint-disable-line

  // Stripe PaymentIntent
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [creatingPI, setCreatingPI] = useState(false)

  async function beginPayment() {
    if (!items.length) return alert('Your cart is empty.')
    if (total < 0.5) return alert('Total must be at least $0.50 to pay.')
    if (!email) return alert('Please enter your email to continue to payment.')
    setCreatingPI(true)
    try {
      const r = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(total.toFixed(2)), // dollars; server converts to cents
          currency: 'usd',
          email, // let server set receipt_email
        }),
      })
      const j = await r.json()
      if (!r.ok || !j?.clientSecret) throw new Error(j?.error || 'Failed to create payment')
      setClientSecret(j.clientSecret)
      // Do NOT clear the cart yet — let webhook finalize & then you clear after success
    } catch (e: any) {
      alert(e.message || 'Could not start payment')
    } finally {
      setCreatingPI(false)
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Checkout</h1>

      {!mounted ? (
        <p suppressHydrationWarning>Loading…</p>
      ) : !items.length ? (
        <p>Your cart is empty. <a href="/products" style={{ color: '#174F2E', fontWeight: 'bold' }}>Browse products</a></p>
      ) : (
        <>
          {/* Customer & address form (your original fields) */}
          <section style={{ display: 'grid', gap: 12, marginBottom: 16 }}>
            <div>
              <label>Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: 8 }} />
            </div>
            <div>
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: 8 }} />
            </div>
            <div>
              <label>Phone</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required style={{ width: '100%', padding: 8 }} placeholder="(555) 555-5555" />
            </div>
            <div>
              <label>Address</label>
              <input value={address1} onChange={(e) => setAddress1(e.target.value)} required style={{ width: '100%', padding: 8, marginBottom: 6 }} placeholder="Street Address" />
              <input value={address2} onChange={(e) => setAddress2(e.target.value)} style={{ width: '100%', padding: 8 }} placeholder="Apt, Suite (optional)" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 120px 160px', gap: 12 }}>
              <div>
                <label>City</label>
                <input value={city} onChange={(e) => setCity(e.target.value)} required style={{ width: '100%', padding: 8 }} />
              </div>
              <div>
                <label>State</label>
                <select value={state} onChange={(e) => setState(e.target.value as any)} style={{ width: '100%', padding: 8 }}>
                  <option value="NC">NC</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label>ZIP</label>
                <input value={zip} onChange={(e) => setZip(e.target.value)} required style={{ width: '100%', padding: 8 }} />
              </div>
              <div>
                <label>County (NC only)</label>
                <input list="nc-counties" value={county} onChange={(e) => setCounty(e.target.value)} style={{ width: '100%', padding: 8 }} placeholder="Auto-fills from ZIP code" disabled={state !== 'NC'} />
                <datalist id="nc-counties">
                  {NC_COUNTIES.map(c => (<option key={c} value={c} />))}
                </datalist>
              </div>
            </div>
            <div style={{ fontSize: 12, color: '#555' }}>
              County auto-fills from ZIP code. If an NC county is provided and configured, county tax will be added on top of the state rate.
            </div>
          </section>

          {/* Items & totals */}
          <section>
            <h3>Items</h3>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {items.map(it => (
                <li key={it.sku}>{it.title} – {it.size} – {it.qty} × ${it.price.toFixed(2)} (SKU: {it.sku})</li>
              ))}
            </ul>
            <div style={{ textAlign: 'right', marginTop: 8 }}>
              <div>Subtotal: <span suppressHydrationWarning>${subtotal.toFixed(2)}</span></div>
              <div>Sales Tax{state==='NC' ? ` (${((ncRate + countyRate) * 100).toFixed(2)}%)` : ''}: <span suppressHydrationWarning>${tax.toFixed(2)}</span></div>
              <div style={{ fontWeight: 'bold' }}>Total: <span suppressHydrationWarning>${total.toFixed(2)}</span></div>
            </div>
          </section>

          {/* Step 1: Create PI + open Payment Element */}
          {!clientSecret ? (
            <button
              onClick={beginPayment}
              disabled={creatingPI}
              style={{ background: '#174F2E', color: 'white', border: 'none', borderRadius: 6, padding: '0.6rem 1.2rem', fontWeight: 'bold', cursor: 'pointer', marginTop: 16 }}
            >
              {creatingPI ? 'Preparing payment…' : 'Continue to Payment (Link / Card)'}
            </button>
          ) : (
            // Step 2: Render Payment Element (with Link) and confirm
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentForm email={email} setEmail={setEmail} />
            </Elements>
          )}
        </>
      )}
    </main>
  )
}
