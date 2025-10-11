
interface UrgencyBadgesProps {
  stockLevel?: 'low' | 'medium' | 'high';
  recentPurchases?: number;
  showFreeShipping?: boolean;
  freeShippingThreshold?: number;
  currentCartValue?: number;
}

export default function UrgencyBadges({
  stockLevel = 'low',
  recentPurchases = 12,
  showFreeShipping = true,
  freeShippingThreshold = 50,
  currentCartValue = 0
}: UrgencyBadgesProps) {
  const stockMessages = {
    low: { text: 'Only 7 left in stock - Order soon!', color: 'orange', icon: 'alert' },
    medium: { text: 'Limited stock available', color: 'yellow', icon: 'box' },
    high: { text: 'In stock and ready to ship', color: 'green', icon: 'check' }
  };

  const stock = stockMessages[stockLevel];
  const amountNeeded = freeShippingThreshold - currentCartValue;

  return (
    <div className="space-y-3">
      {/* Stock Level */}
      <div className={`bg-${stock.color}-50 border-l-4 border-${stock.color}-600 rounded-lg p-4`}>
        <span className={`text-${stock.color}-800 font-semibold`}>
          {stock.text}
        </span>
      </div>

      {/* Recent Purchases */}
      {recentPurchases > 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>{recentPurchases} people</strong> bought this in the last 24 hours
          </p>
        </div>
      )}

      {/* Free Shipping Progress */}
      {showFreeShipping && amountNeeded > 0 && (
        <div className="bg-green-50 border-l-4 border-green-600 rounded-lg p-4">
          <p className="text-sm text-green-800 font-semibold mb-2">
            Free Shipping on orders over ${freeShippingThreshold}
          </p>
          {currentCartValue > 0 && (
            <>
              <div className="w-full bg-green-200 rounded-full h-2 mb-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${(currentCartValue / freeShippingThreshold) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-green-700">
                Add <strong>${amountNeeded.toFixed(2)}</strong> more to qualify for free shipping!
              </p>
            </>
          )}
        </div>
      )}

      {showFreeShipping && amountNeeded <= 0 && currentCartValue > 0 && (
        <div className="bg-green-600 text-white rounded-lg p-3">
          <p className="text-sm font-semibold text-center">
            Congratulations! You qualify for FREE SHIPPING!
          </p>
        </div>
      )}

      {/* Trust Indicators */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-3 gap-4 text-center text-xs">
          <div>
            <p className="text-gray-900 font-bold mb-1">Fast Shipping</p>
            <p className="text-gray-600">2-3 Days</p>
          </div>
          <div>
            <p className="text-gray-900 font-bold mb-1">Secure Checkout</p>
            <p className="text-gray-600">SSL Encrypted</p>
          </div>
          <div>
            <p className="text-gray-900 font-bold mb-1">Easy Returns</p>
            <p className="text-gray-600">60 Days</p>
          </div>
        </div>
      </div>
    </div>
  );
}
