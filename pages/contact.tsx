import { useEffect, useState } from 'react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [department, setDepartment] = useState<'support'|'sales'|'james'>('support');
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search)
    const dept = params.get('dept')
    if (dept === 'sales' || dept === 'james' || dept === 'support') {
      setDepartment(dept)
    }
  }, [])
  const [status, setStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setError(null);
    try {
      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, department })
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to send');
      }
      setStatus('sent');
  setName(''); setEmail(''); setMessage(''); setDepartment('support');
    } catch (err: any) {
      setStatus('error');
      setError(err?.message || 'Failed to send');
    }
  }

  return (
    <main style={{ maxWidth: 700, margin: '0 auto', padding: '2rem' }}>
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
        <div>
          <label>Send to</label>
          <select value={department} onChange={(e) => setDepartment(e.target.value as any)} style={{ width: '100%', padding: 8 }}>
            <option value="support">Support</option>
            <option value="sales">Sales</option>
            <option value="james">Attention: James</option>
          </select>
        </div>
        <div>
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: 8 }} />
        </div>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: 8 }} />
        </div>
        <div>
          <label>Message</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={5} style={{ width: '100%', padding: 8 }} />
        </div>
        <button disabled={status==='sending'} style={{ background: '#174F2E', color: 'white', border: 'none', borderRadius: 6, padding: '0.6rem 1.2rem', fontWeight: 'bold', cursor: 'pointer' }}>
          {status==='sending' ? 'Sending…' : 'Send'}
        </button>
        {status==='sent' && <p style={{ color: 'green' }}>Thanks! We’ll get back to you soon.</p>}
        {status==='error' && <p style={{ color: 'crimson' }}>Error: {error}</p>}
      </form>
    </main>
  );
}