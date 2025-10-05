
import React, { useState } from 'react'

interface HeroVideoSectionProps {
  videoUrl?: string
  posterUrl?: string
}

export default function HeroVideoSection({ 
  videoUrl = '/videos/hero-video.mp4',
  posterUrl = '/videos/hero-poster.jpg'
}: HeroVideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <section className="relative w-full bg-gradient-to-b from-green-50 to-white py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Headline */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-900 mb-4">
              Discover the Hidden World Beneath Your Soil
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
              Learn how synthetic fertilizers disrupt nature's perfect system and why organic matters
            </p>
          </div>

          {/* Video Container */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black">
            <div className="aspect-video relative">
              {!isPlaying ? (
                <>
                  <img
                    src={posterUrl}
                    alt="Soil symbiosis video thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-all group"
                    aria-label="Play video"
                  >
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <svg className="w-10 h-10 md:w-12 md:h-12 text-green-700 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </button>
                </>
              ) : (
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full"
                  poster={posterUrl}
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>

          {/* Key Points */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-600">
              <div className="text-green-700 mb-3">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">90% of Plants</h3>
              <p className="text-gray-600">Rely on mycorrhizal fungi for optimal nutrient uptake and growth</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-600">
              <div className="text-green-700 mb-3">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">84% Reduction</h3>
              <p className="text-gray-600">In beneficial soil microbes from synthetic fertilizer overuse</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-600">
              <div className="text-green-700 mb-3">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nature's Way</h3>
              <p className="text-gray-600">Organic fertilizers that work with soil biology, not against it</p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <a
              href="/products"
              className="inline-block bg-green-700 hover:bg-green-800 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Shop Organic Fertilizers
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
