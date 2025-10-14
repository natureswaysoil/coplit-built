
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

          {/* Buttons */}
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
          <div className="mt-10 grid gap-3 text-green-100 text-sm md:grid-cols-3">
            <p className="font-semibold">30-Day Money Back Guarantee</p>
            <p className="font-semibold">Free Shipping on Orders Over $50</p>
            <p className="font-semibold">Expert Support Available 24/7</p>
          </div>

          <p className="mt-8 text-sm text-green-100">
            Join <span className="font-bold text-white">10,000+</span> happy gardeners — average rating 4.9/5
          </p>
        </div>
      </div>
    </section>
  )
}
