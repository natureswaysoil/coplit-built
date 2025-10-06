
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
                Join 5,000+ Organic Gardeners
              </h2>
              <p className="text-xl text-green-50">
                Get exclusive soil health tips, seasonal guides, and <strong>15% off</strong> your first order
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                <svg className="w-12 h-12 mx-auto mb-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                <h3 className="font-semibold mb-1">Expert Tips</h3>
                <p className="text-sm text-green-100">
                  Weekly soil health insights from our farm
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                <svg className="w-12 h-12 mx-auto mb-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" />
                  <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
                </svg>
                <h3 className="font-semibold mb-1">Exclusive Offers</h3>
                <p className="text-sm text-green-100">
                  Early access to sales & new products
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                <svg className="w-12 h-12 mx-auto mb-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
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
              <p className="text-xs text-green-100 mt-4 text-center flex items-center justify-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                No spam. Unsubscribe anytime. Your email is safe with us.
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
            <h3 className="text-3xl font-bold mb-2">Welcome to the Family!</h3>
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
