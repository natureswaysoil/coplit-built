'use client'
import { useState } from 'react'

export default function EmailCouponCapture() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return

    setLoading(true)
    
    try {
      // Apply coupon automatically
      if (typeof window !== 'undefined') {
        localStorage.setItem('welcomeCoupon', 'WELCOME15')
        localStorage.setItem('welcomeEmail', email)
      }

      // Optional: Save to database/mailing list
      // await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email }) })
      
      setSubmitted(true)
    } catch (error) {
      console.error('Error applying coupon:', error)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border-2 border-green-500 rounded-xl p-8 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome! Your 15% OFF Coupon is Ready
        </h3>
        <p className="text-gray-700 mb-4">
          Coupon code <span className="font-bold text-green-600 text-xl">WELCOME15</span> has been automatically applied to your cart!
        </p>
        <p className="text-sm text-gray-600">
          Check your email for exclusive offers and growing tips
        </p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-white border-2 border-green-200 rounded-xl p-8 text-center">
      <div className="mb-4">
        <span className="inline-block bg-yellow-400 text-gray-900 font-bold px-6 py-2 rounded-full text-sm animate-pulse">
          LIMITED TIME OFFER
        </span>
      </div>
      
      <h3 className="text-3xl font-bold text-gray-900 mb-2">
        Get 15% OFF Your First Order!
      </h3>
      <p className="text-lg text-gray-600 mb-6">
        Enter your email and we'll automatically apply your discount
      </p>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="flex gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="flex-1 px-6 py-4 rounded-lg border-2 border-gray-300 focus:border-green-500 focus:outline-none text-lg"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-lg text-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Applying...' : 'Get 15% OFF'}
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-3">
          By submitting, you agree to receive marketing emails. Unsubscribe anytime.
        </p>
      </form>

      <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
          <span>No spam, ever</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
          <span>Unsubscribe anytime</span>
        </div>
      </div>
    </div>
  )
}
