'use client';

import { useRef, useState, useEffect } from 'react';
import { videoConfig } from '@/config/videoConfig';

export default function ProductVideo({ productId }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const product = videoConfig.products[productId];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => {
      console.log(`📹 Loading product video: ${product?.name}`);
    };

    const handleCanPlay = () => {
      console.log(`✅ Product video ready: ${product?.name}`);
      setIsLoading(false);
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [product]);

  if (!product) {
    return (
      <div className="w-full aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Product video not found</p>
      </div>
    );
  }

  const handleError = (e) => {
    console.error(`❌ Product video error (${productId}):`, {
      error: e.target.error,
      src: product.url
    });
    setHasError(true);
    setIsLoading(false);
  };

  const handlePlay = () => {
    console.log(`▶️ Playing: ${product.name}`);
    setIsPlaying(true);
  };

  const handlePause = () => {
    console.log(`⏸️ Paused: ${product.name}`);
    setIsPlaying(false);
  };

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group">
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      )}

      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 text-white p-4">
          <svg className="w-16 h-16 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            <line x1="2" y1="2" x2="22" y2="22" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
          </svg>
          <p className="text-center font-medium mb-2">Video unavailable</p>
          <p className="text-sm text-gray-400 text-center">{product.name}</p>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            preload="metadata"
            playsInline
            onPlay={handlePlay}
            onPause={handlePause}
            onEnded={() => setIsPlaying(false)}
            onError={handleError}
            controls
          >
            <source src={product.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {!isPlaying && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all pointer-events-none">
              <div className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-xl">
                <svg 
                  className="w-10 h-10 text-green-600 ml-1" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          )}
        </>
      )}
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-white text-sm font-semibold">{product.name}</p>
        <p className="text-gray-300 text-xs mt-1">Product ID: {productId}</p>
      </div>
    </div>
  );
}
