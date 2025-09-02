// pages/checkout.tsx
import { useState, useEffect } from 'react';
import { useCart } from '../lib/cartContext';

export default function CheckoutPage() {
  const { items } = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const subtotal = mounted ? items.reduce((sum, it) => sum + it.price * it.qty, 0) : 0;
  const [zip, setZip] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function createPI() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const resp = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(subtotal * 100),          // cents
          currency: 'usd',
          zip,
          city,
          state: process.env.NEXT_PUBLIC_TAX_STATE || 'NC',
          shipping: 0,               // plug in your shipping logic if any
          metadata: { orderSource: 'web' },
        }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || 'Failed to create PI');
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 520, margin: '2rem auto', fontFamily: 'system-ui' }}>
      <h1>Checkout</h1>

      <div style={{ marginTop: 12 }}>
        Subtotal: <span suppressHydrationWarning>${subtotal.toFixed(2)}</span>
      </div>
      {mounted && items.length === 0 && (
        <p style={{ marginTop: 8 }}>Your cart is empty.</p>
      )}

      <label style={{ display: 'block', marginTop: 12 }}>
        ZIP
        <input
          type="text"
          value={zip}
          onChange={e => setZip(e.target.value)}
          style={{ display: 'block', width: '100%', padding: 8, marginTop: 6 }}
        />
      </label>

      <label style={{ display: 'block', marginTop: 12 }}>
        City
        <input
          type="text"
          value={city}
          onChange={e => setCity(e.target.value)}
          placeholder="e.g., Snow Hill"
          style={{ display: 'block', width: '100%', padding: 8, marginTop: 6 }}
        />
      </label>

      <button disabled={loading || subtotal <= 0} onClick={createPI} style={{ marginTop: 16, padding: '10px 16px' }}>
        {loading ? 'Creating…' : 'Create Payment Intent'}
      </button>

      {error && (
        <p style={{ color: 'crimson', marginTop: 16 }}>
          {error}
        </p>
      )}

      {result && (
        <div style={{ marginTop: 20 }}>
          <pre style={{ background: '#f6f8fa', padding: 12, borderRadius: 8 }}>
            {JSON.stringify(result, null, 2)}
          </pre>
          <p>
            <strong>Client Secret:</strong> {result.clientSecret?.slice(0, 24)}…
          </p>
          <p>
            <strong>Breakdown:</strong>{' '}
            ${((result.breakdown.subtotal + result.breakdown.tax + result.breakdown.shipping) / 100).toFixed(2)}
            {' '} (subtotal ${ (result.breakdown.subtotal/100).toFixed(2) }, tax ${ (result.breakdown.tax/100).toFixed(2) })
          </p>
        </div>
      )}
    </main>
  );
}
