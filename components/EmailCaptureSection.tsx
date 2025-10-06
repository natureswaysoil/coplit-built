
import { useState } from 'react';

export default function EmailCaptureSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, source: 'email_capture_section' }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setEmail('');
        
        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      } else {
        setError(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16 px-8">
      <div className="max-w-3xl mx-auto">
        {!submitted ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-3">
                Join 5,000+ Organic Gardeners
              </h2>
              <p className="text-xl text-green-50">
                Get exclusive soil health tips, seasonal guides, and <strong>15% off</strong> your first order
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                <svg className="w-12 h-12 mx-auto mb-2 text-green-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h3 className="font-semibold mb-1">Expert Tips</h3>
                <p className="text-sm text-green-100">
                  Weekly soil health insights from our farm
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                <svg className="w-12 h-12 mx-auto mb-2 text-green-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
                <h3 className="font-semibold mb-1">Exclusive Offers</h3>
                <p className="text-sm text-green-100">
                  Early access to sales & new products
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                <svg className="w-12 h-12 mx-auto mb-2 text-green-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-semibold mb-1">Seasonal Guides</h3>
                <p className="text-sm text-green-100">
                  Know exactly what to do each season
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-300"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
              {error && (
                <p className="text-red-200 text-sm mt-2 text-center">{error}</p>
              )}
              <p className="text-xs text-green-100 mt-3 text-center">
                No spam, unsubscribe anytime. We respect your privacy.
              </p>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <svg className="w-16 h-16 mx-auto mb-4 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-2xl font-bold mb-2">Welcome to the Community!</h3>
            <p className="text-green-100">
              Check your email for your 15% discount code and first soil health tip.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
