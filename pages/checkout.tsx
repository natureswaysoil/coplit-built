// pages/checkout.tsx
import { useEffect, useMemo, useState } from 'react'
import type { GetServerSideProps } from 'next'
import { getPublishableKey } from '../lib/stripeConfig'
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

  const [selectedShipping, setSelectedShipping] = useState<'standard' | 'expedited' | 'priority'>('standard');
  const shippingCost = shippingRates[selectedShipping] || 0;

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
          items: items.map(it => ({
            id: it.id,
            title: it.title,
            image: it.image,
            sku: it.sku,
            size: it.size,
            price: it.price,
            qty: it.qty
          })),
          customer: { name, email },
          address: { line1: address1, city, state: stateCode, postal_code: zip, country: 'US' },
          shipping: { amount: Math.round(shippingCost * 100) }, // Convert to cents
          promoCode: promoCode.trim() || undefined
        })
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data?.error || 'Failed to create/update PaymentIntent')
      setClientSecret(data.clientSecret || null)
      setIntentId(data.intentId || null)
      setBreakdown(data.breakdown || null)
      
      // Check if promo code was applied
      if (promoCode.trim() && data.breakdown?.discount && data.breakdown.discount > 0) {
        setPromoApplied(true)
        setPromoError(null)
      } else if (promoCode.trim()) {
        setPromoError('Promo code not found or invalid')
        setPromoApplied(false)
      }
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

  // Automatically create the PaymentIntent when all required fields are present
  useEffect(() => {
    if (!disabled && !clientSecret && items.length > 0 && !loading) {
      ensurePaymentIntent()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, clientSecret, items.length])

  const appearance = { theme: 'stripe' as const }

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
          )}
        </div>

        {/* Promo Code Section */}
        <div style={{ minWidth: 280, padding: 16, background: '#f8f9fa', borderRadius: 8 }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: 16 }}>Have a Promo Code?</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={promoCode}
              onChange={(e) => {
                setPromoCode(e.target.value.toUpperCase())
                setPromoError('')
              }}
              placeholder="Enter code"
              disabled={promoApplied || validatingPromo}
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid #ccc',
                borderRadius: 4,
                fontSize: 14
              }}
            />
            <button
              onClick={async () => {
                if (!promoCode.trim()) {
                  setPromoError('Please enter a promo code')
                  return
                }
                setValidatingPromo(true)
                setPromoError('')
                try {
                  const resp = await fetch(`/api/promo/validate?code=${encodeURIComponent(promoCode)}`)
                  const data = await resp.json()
                  if (data.valid) {
                    setPromoApplied(true)
                    setPromoError('')
                    // Trigger payment intent refresh
                    await ensurePaymentIntent()
                  } else {
                    setPromoError('Invalid or expired promo code')
                    setPromoApplied(false)
                  }
                } catch (err) {
                  setPromoError('Failed to validate promo code')
                  setPromoApplied(false)
                } finally {
                  setValidatingPromo(false)
                }
              }}
              disabled={promoApplied || validatingPromo || !promoCode.trim()}
              style={{
                padding: '8px 16px',
                background: promoApplied ? '#22c55e' : '#0d6efd',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                cursor: promoApplied || validatingPromo ? 'not-allowed' : 'pointer',
                fontSize: 14,
                fontWeight: 600
              }}
            >
              {validatingPromo ? 'Checking...' : promoApplied ? 'Applied' : 'Apply'}
            </button>
          </div>
          {promoApplied && (
            <div style={{ marginTop: 8, color: '#22c55e', fontSize: 14, display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg style={{ width: 16, height: 16 }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Promo code applied successfully!</span>
              <button
                onClick={() => {
                  setPromoApplied(false)
                  setPromoCode('')
                  ensurePaymentIntent()
                }}
                style={{
                  marginLeft: 'auto',
                  background: 'transparent',
                  border: 'none',
                  color: '#dc2626',
                  cursor: 'pointer',
                  fontSize: 12,
                  textDecoration: 'underline'
                }}
              >
                Remove
              </button>
            </div>
          )}
          {promoError && (
            <div style={{ marginTop: 8, color: '#dc2626', fontSize: 14 }}>
              {promoError}
            </div>
          )}
          <p style={{ fontSize: 12, color: '#666', margin: '8px 0 0 0' }}>
            Try code: <strong>SAVE15</strong> for 15% off your order!
          </p>
        </div>

        {/* Shipping Options */}
        {subtotal < FREE_SHIPPING_MINIMUM && (
          <div style={{ minWidth: 280, padding: 16, background: '#f8f9fa', borderRadius: 8 }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: 16 }}>Shipping Options</h3>
            {shippingRates.standard !== undefined && (
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="shipping" 
                  value="standard" 
                  checked={selectedShipping === 'standard'} 
                  onChange={e => setSelectedShipping(e.target.value as 'standard')}
                />
                <span>Standard Shipping (5-7 business days) - ${shippingRates.standard.toFixed(2)}</span>
              </label>
            )}
            {shippingRates.expedited && (
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="shipping" 
                  value="expedited" 
                  checked={selectedShipping === 'expedited'} 
                  onChange={e => setSelectedShipping(e.target.value as 'expedited')}
                />
                <span>Expedited Shipping (2-3 business days) - ${shippingRates.expedited.toFixed(2)}</span>
              </label>
            )}
            {shippingRates.priority && (
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="shipping" 
                  value="priority" 
                  checked={selectedShipping === 'priority'} 
                  onChange={e => setSelectedShipping(e.target.value as 'priority')}
                />
                <span>Priority Shipping (1-2 business days) - ${shippingRates.priority.toFixed(2)}</span>
              </label>
            )}
            <p style={{ fontSize: 14, color: '#666', margin: '8px 0 0 0' }}>
              Tip: Get <strong>FREE SHIPPING</strong> on orders over ${FREE_SHIPPING_MINIMUM.toFixed(2)}!
            </p>
          </div>
        )}

        {/* Address / contact */}
        <div style={{ flex: 1, minWidth: 280 }}>
          <h3 style={{ marginBottom: 16 }}>Shipping & Contact Information</h3>
          <p style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>
            Fields marked with * are required. Please fill in your complete shipping address for accurate tax calculation.
          </p>
          <label style={{ display: 'block', marginTop: 8 }}>
            Name *
            <input type="text" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 6, border: !name.trim() ? '2px solid #ef4444' : '1px solid #ccc' }} />
          </label>
          <label style={{ display: 'block', marginTop: 8 }}>
            Email *
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 6, border: !email.trim() ? '2px solid #ef4444' : '1px solid #ccc' }} />
          </label>
          <label style={{ display: 'block', marginTop: 8 }}>
            Phone (optional)
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 6 }} />
          </label>
          <label style={{ display: 'block', marginTop: 8 }}>
            Address line 1 *
            <input type="text" value={address1} onChange={e => setAddress1(e.target.value)} placeholder="Street address" style={{ width: '100%', padding: 8, marginTop: 6, border: !address1.trim() ? '2px solid #ef4444' : '1px solid #ccc' }} />
          </label>
          <label style={{ display: 'block', marginTop: 8 }}>
            Address line 2 (optional)
            <input type="text" value={address2} onChange={e => setAddress2(e.target.value)} placeholder="Apt, suite, etc." style={{ width: '100%', padding: 8, marginTop: 6 }} />
          </label>
          <div style={{ display: 'flex', gap: 12 }}>
            <label style={{ display: 'block', marginTop: 8, flex: 1 }}>
              ZIP *
              <input type="text" value={zip} onChange={e => setZip(e.target.value)} placeholder="e.g., 28580" style={{ width: '100%', padding: 8, marginTop: 6, border: !zip.trim() ? '2px solid #ef4444' : '1px solid #ccc' }} />
            </label>
            <label style={{ display: 'block', marginTop: 8, flex: 1 }}>
              City *
              <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="e.g., Snow Hill" style={{ width: '100%', padding: 8, marginTop: 6, border: !city.trim() ? '2px solid #ef4444' : '1px solid #ccc' }} />
            </label>
            <label style={{ display: 'block', marginTop: 8, flex: 1 }}>
              State *
              <input type="text" value={stateCode} onChange={e => setStateCode(e.target.value.toUpperCase())} placeholder="NC" maxLength={2} style={{ width: '100%', padding: 8, marginTop: 6, border: !stateCode.trim() ? '2px solid #ef4444' : '1px solid #ccc' }} />
            </label>
          </div>
          <button disabled={disabled || loading} onClick={ensurePaymentIntent} style={{ marginTop: 12, padding: '10px 16px' }}>
            {loading ? 'Preparing…' : (clientSecret ? 'Update totals & payment form' : 'Calculate totals & show payment form')}
          </button>
          {disabled && !loading && (
            <p style={{ fontSize: 14, color: '#666', marginTop: 8 }}>
              Please fill in all required fields (marked with *) to continue.
            </p>
          )}
          {error && <p style={{ color: 'crimson', marginTop: 8 }}>{error}</p>}
        </div>
      </section>

      {/* Stripe Elements */}
      {clientSecret && stripe && (
        <section style={{ marginTop: 24 }}>
          <div style={{ 
            background: '#e7f3ff', 
            padding: '16px', 
            borderRadius: '8px', 
            marginBottom: '16px',
            border: '2px solid #0066cc'
          }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#0066cc' }}>Complete Your Transaction</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>
              Fill out your payment information below and click "Pay Now" to complete your purchase securely.
            </p>
          </div>
          
          <Elements 
            stripe={stripe} 
            options={{ 
              clientSecret, 
              appearance,
              loader: 'always'
            }}
          >
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
      
      {/* Help section */}
      <section style={{ marginTop: '32px', padding: '16px', background: '#f8f9fa', borderRadius: '6px' }}>
        <h4 style={{ margin: '0 0 12px 0' }}>Need Help?</h4>
        <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
          • Your payment is secured by Stripe encryption<br />
          • You'll receive an email confirmation after payment<br />
          • Contact us if you have any questions: support@natureswaysoil.com
        </p>
        {intentId && (
          <p style={{ margin: 0, fontSize: '14px' }}>
            <a href={`/verify-payment?pi=${intentId}`} style={{ color: '#0066cc', textDecoration: 'none' }}>
              → Check your payment status anytime
            </a>
          </p>
        )}
      </section>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps<CheckoutProps> = async () => {
  try {
    const { key } = getPublishableKey()
    return { props: { stripePk: key } }
  } catch {
    // Fallback to client-side fetch
    return { props: { stripePk: null } }
  }
}
