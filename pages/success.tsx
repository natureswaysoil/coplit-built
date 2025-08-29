// pages/success.tsx
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useCart } from '../lib/cartContext'

type Summary = {
  amount?: number
  currency?: string
  email?: string
  payment_status?: string
} | null

export default function Success() {
  const router = useRouter()
  const { clearCart } = useCart()

  const [status, setStatus] = useState<'working' | 'done' | 'error'>('working')
  const [summary, setSummary] = useState<Summary>(null)

  useEffect(() => {
    const run = async () => {
      try {
        // Clear client cart (fulfillment should happen via webhook)
        clearCart?.()

        // If coming from Stripe Checkout, we may have a session_id
        const sessionId = router.query.session_id as string | undefined
        if (sessionId) {
          try {
            const r = await fetch(`/api/stripe/session?session_id=${encodeURIComponent(sessionId)}`)
            if (r.ok) {
              const s = await r.json()
              setSummary({
                amount: typeof s?.amount_total === 'number' ? s.amount_total / 100 : undefined,
                currency: s?.currency ? String(s.currency).toUpperCase() : undefined,
                email: s?.customer_details?.email,
                payment_status: s?.payment_status || s?.status,
              })
            }
          } catch (e) {
            // non-fatal; we’ll still show the thank-you
            console.warn('Could not fetch session details:', e)
          }
        }

        setStatus('done')
      } catch (e) {
        console.error(e)
        setStatus('error')
      }
    }
    if (router.isReady) run()
  }, [router.isReady, clearCart, router.query.session_id])

  if (status === 'working') {
    return (
      <main style={{ padding: 24 }}>
        <h1>Processing your order…</h1>
        <p>Hang tight while we wrap things up.</p>
      </main>
    )
  }

  if (status === 'error') {
    return (
      <main style={{ padding: 24 }}>
        <h1>Payment received.</h1>
        <p>We couldn’t display the order summary automatically. If you don’t see a confirmation email shortly, contact support.</p>
      </main>
    )
  }

  return (
    <main style={{ padding: 24, maxWidth: 720, margin: '0 auto' }}>
      <h1>Thank you! 🎉</h1>
      <p>Your payment was successful and your order is confirmed.</p>

      {summary && (
        <div style={{ marginTop: 16, border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
          <div><b>Status:</b> {summary.payment_status ?? 'paid'}</div>
          {summary.amount != null && (
            <div><b>Charged:</b> {summary.currency ?? 'USD'} ${summary.amount.toFixed(2)}</div>
          )}
          {summary.email && <div><b>Receipt sent to:</b> {summary.email}</div>}
        </div>
      )}

      <p style={{ marginTop: 16 }}>
        A confirmation email will arrive shortly. If you need help, email <a href="mailto:support@natureswaysoil.com">support@natureswaysoil.com</a>.
      </p>

      <a href="/products" style={{ display: 'inline-block', marginTop: 16, padding: '10px 16px', background: '#174F2E', color: 'white', borderRadius: 6, fontWeight: 700 }}>
        Continue Shopping
      </a>
    </main>
  )
}
