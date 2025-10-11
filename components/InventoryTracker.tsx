
import React, { useState, useEffect } from 'react'

interface InventoryTrackerProps {
  productId: string
  initialStock?: number
}

export default function InventoryTracker({ 
  productId, 
  initialStock = 50 
}: InventoryTrackerProps) {
  const [stock, setStock] = useState(initialStock)
  const [isLowStock, setIsLowStock] = useState(false)

  useEffect(() => {
    // Simulate real-time inventory updates
    const checkInventory = () => {
      // In production, this would fetch from your inventory system
      const randomStock = Math.floor(Math.random() * 100)
      setStock(randomStock)
      setIsLowStock(randomStock < 20)
    }

    // Check on mount
    checkInventory()

    // Update every 30 seconds
    const interval = setInterval(checkInventory, 30000)

    return () => clearInterval(interval)
  }, [productId])

  const getStockLevel = () => {
    if (stock === 0) return 'out-of-stock'
    if (stock < 10) return 'critical'
    if (stock < 20) return 'low'
    return 'in-stock'
  }

  const stockLevel = getStockLevel()

  if (stockLevel === 'out-of-stock') {
    return (
      <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-semibold text-red-900">Out of Stock</p>
            <p className="text-sm text-red-700">Sign up to be notified when available</p>
          </div>
        </div>
      </div>
    )
  }

  if (stockLevel === 'critical' || stockLevel === 'low') {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-500 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-yellow-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="font-semibold text-yellow-900">
              {stockLevel === 'critical' ? '🔥 Only' : 'Low Stock -'} {stock} left in stock!
            </p>
            <p className="text-sm text-yellow-700">Order soon to avoid missing out</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-green-700 mb-4">
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      <span className="font-medium">In Stock - Ready to Ship</span>
    </div>
  )
}
