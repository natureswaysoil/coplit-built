import { useEffect, useMemo, useState } from 'react';
import { useCart } from '../lib/cartContext';
import { supabase } from '../lib/supabaseClient';
import { NC_COUNTIES, NC_CITY_TO_COUNTY } from '../lib/nc_data';

export default function Checkout() {
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
  const [orderId, setOrderId] = useState<string | null>(null);
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

  // Autofill county based on city for NC
  useEffect(() => {
    if (state !== 'NC') return;
    const guess = NC_CITY_TO_COUNTY[norm(city)];
    if (guess && !county) setCounty(guess);
  }, [city, state]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
  if (!items.length) return;
    setSubmitting(true);
    try {
      // ensure customer exists or create
      let customerId: string | null = null;
  const { data: existing, error: selErr } = await supabase
        .from('customers')
        .select('id')
        .eq('email', email)
        .maybeSingle();
      if (selErr) throw selErr;
      if (existing) {
        customerId = existing.id;
      } else {
        const { data: created, error: insErr } = await supabase
          .from('customers')
          .insert({ name, email })
          .select('id')
          .single();
        if (insErr) throw insErr;
        customerId = created.id;
      }

      // create order and order_items
      // Create order server-side (service role) to bypass RLS
      const orderCreateResp = await fetch('/api/order-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          subtotal,
          tax,
          total,
          items: items.map(it => ({ sku: it.sku, qty: it.qty, price: it.price })),
          shipping: { address1, address2, city, state, zip, county, phone }
        })
      })
      if (!orderCreateResp.ok) throw new Error('Failed to create order');
      const { orderId: orderIdLocal } = await orderCreateResp.json();

      const itemsPayload = items.map(it => ({
        order_id: orderIdLocal!,
        sku: it.sku,
        qty: it.qty,
        price: it.price,
      }));
      const { error: itemsErr } = await supabase
        .from('order_items')
        .insert(itemsPayload);
      if (itemsErr) throw itemsErr;

      // send order confirmation email (best-effort; ignore errors)
      try {
        await fetch('/api/order-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: orderIdLocal,
            email,
            name,
            items: items.map(it => ({ title: it.title, size: it.size, qty: it.qty, price: it.price, sku: it.sku })),
      subtotal,
      tax,
      total,
            shipping: {
              address1, address2, city, state, zip, county, phone
            }
          })
        })
      } catch {}

      clearCart();
      setOrderId(orderIdLocal);
    } catch (err) {
      console.error(err);
      alert('Failed to place order. Please try again.');
    } finally {
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
              <input list="nc-counties" value={county} onChange={(e) => setCounty(e.target.value)} style={{ width: '100%', padding: 8 }} placeholder="e.g., Wake" disabled={state !== 'NC'} />
              <datalist id="nc-counties">
                {NC_COUNTIES.map(c => (<option key={c} value={c} />))}
              </datalist>
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#555' }}>
            If an NC county is provided and configured, county tax will be added on top of the state rate.
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
          <button disabled={submitting || !items.length} style={{ background: '#174F2E', color: 'white', border: 'none', borderRadius: 6, padding: '0.6rem 1.2rem', fontWeight: 'bold', cursor: 'pointer' }}>
            {submitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>
      )}
    </main>
  );
}
