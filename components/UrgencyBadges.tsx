
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
      <div className={`bg-${stock.color}-50 border border-${stock.color}-200 rounded-lg p-4`}>
        <div className="flex items-center">
          {stock.icon === 'alert' && (
            <svg className="w-6 h-6 mr-2 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
          {stock.icon === 'box' && (
            <svg className="w-6 h-6 mr-2 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          )}
          {stock.icon === 'check' && (
            <svg className="w-6 h-6 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
          <span className={`text-${stock.color}-800 font-semibold`}>
            {stock.text}
          </span>
        </div>
      </div>

      {/* Recent Purchases */}
      {recentPurchases > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-blue-800">
              <strong>{recentPurchases} people</strong> bought this in the last 24 hours
            </p>
          </div>
        </div>
      )}

      {/* Free Shipping Progress */}
      {showFreeShipping && amountNeeded > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
              </svg>
              <p className="text-sm text-green-800 font-semibold">
                Free Shipping on orders over ${freeShippingThreshold}
              </p>
            </div>
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
          <div className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-semibold text-center">
              Congratulations! You qualify for FREE SHIPPING!
            </p>
          </div>
        </div>
      )}

      {/* Trust Indicators */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <div className="flex items-center justify-around text-center text-xs">
          <div>
            <svg className="w-8 h-8 mx-auto mb-1 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
            </svg>
            <p className="text-gray-700 font-semibold">Fast Shipping</p>
            <p className="text-gray-500">2-3 Days</p>
          </div>
          <div>
            <svg className="w-8 h-8 mx-auto mb-1 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <p className="text-gray-700 font-semibold">Secure Checkout</p>
            <p className="text-gray-500">SSL Encrypted</p>
          </div>
          <div>
            <svg className="w-8 h-8 mx-auto mb-1 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            <p className="text-gray-700 font-semibold">Easy Returns</p>
            <p className="text-gray-500">60 Days</p>
          </div>
        </div>
      </div>
    </div>
  );
}
