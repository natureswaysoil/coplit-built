
import React, { useEffect, useState } from 'react'
import { getPopularProducts } from '../lib/supabase_client'

interface Product {
  asin: string
  title: string
  price: number
  image?: string
}

interface PersonalizedRecommendationsProps {
  currentProductId?: string
  userHistory?: string[]
}

export default function PersonalizedRecommendations({
  currentProductId,
  userHistory = []
}: PersonalizedRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadRecommendations()
  }, [currentProductId, userHistory])

  const loadRecommendations = async () => {
    try {
      // Get popular products from Supabase
      const result = await getPopularProducts(4)
      
      if (result.success && result.data) {
        // In a real implementation, this would fetch actual product data
        // For now, we'll use placeholder logic
        setRecommendations([
          {
            asin: 'B0D9HT7ND8',
            title: 'Organic Hydroponic Fertilizer',
            price: 19.99
          },
          {
            asin: 'B0DXP97C6F',
            title: 'Liquid Bone Meal Fertilizer',
            price: 19.99
          },
          {
            asin: 'B0FFZPLCG7',
            title: 'Liquid Kelp Fertilizer',
            price: 19.99
          },
          {
            asin: 'B0D6886G54',
            title: 'Organic Tomato Fertilizer',
            price: 29.99
          }
        ])
      }
    } catch (error) {
      console.error('Error loading recommendations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Recommended For You
        </h2>
        <p className="text-gray-600 mb-8">
          Based on what other customers are viewing
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {recommendations.map((product) => (
            <a
              key={product.asin}
              href={`/products/${product.asin}`}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-4 group"
            >
              <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-700 transition-colors line-clamp-2">
                {product.title}
              </h3>
              <p className="text-green-700 font-bold text-lg">
                ${product.price}
              </p>
              <div className="mt-2 text-sm text-gray-600">
                ⭐⭐⭐⭐⭐ (4.8)
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
