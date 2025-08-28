import { useEffect } from 'react'

export default function Sales() {
  useEffect(() => {
    // Redirect to contact with sales department selected
    if (typeof window !== 'undefined') {
      window.location.href = '/contact?dept=sales'
    }
  }, [])
  return (
    <main style={{ padding: '2rem' }}>
      <p>Redirecting to Sales…</p>
    </main>
  )
}
