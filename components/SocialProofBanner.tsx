
import React, { useState, useEffect } from 'react'

interface RecentPurchase {
  name: string
  product: string
  location: string
  time: string
}

export default function SocialProofBanner() {
  const [currentPurchase, setCurrentPurchase] = useState<RecentPurchase | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const recentPurchases: RecentPurchase[] = [
    { name: 'Sarah M.', product: 'Liquid Kelp Fertilizer', location: 'California', time: '5 minutes ago' },
    { name: 'John D.', product: 'Organic Tomato Fertilizer', location: 'Texas', time: '12 minutes ago' },
    { name: 'Emily R.', product: 'Liquid Bone Meal', location: 'Florida', time: '18 minutes ago' },
    { name: 'Michael T.', product: 'Hydroponic Fertilizer', location: 'Oregon', time: '23 minutes ago' },
    { name: 'Lisa K.', product: 'Seaweed & Humic Acid', location: 'Washington', time: '31 minutes ago' }
  ]

  useEffect(() => {
    const showRandomPurchase = () => {
      const randomPurchase = recentPurchases[Math.floor(Math.random() * recentPurchases.length)]
      setCurrentPurchase(randomPurchase)
      setIsVisible(true)

      // Hide after 5 seconds
      setTimeout(() => {
        setIsVisible(false)
      }, 5000)
    }

    // Show first notification after 3 seconds
    const initialTimeout = setTimeout(showRandomPurchase, 3000)

    // Show new notification every 15 seconds
    const interval = setInterval(showRandomPurchase, 15000)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [])

  if (!currentPurchase || !isVisible) {
    return null
  }

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-sm animate-slide-in-left">
      <div className="bg-white rounded-lg shadow-2xl border-2 border-green-500 p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">
              {currentPurchase.name} from {currentPurchase.location}
            </p>
            <p className="text-sm text-gray-600">
              purchased <span className="font-medium">{currentPurchase.product}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {currentPurchase.time}
            </p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600"
            aria-label="Close notification"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
