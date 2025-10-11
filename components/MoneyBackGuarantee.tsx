export default function MoneyBackGuarantee() {
  return (
    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-center mb-3">
        <div className="bg-white text-green-600 rounded-full w-16 h-16 flex items-center justify-center text-3xl font-bold mr-4">
          ✓
        </div>
        <div>
          <h3 className="text-2xl font-bold">100% Satisfaction Guarantee</h3>
          <p className="text-green-100 text-sm">Risk-Free Purchase</p>
        </div>
      </div>
      
      <div className="bg-green-800/30 rounded-lg p-4 mt-4">
        <p className="text-center text-green-50 leading-relaxed">
          Not happy with your results? Get a <strong>full refund within 60 days</strong>. 
          No questions asked. We stand behind the quality of our products 100%.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4 text-center">
        <div>
          <div className="text-3xl mb-1">📦</div>
          <p className="text-xs text-green-100">Free Returns</p>
        </div>
        <div>
          <div className="text-3xl mb-1">💰</div>
          <p className="text-xs text-green-100">Full Refund</p>
        </div>
        <div>
          <div className="text-3xl mb-1">⚡</div>
          <p className="text-xs text-green-100">Fast Processing</p>
        </div>
      </div>
    </div>
  );
}
