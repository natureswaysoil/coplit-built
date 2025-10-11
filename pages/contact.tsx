import { useEffect, useState } from 'react';
import Head from 'next/head';

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
    <>
      <Head>
        <title>Contact Us | Nature's Way Soil</title>
        <meta name="description" content="Get in touch with Nature's Way Soil for questions about our organic soil products, support, or sales inquiries." />
      </Head>
      
      <main className="p-xl">
        <div className="container" style={{maxWidth: '700px'}}>
          <div className="text-center mb-xl">
            <h1>Contact Us</h1>
            <p style={{fontSize: '1.1rem', color: 'var(--neutral-600)'}}>
              Have questions about our products or need support? We're here to help!
            </p>
          </div>

          <div className="card">
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 'var(--space-lg)' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontWeight: '600',
                  marginBottom: 'var(--space-xs)',
                  color: 'var(--neutral-700)'
                }}>
                  Send to
                </label>
                <select 
                  value={department} 
                  onChange={(e) => setDepartment(e.target.value as any)} 
                  style={{
                    width: '100%',
                    padding: 'var(--space-sm) var(--space-md)',
                    border: '1px solid var(--neutral-300)',
                    borderRadius: '0.5rem',
                    backgroundColor: 'white',
                    fontSize: '1rem'
                  }}
                >
                  <option value="support">Support Team</option>
                  <option value="sales">Sales Team</option>
                  <option value="james">Attention: James</option>
                </select>
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontWeight: '600',
                  marginBottom: 'var(--space-xs)',
                  color: 'var(--neutral-700)'
                }}>
                  Name
                </label>
                <input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  style={{
                    width: '100%',
                    padding: 'var(--space-sm) var(--space-md)',
                    border: '1px solid var(--neutral-300)',
                    borderRadius: '0.5rem',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontWeight: '600',
                  marginBottom: 'var(--space-xs)',
                  color: 'var(--neutral-700)'
                }}>
                  Email
                </label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  style={{
                    width: '100%',
                    padding: 'var(--space-sm) var(--space-md)',
                    border: '1px solid var(--neutral-300)',
                    borderRadius: '0.5rem',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontWeight: '600',
                  marginBottom: 'var(--space-xs)',
                  color: 'var(--neutral-700)'
                }}>
                  Message
                </label>
                <textarea 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  required 
                  rows={5} 
                  style={{
                    width: '100%',
                    padding: 'var(--space-sm) var(--space-md)',
                    border: '1px solid var(--neutral-300)',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>
              
              <button 
                disabled={status==='sending'} 
                className={status==='sending' ? 'btn btn-secondary' : 'btn btn-primary'}
                style={{justifySelf: 'start'}}
              >
                {status==='sending' ? 'Sending...' : 'Send Message'}
              </button>
              
              {status==='sent' && (
                <div style={{
                  padding: 'var(--space-md)',
                  backgroundColor: '#dcfce7',
                  border: '1px solid #bbf7d0',
                  borderRadius: '0.5rem',
                  color: '#166534'
                }}>
                  Thanks! We'll get back to you soon.
                </div>
              )}
              
              {status==='error' && (
                <div style={{
                  padding: 'var(--space-md)',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '0.5rem',
                  color: '#dc2626'
                }}>
                  Error: {error}
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </>
  );
}