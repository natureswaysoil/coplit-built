
"use client"
import { useState, useEffect } from 'react'

interface EmailCaptureProps {
  headline?: string
  subheadline?: string
  incentive?: string
  buttonText?: string
  showTimer?: boolean
  timerMinutes?: number
  onSuccess?: (email: string) => void
}

export default function AdvancedEmailCapture({
  headline = "Get 10% Off Your First Order",
  subheadline = "Join our community and receive exclusive gardening tips and special offers.",
  incentive = "Plus a Free Soil Health Guide",
  buttonText = "Get My Discount",
  showTimer = true,
  timerMinutes = 15,
  onSuccess
}: EmailCaptureProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState(timerMinutes * 60)

  useEffect(() => {
    if (!showTimer || timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [showTimer, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/email/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email,
          source: 'popup_capture',
          preferences: { wants_discount: true }
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe')
      }

      setSuccess(true)
      onSuccess?.(email)

      // Send welcome email with discount code
      await fetch('/api/email/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center p-8">
        <div className="text-5xl mb-4">✓</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email!</h3>
        <p className="text-gray-700">
          We've sent your discount code to <strong>{email}</strong>
        </p>
        <p className="text-sm text-gray-600 mt-4">
          Don't see it? Check your spam folder.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{headline}</h3>
        <p className="text-gray-700 mb-4">{subheadline}</p>
        
        {incentive && (
          <div className="inline-block bg-yellow-400 text-gray-900 font-bold px-4 py-2 rounded-full mb-4">
            Special Offer: {incentive}
          </div>
        )}

        {showTimer && timeLeft > 0 && (
          <div className="text-red-600 font-semibold text-lg">
            Offer expires in: {formatTime(timeLeft)}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : buttonText}
        </button>

        <p className="text-xs text-gray-500 text-center">
          By subscribing, you agree to receive marketing emails. Unsubscribe anytime.
        </p>
      </form>

      {/* Trust indicators */}
      <div className="mt-6 flex justify-center items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span>Secure</span>
        </div>
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>No spam</span>
        </div>
      </div>
    </div>
  )
}
