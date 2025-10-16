export default function MoneyBackGuarantee() {
  return (
    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-6 shadow-lg my-6">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold">100% Satisfaction Guarantee</h3>
        <p className="text-green-100 text-sm mt-1">Risk-Free Purchase</p>
      </div>
      
      <div className="bg-green-50 rounded-lg p-4">
        <p className="text-center text-green-50 leading-relaxed">
          Not happy with your results? Get a <strong>full refund within 60 days</strong>. 
          No questions asked. We stand behind the quality of our products 100%.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4 text-center">
        <div>
          <p className="text-sm font-semibold">Free Returns</p>
          <p className="text-xs text-green-100 mt-1">Easy process</p>
        </div>
        <div>
          <p className="text-sm font-semibold">Full Refund</p>
          <p className="text-xs text-green-100 mt-1">No questions</p>
        </div>
        <div>
          <p className="text-sm font-semibold">60 Days</p>
          <p className="text-xs text-green-100 mt-1">Money back</p>
        </div>
      </div>
    </div>
  );
}
