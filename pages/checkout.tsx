import { useEffect, useMemo, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import type { Stripe, StripeElements } from '@stripe/stripe-js';
import { useCart } from '../lib/cartContext';
import { NC_COUNTIES, NC_CITY_TO_COUNTY, NC_ZIP_TO_COUNTY } from '../lib/nc_data';

function CheckoutInner({ hasStripe, stripe, elements }: { hasStripe: boolean; stripe?: Stripe | null; elements?: StripeElements | null }) {
  const { items, clearCart } = useCart();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState<'NC' | 'Other'>('NC');
  const [zip, setZip] = useState('');
  const [county, setCounty] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [cardError, setCardError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const subtotal = mounted ? items.reduce((sum, it) => sum + it.price * it.qty, 0) : 0;
  const ncRate = useMemo(() => {
    const env = process.env.NEXT_PUBLIC_NC_TAX_RATE;
    const parsed = env ? Number(env) : NaN;
    return Number.isFinite(parsed) ? parsed : 0.0475; // 4.75% default
  }, []);
  const countyRatesMap = useMemo(() => {
    const raw = process.env.NEXT_PUBLIC_NC_COUNTY_RATES;
    if (!raw) return {} as Record<string, number>;
    try { return JSON.parse(raw) as Record<string, number>; } catch { return {} as Record<string, number>; }
  }, []);
  const norm = (s: string) => s.trim().toLowerCase();
  const countyRate = state === 'NC' && county ? (countyRatesMap[norm(county)] || 0) : 0;
  const tax = mounted && state === 'NC' ? subtotal * (ncRate + countyRate) : 0;
  const total = subtotal + tax;

  // Autofill county based on ZIP code for NC (primary method)
  useEffect(() => {
    if (state !== 'NC') return;
    const zipGuess = NC_ZIP_TO_COUNTY[zip];
    if (zipGuess && !county) {
      setCounty(zipGuess);
      return;
    }
    // Fallback to city-based lookup if ZIP not found
    const cityGuess = NC_CITY_TO_COUNTY[norm(city)];
    if (cityGuess && !county) setCounty(cityGuess);
  }, [zip, city, state]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('Form submitted, items:', items.length);

    if (!items.length) {
      console.log('No items in cart');
      setStatusMsg('Your cart is empty. Please add items before checking out.');
      return;
    }

    // Validate required fields
    if (!name.trim() || !email.trim() || !phone.trim() || !address1.trim() || !city.trim() || !zip.trim()) {
  setStatusMsg('Please fill in all required fields.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatusMsg('Please enter a valid email address.');
      return;
    }

    console.log('Setting submitting to true');
    setSubmitting(true);

    try {
    console.log('Creating order...');

      // Prepare customer data
      const customerData = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address1: address1.trim(),
        address2: address2.trim(),
        city: city.trim(),
        state,
        zip: zip.trim(),
        county: state === 'NC' ? county.trim() : ''
      };

      // Prepare order items with full details
      const orderItems = items.map(it => ({
        sku: it.sku,
        title: it.title,
        size: it.size,
        qty: it.qty,
        price: it.price
      }));

      console.log('Customer data:', customerData);
      console.log('Order items:', orderItems);
      console.log('Order totals - Subtotal:', subtotal, 'Tax:', tax, 'Total:', total);

      let paymentIntentId: string | undefined;

      if (hasStripe) {
        // Ensure Stripe.js has loaded
        if (!stripe || !elements) {
          alert('Payment is still loading. Please wait a moment and try again.');
          return;
        }
        setCardError(null);
        console.log('Requesting PaymentIntent for total:', total);
        const piResp = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: total, currency: 'usd' })
        });
  if (!piResp.ok) {
          const t = await piResp.text();
          throw new Error(`Payment initialization failed: ${t}`);
        }
        const { clientSecret } = await piResp.json();
        if (!clientSecret) throw new Error('Missing client secret from PaymentIntent');

        console.log('Confirming card payment with Stripe...');
        const card = elements.getElement(CardElement);
        if (!card) throw new Error('Card element not found');
        const confirm = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card,
            billing_details: {
              name: customerData.name,
              email: customerData.email,
              phone: customerData.phone,
              address: {
                line1: customerData.address1,
                line2: customerData.address2 || undefined,
                city: customerData.city,
                state: state === 'NC' ? 'NC' : undefined,
                postal_code: customerData.zip,
                country: 'US'
              }
            }
          }
        });
        if (confirm.error) {
          console.error('Stripe confirm error:', confirm.error);
          setCardError(confirm.error.message || 'Payment failed');
          throw new Error(confirm.error.message || 'Payment failed');
        }
        const intent = confirm.paymentIntent;
        if (!intent) throw new Error('No payment intent returned');
        if (intent.status !== 'succeeded') {
          throw new Error(`Unexpected payment status: ${intent.status}`);
        }
        paymentIntentId = intent.id;
        console.log('Payment succeeded, intent:', paymentIntentId);
      } else {
        console.log('Stripe not configured; proceeding without online payment.');
      }

      console.log('Creating order via API...');
      // Create order via API (include paymentIntentId when available)
      const orderCreateResp = await fetch('/api/order-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: customerData,
          items: orderItems,
          subtotal,
          tax,
          total,
          paymentIntentId,
        })
      });

      console.log('Order create response status:', orderCreateResp.status);

      if (!orderCreateResp.ok) {
        const errorText = await orderCreateResp.text();
        console.error('Order create failed:', errorText);
        throw new Error(`Failed to create order: ${errorText}`);
      }

      const responseData = await orderCreateResp.json();
      const { orderId: orderIdLocal, message } = responseData;
      console.log('Order created with ID:', orderIdLocal, message);

  // Send confirmation email
      console.log('Sending confirmation email...');
      try {
        const emailResp = await fetch('/api/order-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: orderIdLocal,
            email: customerData.email,
            name: customerData.name,
            items: orderItems,
            subtotal,
            tax,
            total,
            shipping: customerData
          })
        });

        if (!emailResp.ok) {
          console.warn('Email sending failed, but order was created');
        } else {
    console.log('Confirmation email sent successfully');
        }
      } catch (emailError) {
        console.warn('Email sending failed:', emailError);
      }

  console.log('Clearing cart and setting order ID');
      clearCart();
      setOrderId(orderIdLocal);
      console.log('Order process completed successfully');
  setStatusMsg(`Order placed successfully! Your order ID is: ${orderIdLocal}`);

    } catch (err) {
      console.error('Order submission error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
  setStatusMsg(`Failed to place order: ${errorMessage}`);
    } finally {
      console.log('Setting submitting to false');
      setSubmitting(false);
    }
  }

  return (
    <main style={{ maxWidth: 700, margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Checkout</h1>
      {!mounted ? (
        <p suppressHydrationWarning>Loading…</p>
      ) : (!items.length && !orderId) ? (
        <p>Your cart is empty.</p>
      ) : null}
      {orderId ? (
        <p>Thank you! Your order ID is <b>{orderId}</b>.</p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
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
          {mounted && (
            <div>
              <h3>Items</h3>
              <ul>
                {items.map(it => (
                  <li key={it.sku}>{it.title} – {it.size} – {it.qty} × ${it.price.toFixed(2)} (SKU: {it.sku})
                  </li>
                ))}
              </ul>
              <div style={{ textAlign: 'right' }}>
                <div>Subtotal: <span suppressHydrationWarning>${subtotal.toFixed(2)}</span></div>
                <div>Sales Tax{state==='NC' ? ` (${( (ncRate + countyRate) * 100).toFixed(2)}%)` : ''}: <span suppressHydrationWarning>${tax.toFixed(2)}</span></div>
                <div style={{ fontWeight: 'bold' }}>Total: <span suppressHydrationWarning>${total.toFixed(2)}</span></div>
              </div>
            </div>
          )}
          {/* Payment */}
          {hasStripe && (
            <div>
              <h3>Payment</h3>
              <div style={{ padding: '12px', border: '1px solid #ddd', borderRadius: 6 }}>
                <CardElement options={{ hidePostalCode: true }} />
              </div>
              <div style={{ fontSize: 12, color: '#555', marginTop: 6 }}>Use Stripe test card 4242 4242 4242 4242, any future expiry, any CVC, any ZIP.</div>
              {cardError && <div style={{ color: 'crimson', fontSize: 13 }}>{cardError}</div>}
            </div>
          )}
          <button disabled={submitting} style={{ background: '#174F2E', color: 'white', border: 'none', borderRadius: 6, padding: '0.6rem 1.2rem', fontWeight: 'bold', cursor: 'pointer' }}>
            {submitting ? (hasStripe ? 'Processing Payment…' : 'Placing Order…') : (hasStripe ? 'Pay & Place Order' : 'Place Order')}
          </button>
          {statusMsg && (
            <div style={{ marginTop: 8, color: statusMsg.startsWith('Failed') ? 'crimson' : '#174F2E' }}>
              {statusMsg}
            </div>
          )}
        </form>
      )}
    </main>
  );
}

export default function Checkout() {
  const [pub, setPub] = useState<string | null>(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || null);
  useEffect(() => {
    if (!pub) {
      fetch('/api/stripe-config').then(r => r.json()).then((d) => {
        if (d?.publishableKey) setPub(d.publishableKey)
      }).catch(() => {})
    }
  }, [pub])
  const stripePromise = useMemo(() => (pub ? loadStripe(pub) : null), [pub]);
  function StripeCheckoutWrapper() {
    const stripe = useStripe();
    const elements = useElements();
    return <CheckoutInner hasStripe={true} stripe={stripe} elements={elements} />
  }
  return stripePromise ? (
    <Elements stripe={stripePromise}>
      <StripeCheckoutWrapper />
    </Elements>
  ) : (
    <CheckoutInner hasStripe={false} />
  );
}
