
import React, { useState, useEffect } from 'react'
import { captureEmail } from '../lib/supabase_client'
// DO NOT import resend_client here - it must only run server-side
// We'll call an API route instead

interface AdvancedEmailCaptureProps {
  source: string
  headline?: string
  subheadline?: string
  incentive?: string
  showTimer?: boolean
}

export default function AdvancedEmailCapture({
  source,
  headline = "Join Our Soil Health Community",
  subheadline = "Get expert tips, exclusive offers, and learn the science of organic gardening",
  incentive = "Get 10% off your first order",
  showTimer = false
}: AdvancedEmailCaptureProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes

  useEffect(() => {
    if (showTimer && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft, showTimer])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address')
      }

      // Capture to Supabase
      const captureResult = await captureEmail(email, source, {
        incentive,
        timestamp: new Date().toISOString()
      })

      if (!captureResult.success) {
        throw new Error('Failed to save email')
      }

      // Send welcome email via API route (server-side only)
      try {
        await fetch('/api/email/welcome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        })
      } catch (emailError) {
        // Don't fail the whole flow if email fails
        console.warn('Welcome email failed:', emailError)
      }

      setIsSuccess(true)
      setEmail('')

      // Track conversion
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'email_capture', {
          event_category: 'engagement',
          event_label: source
        })
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 text-center">
        <div className="text-green-700 mb-3">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to the Community!</h3>
        <p className="text-gray-700 mb-4">Check your email for your welcome message and discount code.</p>
        <a
          href="/products"
          className="inline-block bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Start Shopping
        </a>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 md:p-8 shadow-lg">
      <div className="text-center mb-6">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{headline}</h3>
        <p className="text-gray-700 mb-4">{subheadline}</p>
        
        {incentive && (
          <div className="inline-block bg-yellow-400 text-gray-900 font-bold px-4 py-2 rounded-full mb-4">
            🎁 {incentive}
          </div>
        )}

        {showTimer && timeLeft > 0 && (
          <div className="text-red-600 font-semibold text-lg">
            ⏰ Offer expires in: {formatTime(timeLeft)}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isSubmitting ? 'Joining...' : 'Get Started'}
          </button>
        </div>
        
        {error && (
          <p className="text-red-600 text-sm mt-2">{error}</p>
        )}

        <p className="text-xs text-gray-600 mt-3 text-center">
          By subscribing, you agree to receive marketing emails. Unsubscribe anytime.
        </p>
      </form>

      {/* Trust Indicators */}
      <div className="flex justify-center items-center gap-6 mt-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Secure & Private</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          <span>No Spam</span>
        </div>
      </div>
    </div>
  )
}
