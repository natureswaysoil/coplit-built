import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function VerifyPayment() {
  const router = useRouter()
  const { pi } = router.query
  const [paymentStatus, setPaymentStatus] = useState<string>('Loading...')
  const [paymentDetails, setPaymentDetails] = useState<any>(null)

  useEffect(() => {
    if (!router.isReady || !pi) return

    // Fetch payment status from our API
    fetch(`/api/verify-payment?pi=${pi}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setPaymentStatus('Error checking payment')
        } else {
          setPaymentStatus(data.status || 'Unknown')
          setPaymentDetails(data.details)
        }
      })
      .catch(() => {
        setPaymentStatus('Error checking payment')
      })
  }, [pi, router.isReady])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'succeeded': return '#28a745'
      case 'processing': return '#ffc107'
      case 'requires_payment_method': return '#dc3545'
      case 'requires_confirmation': return '#17a2b8'
      default: return '#6c757d'
    }
  }

  const getStatusMessage = (status: string) => {
    switch (status.toLowerCase()) {
      case 'succeeded': return 'Payment completed successfully!'
      case 'processing': return 'Payment is being processed...'
      case 'requires_payment_method': return 'Payment method required'
      case 'requires_confirmation': return 'Payment requires confirmation'
      case 'canceled': return 'Payment was canceled'
      default: return status
    }
  }

  if (!router.isReady) {
    return (
      <main style={{ maxWidth: 600, margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui' }}>
        <h1>Payment Verification</h1>
        <div style={{
          background: '#f8f9fa',
          border: '2px solid #6c757d',
          borderRadius: '8px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#6c757d', margin: '0 0 16px 0' }}>
            Loading...
          </h2>
          <p>Preparing payment verification...</p>
        </div>
      </main>
    )
  }

  if (!pi) {
    return (
      <main style={{ maxWidth: 600, margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui' }}>
        <h1>Payment Verification</h1>
        <div style={{
          background: '#f8f9fa',
          border: '2px solid #dc3545',
          borderRadius: '8px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#dc3545', margin: '0 0 16px 0' }}>
            Payment ID Missing
          </h2>
          <p>No payment ID was provided. Please check your payment confirmation email or contact support.</p>
        </div>
      </main>
    )
  }

  return (
    <main style={{ maxWidth: 600, margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui' }}>
      <h1>Payment Verification</h1>
      
      <div style={{
        background: '#f8f9fa',
        border: `2px solid ${getStatusColor(paymentStatus)}`,
        borderRadius: '8px',
        padding: '24px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: getStatusColor(paymentStatus), margin: '0 0 16px 0' }}>
          {getStatusMessage(paymentStatus)}
        </h2>
        
        {pi && (
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
            Payment ID: {pi}
          </div>
        )}

        {paymentDetails && (
          <div style={{ textAlign: 'left', marginTop: '20px' }}>
            <h3>Payment Details:</h3>
            <ul style={{ lineHeight: '1.6' }}>
              {paymentDetails.amount && (
                <li>Amount: ${(paymentDetails.amount / 100).toFixed(2)}</li>
              )}
              {paymentDetails.currency && (
                <li>Currency: {paymentDetails.currency.toUpperCase()}</li>
              )}
              {paymentDetails.receipt_email && (
                <li>Receipt sent to: {paymentDetails.receipt_email}</li>
              )}
              {paymentDetails.created && (
                <li>Created: {new Date(paymentDetails.created * 1000).toLocaleString()}</li>
              )}
            </ul>
          </div>
        )}
      </div>

      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <button 
          onClick={() => router.push('/')}
          style={{
            padding: '12px 24px',
            background: '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginRight: '12px'
          }}
        >
          Back to Store
        </button>
        
        <button 
          onClick={() => router.push('/contact')}
          style={{
            padding: '12px 24px',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Contact Support
        </button>
      </div>

      <div style={{ 
        marginTop: '32px', 
        padding: '16px', 
        background: '#e9ecef', 
        borderRadius: '6px',
        fontSize: '14px'
      }}>
        <strong>Need help?</strong><br />
        If you have questions about your payment, please contact our support team with your payment ID above.
      </div>
    </main>
  )
}
