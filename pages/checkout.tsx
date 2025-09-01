import { useEffect, useMemo, useState } from 'react'
import { Elements, PaymentElement, LinkAuthenticationElement, useStripe, useElements } from '../lib/stripe-mock'
import { loadStripe } from '@stripe/stripe-js'
import { useCart } from '../lib/cartContext'
import { NC_COUNTIES, NC_CITY_TO_COUNTY, NC_ZIP_TO_COUNTY } from '../lib/nc_data'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

function PaymentForm({
  email, setEmail, clientSecret, finalizeOrder,
}: {
  email: string
  setEmail: (v: string) => void
  clientSecret: string
  finalizeOrder: (piId?: string) => Promise<void>
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

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',                       // stay on your site unless required
      confirmParams: { return_url: window.location.origin + '/success' }, // fallback
    })

    if (error) {
      setError(error.message || 'Payment failed')
      setLoading(false)
      return
    }

    if (paymentIntent?.status === 'succeeded') {
      try {
        await finalizeOrder(paymentIntent.id)
        window.location.href = '/success'
      } catch (e: any) {
        setError('Payment succeeded, but we could not finalize your order automatically. We’ll email you shortly.')
      }
      setLoading(false)
      return
    }

    setLoading(false)
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, maxWidth: 420, marginTop: 16 }}>
      <LinkAuthenticationElement
        options={{ defaultValues: { email } }}
        onChange={(e) => e?.value?.email && setEmail(e.value.email)}
      />
      <PaymentElement options={{ layout: 'tabs' }} />
      <button disabled={!stripe || !clientSecret || loading} style={{ padding: '10px 16px', fontWeight: 700 }}>
        {loading ? 'Processing…' : 'Pay with Link / Card'}
      </button>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
    </form>
  )
}

