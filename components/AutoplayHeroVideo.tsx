
import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

interface VideoConfig {
  src: string;
  poster: string;
  fallbackImage: string;
  alt: string;
}

interface AutoplayHeroVideoProps {
  videoConfig: VideoConfig;
  children?: React.ReactNode;
  className?: string;
}

export default function AutoplayHeroVideo({ videoConfig, children, className = '' }: AutoplayHeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsVideoLoaded(true);
      // Try to play the video
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Autoplay started successfully
            console.log('Video autoplay started');
          })
          .catch((error) => {
            console.log('Autoplay prevented:', error);
            // Autoplay was prevented, show play button or wait for user interaction
          });
      }
    };

    const handleError = () => {
      console.error('Video failed to load');
      setHasError(true);
    };

    const handleLoadedData = () => {
      setIsVideoLoaded(true);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('loadeddata', handleLoadedData);

    // Handle user interaction for autoplay policies
    const handleUserInteraction = () => {
      if (!userInteracted && video.paused) {
        setUserInteracted(true);
        video.play().catch(console.error);
      }
    };

    // Add event listeners for user interaction
    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('touchstart', handleUserInteraction, { once: true });

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadeddata', handleLoadedData);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [userInteracted]);

  const handleVideoClick = () => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        video.play().catch(console.error);
      } else {
        video.pause();
      }
    }
  };

  if (hasError) {
    // Fallback to static image if video fails
    return (
      <div className={`hero-video-container ${className}`} style={{ position: 'relative', overflow: 'hidden' }}>
        <Image
          src={videoConfig.fallbackImage}
          alt={videoConfig.alt}
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className="hero-content" style={{ position: 'relative', zIndex: 2 }}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={`hero-video-container ${className}`} style={{ position: 'relative', overflow: 'hidden' }}>
      <video
        ref={videoRef}
        className="hero-video"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1,
          opacity: isVideoLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out'
        }}
        autoPlay
        muted
        loop
        playsInline
        poster={videoConfig.poster}
        onClick={handleVideoClick}
        aria-label="Background video - click to play/pause"
      >
        <source src={videoConfig.src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Fallback poster image while video loads */}
      {!isVideoLoaded && (
        <Image
          src={videoConfig.poster}
          alt={videoConfig.alt}
          fill
          style={{ objectFit: 'cover', zIndex: 1 }}
          priority
        />
      )}
      
      {/* Video overlay for better text readability */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1))',
          zIndex: 1
        }}
      />
      
      {/* Content overlay */}
      <div className="hero-content" style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
      
      {/* Play/Pause indicator for mobile */}
      <div 
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          zIndex: 3,
          background: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'white',
          fontSize: '14px'
        }}
        onClick={handleVideoClick}
        aria-label="Play/Pause video"
      >
        {videoRef.current?.paused ? '▶' : '⏸'}
      </div>
      
      <style jsx>{`
        .hero-video-container {
          min-height: 100vh;
        }
        
        @media (max-width: 768px) {
          .hero-video-container {
            min-height: 70vh;
          }
          
          .hero-video {
            height: 70vh !important;
          }
        }
        
        @media (max-width: 480px) {
          .hero-video-container {
            min-height: 60vh;
          }
          
          .hero-video {
            height: 60vh !important;
          }
        }
      `}</style>
    </div>
  );
}
