import React, { useRef, useEffect, useState } from 'react'

interface HeroVideoSectionProps {
  videoUrl?: string
  posterUrl?: string
}

export default function HeroVideoSection({ 
  videoUrl = 'https://d3uryq9bhgb5qr.cloudfront.net/Pictory-API-Self-Service-USD-Monthly/6brpmrpiu3k3kud3b4eb7nc1rs/a2a35808-5743-40eb-8023-22b2c6b6cf2d/VIDEO/soil_symbiosis_hero_video.mp4',
  posterUrl = '/videos/hero-poster.jpg'
}: HeroVideoSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMuted, setIsMuted] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Set all required attributes for autoplay
    video.muted = true
    video.playsInline = true
    video.setAttribute('webkit-playsinline', '')
    
    // Handle video load
    const handleLoadedData = () => {
      setIsLoaded(true)
      setHasError(false)
      
      // Attempt to play after video is loaded
      const playPromise = video.play()
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Video autoplay started successfully')
          })
          .catch((error) => {
            console.log('Autoplay prevented, user interaction required:', error)
            // Video will show with controls for user to click play
          })
      }
    }

    const handleError = (e: Event) => {
      console.error('Video loading error:', e)
      setHasError(true)
      setIsLoaded(true)
    }

    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('error', handleError)
    
    // Force load the video
    video.load()

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('error', handleError)
    }
  }, [])

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(videoRef.current.muted)
    }
  }

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
              {hasError ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
                  <div className="text-center p-8">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-lg">Video temporarily unavailable</p>
                    <p className="text-sm text-gray-400 mt-2">Please check back soon</p>
                  </div>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  src={videoUrl}
                  poster={posterUrl}
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover"
                  style={{ backgroundColor: '#000' }}
                >
                  Your browser does not support the video tag.
                </video>
              )}
              
              {/* Mute/Unmute Button */}
              {isLoaded && !hasError && (
                <button
                  onClick={toggleMute}
                  className="absolute bottom-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all z-10"
                  aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                >
                  {isMuted ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                    </svg>
                  )}
                </button>
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
