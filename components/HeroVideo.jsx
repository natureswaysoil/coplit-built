'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { videoConfig } from '@/config/videoConfig';

export default function HeroVideo() {
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const video = videoRef.current;
    if (!video) return;

    const attemptPlay = async () => {
      try {
        video.muted = true;
        await video.play();
        setIsLoaded(true);
        console.log('✅ Hero video playing successfully');
      } catch (error) {
        console.log('⚠️ Autoplay prevented:', error.message);
      }
    };

    const handleLoadedMetadata = () => {
      console.log('✅ Video metadata loaded');
      attemptPlay();
    };

    const handleCanPlay = () => {
      console.log('✅ Video can play');
      setIsLoaded(true);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('canplay', handleCanPlay);
    
    if (video.readyState >= 2) {
      attemptPlay();
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [isMounted]);

  const handleError = (e) => {
    console.error('❌ Hero video error:', {
      error: e.target.error,
      src: videoConfig.hero.src
    });
    setHasError(true);
  };

  if (!isMounted) {
    return (
      <div className="relative w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading video...</p>
          </div>
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-green-900 to-green-800 z-10">
          <div className="text-center px-4">
            <Image 
              src="/screenshots/logo-with-tagline.png" 
              alt={videoConfig.hero.alt}
              width={400}
              height={200}
              className="mx-auto mb-8"
              priority
            />
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {videoConfig.hero.title}
            </h1>
            <p className="text-white text-lg opacity-90">
              Restoring healthy soil naturally
            </p>
          </div>
        </div>
      )}
      
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        poster={videoConfig.hero.poster}
        muted
        autoPlay
        loop
        playsInline
        preload="metadata"
        onError={handleError}
      >
        <source src={videoConfig.hero.src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
        <div className="text-center text-white px-4 z-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-2xl animate-fade-in">
            {videoConfig.hero.title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 drop-shadow-lg">
            Restoring healthy soil naturally
          </p>
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg">
            Explore Products
          </button>
        </div>
      </div>
    </div>
  );
}
