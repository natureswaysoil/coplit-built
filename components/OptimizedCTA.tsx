import React from 'react'
import Link from 'next/link'

interface CTAProps {
  title?: string
  subtitle?: string
  primaryButtonText?: string
  primaryButtonLink?: string
  secondaryButtonText?: string
  secondaryButtonLink?: string
  showUrgency?: boolean
  backgroundColor?: string
}

export default function OptimizedCTA({
  title = "Ready to Transform Your Soil?",
  subtitle = "Join thousands of gardeners who've made the switch to organic. Your plants will thank you.",
  primaryButtonText = "Shop Now",
  primaryButtonLink = "/products",
  secondaryButtonText = "Learn More",
  secondaryButtonLink = "/blog",
  showUrgency = true,
  backgroundColor = "bg-gradient-to-r from-green-700 to-green-900"
}: CTAProps) {
  return (
    <section className={`${backgroundColor} py-16 md:py-20`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Urgency Badge */}
          {showUrgency && (
            <div className="inline-block bg-yellow-400 text-gray-900 font-bold px-4 py-2 rounded-full mb-6 animate-pulse">
              Limited Time: Free Shipping on Orders Over $50
            </div>
          )}

          {/* Main Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {title}
          </h2>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            {subtitle}
          </p>

          {/* Buttons - NO ARROW */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href={primaryButtonLink}
              className="inline-block bg-white text-green-900 font-bold px-8 py-4 rounded-lg text-lg hover:bg-green-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 w-full sm:w-auto"
            >
              {primaryButtonText}
            </Link>

            <Link
              href={secondaryButtonLink}
              className="inline-block bg-transparent border-2 border-white text-white font-semibold px-8 py-4 rounded-lg text-lg hover:bg-white hover:text-green-900 transition-all duration-300 w-full sm:w-auto"
            >
              {secondaryButtonText}
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-10 flex flex-wrap justify-center items-center gap-6 text-green-100">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">30-Day Money Back</span>
            </div>

            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">Free Shipping Over $50</span>
            </div>

            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">Expert Support 24/7</span>
            </div>
          </div>

          {/* Customer Count */}
          <div className="mt-8 text-green-100">
            <p className="text-sm">
              Join <span className="font-bold text-white">10,000+</span> happy gardeners
            </p>
            <div className="flex justify-center mt-2">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
              <span className="ml-2 text-sm">4.9/5 Average Rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
