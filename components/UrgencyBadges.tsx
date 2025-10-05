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
    low: { text: 'Only 7 left in stock - Order soon!', color: 'orange', icon: '⚠️' },
    medium: { text: 'Limited stock available', color: 'yellow', icon: '📦' },
    high: { text: 'In stock and ready to ship', color: 'green', icon: '✓' }
  };

  const stock = stockMessages[stockLevel];
  const amountNeeded = freeShippingThreshold - currentCartValue;

  return (
    <div className="space-y-3">
      {/* Stock Level */}
      <div className={`bg-${stock.color}-50 border border-${stock.color}-200 rounded-lg p-4`}>
        <div className="flex items-center">
          <span className="text-2xl mr-2">{stock.icon}</span>
          <span className={`text-${stock.color}-800 font-semibold`}>
            {stock.text}
          </span>
        </div>
      </div>

      {/* Recent Purchases */}
      {recentPurchases > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            🔥 <strong>{recentPurchases} people</strong> bought this in the last 24 hours
          </p>
        </div>
      )}

      {/* Free Shipping Progress */}
      {showFreeShipping && amountNeeded > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-green-800 font-semibold">
              📦 Free Shipping on orders over ${freeShippingThreshold}
            </p>
          </div>
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
            🎉 Congratulations! You qualify for FREE SHIPPING!
          </p>
        </div>
      )}

      {/* Trust Indicators */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <div className="flex items-center justify-around text-center text-xs">
          <div>
            <div className="text-xl mb-1">🚚</div>
            <p className="text-gray-700 font-semibold">Fast Shipping</p>
            <p className="text-gray-500">2-3 Days</p>
          </div>
          <div>
            <div className="text-xl mb-1">🔒</div>
            <p className="text-gray-700 font-semibold">Secure Checkout</p>
            <p className="text-gray-500">SSL Encrypted</p>
          </div>
          <div>
            <div className="text-xl mb-1">↩️</div>
            <p className="text-gray-700 font-semibold">Easy Returns</p>
            <p className="text-gray-500">60 Days</p>
          </div>
        </div>
      </div>
    </div>
  );
}
