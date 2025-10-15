// pages/checkout.tsx
import { useEffect, useMemo, useState } from 'react'
import { Elements, PaymentElement, LinkAuthenticationElement, useStripe, useElements } from '../lib/stripe-mock'
import { loadStripe } from '@stripe/stripe-js'
import { useCart } from '../lib/cartContext'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe, Stripe } from '@stripe/stripe-js'
import CheckoutForm_Tax from '../components/CheckoutForm_Tax'
import { calculateShipping, FREE_SHIPPING_MINIMUM } from '../lib/shippingCalculator'

type CheckoutProps = { stripePk?: string | null }

export default function CheckoutPage({ stripePk }: CheckoutProps) {
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
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [validatingPromo, setValidatingPromo] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [intentId, setIntentId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stripeInitError, setStripeInitError] = useState<string | null>(null)
  const [breakdown, setBreakdown] = useState<{subtotal: number; tax: number; shipping: number; discount?: number; total: number} | null>(null)
  const [stripe, setStripe] = useState<Stripe | null>(null)
  const [stripeRetry, setStripeRetry] = useState(0)

  useEffect(() => setMounted(true), [])

  // Initialize Stripe using server-provided pk when available (avoids API caching)
  useEffect(() => {
    if (!mounted) return
    let cancelled = false
    ;(async () => {
      try {
    setStripeInitError(null)
    const key = stripePk || (await (await fetch('/api/config/stripe-pk')).json()).publishableKey
    if (!key) throw new Error('Stripe publishable key missing')
    const s = await loadStripe(key)
        if (!cancelled) setStripe(s)
      } catch (e: any) {
    if (!cancelled) setStripeInitError(e?.message || 'Stripe failed to initialize')
      }
    })()
    return () => { cancelled = true }
  }, [mounted, stripePk, stripeRetry])

  const disabled = useMemo(() => {
    return !mounted || items.length === 0 || subtotal <= 0 || !name.trim() || !email.trim() || !address1.trim() || !city.trim() || !stateCode.trim() || !zip.trim()
  }, [mounted, items.length, subtotal, name, email, address1, city, stateCode, zip])

  // Calculate shipping rates
  const shippingRates = useMemo(() => {
    if (!mounted || items.length === 0) return { standard: 0 };
    const shippingItems = items.map(item => ({
      sku: item.sku,
      size: item.size || '32 oz', // default size
      qty: item.qty
    }));
    return calculateShipping(shippingItems, subtotal);
  }, [mounted, items, subtotal]);

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

  async function ensurePaymentIntent() {
    if (disabled) return

    // Additional validation for required fields
    if (!name.trim()) {
      setError('Name is required')
      return
    }
    if (!email.trim()) {
      setError('Email is required')
      return
    }
    if (!address1.trim()) {
      setError('Address is required')
      return
    }
    if (!city.trim()) {
      setError('City is required')
      return
    }
    if (!stateCode.trim()) {
      setError('State is required')
      return
    }
    if (!zip.trim()) {
      setError('ZIP code is required')
      return
    }

    // Stripe will be initialized separately; don't block on env here
    setLoading(true)
    setError(null)
    setPromoError(null)
    try {
      const resp = await fetch('/api/create-payment-intent-with-tax', {
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
      setError(e?.message || 'Failed to prepare checkout')
    } finally {
      setLoading(false)
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
    <main style={{ maxWidth: 900, margin: '2rem auto', fontFamily: 'system-ui', padding: '0 1rem' }}>
      <h1>Checkout</h1>

      {/* Stripe initialization banner */}
      {stripeInitError && (
        <div style={{
          background: '#fff3cd',
          color: '#664d03',
          border: '1px solid #ffecb5',
          borderRadius: 6,
          padding: '12px',
          marginTop: 12
        }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Payment form unavailable</div>
          <div style={{ fontSize: 14 }}>
            Stripe couldn’t initialize: {stripeInitError}. Try again, or review diagnostics.
            {' '}<a href="/api/config/stripe-pk" target="_blank" rel="noopener noreferrer" style={{ color: '#0c63e4', textDecoration: 'none' }}>View publishable key</a>
            {' '}|{' '}
            <a href="/api/config/diagnostics" target="_blank" rel="noopener noreferrer" style={{ color: '#0c63e4', textDecoration: 'none' }}>Diagnostics</a>
          </div>
          <button onClick={() => setStripeRetry(v => v + 1)} style={{ marginTop: 8, padding: '6px 10px', background: '#0d6efd', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            Retry loading Stripe
          </button>
        </div>
      )}

      {/* Cart items */}
      <section style={{ display: 'grid', gap: 12, marginTop: 16 }}>
        {mounted && items.length === 0 && <p>Your cart is empty.</p>}
        {items.map((it) => (
          <div key={it.sku} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '8px 0' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Image 
  src={it.image} 
  alt={it.title} 
  width={48} 
  height={48} 
  style={{ objectFit: 'cover', borderRadius: 4 }}
  unoptimized
/>
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

      {/* Promo Code Section */}
      <section style={{ marginTop: 16, padding: 16, background: '#f8f9fa', borderRadius: 8 }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: 16 }}>Have a Promo Code?</h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            placeholder="Enter code (e.g., WELCOME15)"
            style={{ 
              flex: 1, 
              padding: '8px 12px', 
              border: promoError ? '2px solid #ef4444' : '1px solid #ccc',
              borderRadius: 4,
              fontSize: 14
            }}
          />
          <button
            onClick={ensurePaymentIntent}
            disabled={!promoCode.trim() || disabled || loading}
            style={{
              padding: '8px 16px',
              background: promoApplied ? '#22c55e' : '#0d6efd',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: disabled || loading ? 'not-allowed' : 'pointer',
              opacity: disabled || loading ? 0.6 : 1,
              fontSize: 14,
              fontWeight: 600
            }}
          >
            {promoApplied ? '✓ Applied' : 'Apply'}
          </button>
        </div>
        {promoApplied && (
          <p style={{ margin: '8px 0 0 0', fontSize: 14, color: '#22c55e', fontWeight: 600 }}>
            ✓ Promo code applied successfully!
          </p>
        )}
        {promoError && (
          <p style={{ margin: '8px 0 0 0', fontSize: 14, color: '#ef4444' }}>
            {promoError}
          </p>
        )}
      </section>

      {/* Summary */}
      <section style={{ marginTop: 16, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 260 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Subtotal</span>
            <strong>${breakdown ? (breakdown.subtotal / 100).toFixed(2) : subtotal.toFixed(2)}</strong>
          </div>
          {breakdown && (
            <>
              {breakdown.discount && breakdown.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, color: '#22c55e' }}>
                  <span>Discount</span>
                  <strong>-${(breakdown.discount / 100).toFixed(2)}</strong>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, alignItems: 'center', gap: 8 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  Sales Tax {typeof (breakdown as any).taxRatePercent === 'number' && (breakdown as any).taxRatePercent > 0 ? <span style={{ color: '#555', fontSize: 12 }}>({(breakdown as any).taxRatePercent.toFixed(2)}%)</span> : null}
                  <span
                    title={
                      (breakdown as any).taxRatePercent ? `Effective tax rate applied to taxable items${(breakdown as any).taxRatePercent ? `: ${(breakdown as any).taxRatePercent.toFixed(4)}%` : ''}. Rates derived from NC base + county data. Shipping may be taxable depending on configuration.` : 'Sales tax applied to taxable items.'
                    }
                    style={{ cursor: 'help', background: '#eef2ff', color: '#3730a3', borderRadius: '50%', width: 16, height: 16, fontSize: 11, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                  >i</span>
                </span>
                <strong>${(breakdown.tax / 100).toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <span>Shipping</span>
                <strong>${((breakdown.shipping || 0) / 100).toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <span>Total</span>
                <strong>${(((breakdown.subtotal + breakdown.tax + (breakdown.shipping || 0) - (breakdown.discount || 0)) / 100)).toFixed(2)}</strong>
              </div>
            </>
          )}
          {!breakdown && shippingCost > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span>Est. Shipping</span>
              <strong>${shippingCost.toFixed(2)}</strong>
            </div>
          )}
          {subtotal >= FREE_SHIPPING_MINIMUM && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, color: '#22c55e' }}>
              <span>Free Shipping!</span>
              <strong>$0.00</strong>
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
