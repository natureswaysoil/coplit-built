
import React, { useState } from 'react'

interface ProductVideoPlayerProps {
  videoUrl: string
  productName: string
  posterUrl?: string
}

export default function ProductVideoPlayer({ 
  videoUrl, 
  productName,
  posterUrl 
}: ProductVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="w-full mb-6">
      <div className="relative rounded-lg overflow-hidden shadow-lg bg-black">
        <div className="aspect-video relative">
          {!isPlaying ? (
            <>
              {posterUrl && (
                <img
                  src={posterUrl}
                  alt={`${productName} video thumbnail`}
                  className="w-full h-full object-cover"
                />
              )}
              <button
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-all group"
                aria-label={`Play ${productName} video`}
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="w-8 h-8 text-green-700 ml-1" fill="currentColor" viewBox="0 0 24 24">
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
      <p className="text-sm text-gray-600 mt-2 text-center">
        Learn how {productName} works with your soil's natural biology
      </p>
    </div>
  )
}
