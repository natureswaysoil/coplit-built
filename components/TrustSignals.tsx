import React from 'react'

export default function TrustSignals() {
  return (
    <section className="bg-gradient-to-b from-white to-green-50 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Main Trust Indicators - Simplified */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 mx-auto mb-3 text-green-600">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-1">Safe & Natural</h3>
              <p className="text-xs text-gray-600">Eco-Friendly Products</p>
            </div>

            <div className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 mx-auto mb-3 text-green-600">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-1">Money Back</h3>
              <p className="text-xs text-gray-600">30-Day Guarantee</p>
            </div>

            <div className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 mx-auto mb-3 text-green-600">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-1">Free Shipping</h3>
              <p className="text-xs text-gray-600">Orders Over $50</p>
            </div>

            <div className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 mx-auto mb-3 text-green-600">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-1">Expert Support</h3>
              <p className="text-xs text-gray-600">24/7 Available</p>
            </div>
          </div>

          {/* Customer Stats */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
              <div className="border-b md:border-b-0 md:border-r border-gray-200 pb-6 md:pb-0">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">10,000+</div>
                <p className="text-gray-700 text-sm md:text-base font-medium">Happy Gardeners</p>
                <div className="flex justify-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
              </div>

              <div className="border-b md:border-b-0 md:border-r border-gray-200 pb-6 md:pb-0">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">98%</div>
                <p className="text-gray-700 text-sm md:text-base font-medium">Satisfaction Rate</p>
                <p className="text-xs text-gray-500 mt-1">Based on customer reviews</p>
              </div>

              <div>
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">15+ Years</div>
                <p className="text-gray-700 text-sm md:text-base font-medium">Industry Experience</p>
                <p className="text-xs text-gray-500 mt-1">Trusted by professionals</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
