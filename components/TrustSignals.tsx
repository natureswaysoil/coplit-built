
import React from 'react'

export default function TrustSignals() {
  return (
    <section className="bg-green-50 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Main Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-12">
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-3 shadow-md">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 text-sm md:text-base">100% Organic</h3>
              <p className="text-xs md:text-sm text-gray-600 mt-1">Certified Natural</p>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-3 shadow-md">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 text-sm md:text-base">Money Back</h3>
              <p className="text-xs md:text-sm text-gray-600 mt-1">30-Day Guarantee</p>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-3 shadow-md">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 text-sm md:text-base">Free Shipping</h3>
              <p className="text-xs md:text-sm text-gray-600 mt-1">Orders Over $50</p>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-3 shadow-md">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 text-sm md:text-base">Expert Support</h3>
              <p className="text-xs md:text-sm text-gray-600 mt-1">24/7 Chat Available</p>
            </div>
          </div>

          {/* Customer Stats */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
              <div className="border-b md:border-b-0 md:border-r border-gray-200 pb-6 md:pb-0">
                <div className="text-3xl md:text-4xl font-bold text-green-700 mb-2">10,000+</div>
                <p className="text-gray-600 text-sm md:text-base">Happy Gardeners</p>
                <div className="flex justify-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
              </div>

              <div className="border-b md:border-b-0 md:border-r border-gray-200 pb-6 md:pb-0">
                <div className="text-3xl md:text-4xl font-bold text-green-700 mb-2">98%</div>
                <p className="text-gray-600 text-sm md:text-base">Satisfaction Rate</p>
                <p className="text-xs text-gray-500 mt-1">Based on customer reviews</p>
              </div>

              <div>
                <div className="text-3xl md:text-4xl font-bold text-green-700 mb-2">15+ Years</div>
                <p className="text-gray-600 text-sm md:text-base">Industry Experience</p>
                <p className="text-xs text-gray-500 mt-1">Trusted by professionals</p>
              </div>
            </div>
          </div>

          {/* Certifications & Badges */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 mb-4">Certified & Trusted By:</p>
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
              <div className="bg-white px-4 py-2 rounded shadow-sm">
                <span className="text-xs md:text-sm font-semibold text-gray-700">USDA Organic</span>
              </div>
              <div className="bg-white px-4 py-2 rounded shadow-sm">
                <span className="text-xs md:text-sm font-semibold text-gray-700">Non-GMO</span>
              </div>
              <div className="bg-white px-4 py-2 rounded shadow-sm">
                <span className="text-xs md:text-sm font-semibold text-gray-700">Safe for Pollinators</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
