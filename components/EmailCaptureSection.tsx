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
        
        // Reset after 5 seconds
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
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-3">
                🌱 Join 5,000+ Organic Gardeners
              </h2>
              <p className="text-xl text-green-50">
                Get exclusive soil health tips, seasonal guides, and <strong>15% off</strong> your first order
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">📚</div>
                <h3 className="font-semibold mb-1">Expert Tips</h3>
                <p className="text-sm text-green-100">
                  Weekly soil health insights from our farm
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">🎁</div>
                <h3 className="font-semibold mb-1">Exclusive Offers</h3>
                <p className="text-sm text-green-100">
                  Early access to sales & new products
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">🌿</div>
                <h3 className="font-semibold mb-1">Seasonal Guides</h3>
                <p className="text-sm text-green-100">
                  Know exactly what to do each season
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              {error && (
                <div className="mb-4 bg-red-500/20 border border-red-300 text-white px-4 py-3 rounded-lg text-center">
                  {error}
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  disabled={isLoading}
                  className="flex-1 px-5 py-4 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-white/30 disabled:bg-gray-200"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-white text-green-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-50 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
              <p className="text-xs text-green-100 mt-4 text-center">
                🔒 No spam. Unsubscribe anytime. Your email is safe with us.
              </p>
            </form>

            {/* Social Proof */}
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center gap-2 text-green-100">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-green-400 border-2 border-white flex items-center justify-center text-xs font-bold text-green-800"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span className="text-sm">
                  Join Sarah, John, Maria, and 4,997 others
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="inline-block bg-white/20 backdrop-blur rounded-full p-6 mb-4">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold mb-2">Welcome to the Family! 🎉</h3>
            <p className="text-xl text-green-100 mb-4">
              Check your email for your <strong>15% discount code</strong>
            </p>
            <p className="text-green-100">
              You'll also receive our comprehensive Soil Health Starter Guide within the next few minutes.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