export default function Checkout() {
  const { items, clearCart } = useCart()

  // Customer + shipping
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState<'NC' | 'Other'>('NC')
  const [zip, setZip] = useState('')
  const [county, setCounty] = useState('')

  // Billing
  const [billingSame, setBillingSame] = useState(true)
  const [bName, setBName] = useState('')
  const [bAddress1, setBAddress1] = useState('')
  const [bAddress2, setBAddress2] = useState('')
  const [bCity, setBCity] = useState('')
  const [bState, setBState] = useState<'NC' | 'Other'>('NC')
  const [bZip, setBZip] = useState('')
  const [bPhone, setBPhone] = useState('')

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Totals
  const subtotal = mounted ? items.reduce((s, it) => s + it.price * it.qty, 0) : 0
  const ncRate = useMemo(() => {
    const env = process.env.NEXT_PUBLIC_NC_TAX_RATE
    const parsed = env ? Number(env) : NaN
    return Number.isFinite(parsed) ? parsed : 0.0475
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

  // Autofill county from ZIP/city for shipping
  useEffect(() => {
    if (state !== 'NC') return
    const zipGuess = (NC_ZIP_TO_COUNTY as any)[zip]
    if (zipGuess && !county) { setCounty(zipGuess); return }
    const cityGuess = (NC_CITY_TO_COUNTY as any)[norm(city)]
    if (cityGuess && !county) setCounty(cityGuess)
  }, [zip, city, state]) // eslint-disable-line

  // PI creation + Payment Element
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [creatingPI, setCreatingPI] = useState(false)
  const [serverTotals, setServerTotals] = useState<{ subtotal: number; tax: number; total: number } | null>(null)

  async function beginPayment() {
    if (!items.length) return alert('Your cart is empty.')
    if (!email) return alert('Please enter your email.')
    if (total < 0.5) return alert('Total must be at least $0.50.')

    // if using separate billing, validate basic fields
    if (!billingSame) {
      if (!bName || !bAddress1 || !bCity || !bZip) {
        return alert('Please complete your billing address.')
      }
    }

    setCreatingPI(true)
    try {
      const r = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currency: 'usd',
          email,
          name,
          items: items.map(it => ({ title: it.title, size: it.size, qty: it.qty, price: it.price, sku: it.sku })),
          shipping: { address1, address2, city, state, zip, county, phone },
        }),
      })
      const j = await r.json()
      if (!r.ok || !j?.clientSecret) throw new Error(j?.error || 'Failed to create payment')
      setClientSecret(j.clientSecret)
      setServerTotals({ subtotal: j.subtotal, tax: j.tax, total: j.total })
    } catch (e: any) {
      alert(e.message || 'Could not start payment')
    } finally {
      setCreatingPI(false)
    }
  }

  // Finalize order after payment succeeds (store ship/bill + items)
  const finalizeOrder = async (piId?: string) => {
    const billingPayload = billingSame
      ? null
      : {
          name: bName,
          address1: bAddress1,
          address2: bAddress2,
          city: bCity,
          state: bState,
          zip: bZip,
          phone: bPhone,
        }

    const amounts = serverTotals || { subtotal, tax, total }
    const resp = await fetch('/api/order-create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId: null, // or look up/create
        name, email,
        subtotal: amounts.subtotal,
        tax: amounts.tax,
        total: amounts.total,
        items: items.map(it => ({ sku: it.sku, qty: it.qty, price: it.price, title: it.title, size: it.size })),
        shipping: { address1, address2, city, state, zip, county, phone },
        billing: billingPayload,            // null = use Stripe PI enrich / fallback to shipping
        stripePaymentIntentId: piId || null,
      }),
    })
    if (!resp.ok) throw new Error(await resp.text())

    // Send confirmation email (best-effort)
    fetch('/api/order-confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: (await resp.json()).orderId,
        email, name,
        items: items.map(it => ({ title: it.title, size: it.size, qty: it.qty, price: it.price, sku: it.sku })),
        subtotal: amounts.subtotal,
        tax: amounts.tax,
        total: amounts.total,
        shipping: { address1, address2, city, state, zip, county, phone },
      }),
    }).catch(() => {})

    clearCart()
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
          {/* Shipping */}
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
              <label>Shipping Address</label>
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
                <select value={state} onChange={(e) => setState(e.target.value as 'NC' | 'Other')} required style={{ width: '100%', padding: 8 }}>
                  <option value="NC">NC</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label>Zip</label>
                <input value={zip} onChange={(e) => setZip(e.target.value)} required style={{ width: '100%', padding: 8 }} />
              </div>
              <div>
                <label>County (NC)</label>
                <select value={county} onChange={(e) => setCounty(e.target.value)} style={{ width: '100%', padding: 8 }}>
                  <option value="">Select</option>
                  {NC_COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* Billing */}
          <section style={{ display: 'grid', gap: 12, marginBottom: 16 }}>
            <label>
              <input type="checkbox" checked={billingSame} onChange={(e) => setBillingSame(e.target.checked)} /> Billing same as shipping
            </label>
            {!billingSame && (
              <div style={{ display: 'grid', gap: 12 }}>
                <input value={bName} onChange={(e) => setBName(e.target.value)} placeholder="Billing Name" style={{ width: '100%', padding: 8 }} />
                <input value={bAddress1} onChange={(e) => setBAddress1(e.target.value)} placeholder="Billing Address" style={{ width: '100%', padding: 8 }} />
                <input value={bAddress2} onChange={(e) => setBAddress2(e.target.value)} placeholder="Billing Address 2" style={{ width: '100%', padding: 8 }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 120px', gap: 12 }}>
                  <input value={bCity} onChange={(e) => setBCity(e.target.value)} placeholder="City" style={{ width: '100%', padding: 8 }} />
                  <select value={bState} onChange={(e) => setBState(e.target.value as 'NC' | 'Other')} style={{ width: '100%', padding: 8 }}>
                    <option value="NC">NC</option>
                    <option value="Other">Other</option>
                  </select>
                  <input value={bZip} onChange={(e) => setBZip(e.target.value)} placeholder="Zip" style={{ width: '100%', padding: 8 }} />
                </div>
                <input value={bPhone} onChange={(e) => setBPhone(e.target.value)} placeholder="Phone" style={{ width: '100%', padding: 8 }} />
              </div>
            )}
          </section>

          {/* Totals */}
          <section style={{ marginBottom: 16 }}>
            <p>Subtotal: ${(subtotal/100).toFixed(2)}</p>
            <p>Tax: ${(tax/100).toFixed(2)}</p>
            <p>Total: ${(total/100).toFixed(2)}</p>
            {!clientSecret && (
              <button onClick={beginPayment} disabled={creatingPI} style={{ padding: '10px 16px', fontWeight: 700 }}>
                {creatingPI ? 'Calculating…' : 'Enter payment details'}
              </button>
            )}
          </section>

          {/* Payment */}
          {clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentForm email={email} setEmail={setEmail} clientSecret={clientSecret} finalizeOrder={finalizeOrder} />
            </Elements>
          )}
        </>
      )}
    </main>
  )
}
