
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
    low: { text: 'Only 7 left in stock - Order soon!', color: 'orange', bgColor: 'bg-orange-50', borderColor: 'border-orange-200', textColor: 'text-orange-800' },
    medium: { text: 'Limited stock available', color: 'yellow', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', textColor: 'text-yellow-800' },
    high: { text: 'In stock and ready to ship', color: 'green', bgColor: 'bg-green-50', borderColor: 'border-green-200', textColor: 'text-green-800' }
  };

  const stock = stockMessages[stockLevel];
  const amountNeeded = freeShippingThreshold - currentCartValue;

  return (
    <div className="space-y-3">
      {/* Stock Level */}
      <div className={`${stock.bgColor} border ${stock.borderColor} rounded-lg p-4`}>
        <div className="flex items-center">
          <svg className={`w-6 h-6 mr-2 ${stock.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className={`${stock.textColor} font-semibold`}>
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
            <p className="text-sm text-green-800 font-semibold flex items-center">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              Free Shipping on orders over ${freeShippingThreshold}
            </p>
          </div>
          {currentCartValue > 0 && (
            <>
              <div className="w-full bg-green-200 rounded-full h-2 mb-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min((currentCartValue / freeShippingThreshold) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-green-700">
                Add ${amountNeeded.toFixed(2)} more to qualify for free shipping
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
