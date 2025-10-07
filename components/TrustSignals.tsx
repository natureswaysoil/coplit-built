import React from 'react'

export default function TrustSignals() {
  return (
    <section className="bg-gradient-to-b from-white to-green-50 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Main Trust Indicators - Clean & Simple */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-2">🛡️</div>
              <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-1">Safe & Natural</h3>
              <p className="text-xs text-gray-600">Eco-Friendly Products</p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-2">💰</div>
              <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-1">Money Back</h3>
              <p className="text-xs text-gray-600">30-Day Guarantee</p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-2">🚚</div>
              <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-1">Free Shipping</h3>
              <p className="text-xs text-gray-600">Orders Over $50</p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-2">💬</div>
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
