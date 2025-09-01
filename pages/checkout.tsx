// pages/checkout.tsx
import { useState } from 'react';

export default function CheckoutPage() {
  const [zip, setZip] = useState('');
  const [subtotal, setSubtotal] = useState(4999); // example: $49.99
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
          amount: subtotal,          // cents
          currency: 'usd',
          zip,
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

      <label style={{ display: 'block', marginTop: 12 }}>
        Subtotal (cents)
        <input
          type="number"
          value={subtotal}
          onChange={e => setSubtotal(parseInt(e.target.value || '0', 10))}
          style={{ display: 'block', width: '100%', padding: 8, marginTop: 6 }}
        />
      </label>

      <label style={{ display: 'block', marginTop: 12 }}>
        ZIP
        <input
          type="text"
          value={zip}
          onChange={e => setZip(e.target.value)}
          style={{ display: 'block', width: '100%', padding: 8, marginTop: 6 }}
        />
      </label>

      <button disabled={loading} onClick={createPI} style={{ marginTop: 16, padding: '10px 16px' }}>
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
