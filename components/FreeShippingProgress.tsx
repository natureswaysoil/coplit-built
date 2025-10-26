import { useCart } from '@/lib/cartContext'

export default function FreeShippingProgress() {
  const { items } = useCart()
  const FREE_SHIPPING_THRESHOLD = 50
  
  // Calculate cart total
  const cartTotal = items.reduce((sum, item) => {
    return sum + (item.price * item.qty)
  }, 0)
  
  const remaining = FREE_SHIPPING_THRESHOLD - cartTotal
  const progress = Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100)
  const hasFreeShipping = cartTotal >= FREE_SHIPPING_THRESHOLD

  if (items.length === 0) return null

  return (
    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        {hasFreeShipping ? (
          <div className="flex items-center gap-2 text-green-700 font-bold">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span className="text-lg">🎉 You qualify for FREE shipping!</span>
          </div>
        ) : (
          <div className="text-gray-700">
            <span className="font-bold text-green-600">${remaining.toFixed(2)}</span>
            <span> away from </span>
            <span className="font-bold">FREE SHIPPING</span>
          </div>
        )}
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-green-500 to-green-600 h-full transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="text-xs text-gray-600 mt-1">
        Cart total: ${cartTotal.toFixed(2)} / ${FREE_SHIPPING_THRESHOLD.toFixed(2)}
      </div>
    </div>
  )
}
