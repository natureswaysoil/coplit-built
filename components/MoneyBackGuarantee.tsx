
export default function MoneyBackGuarantee() {
  return (
    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-center mb-3">
        <div className="bg-white text-green-600 rounded-full w-16 h-16 flex items-center justify-center mr-4">
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
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
          <svg className="w-8 h-8 mx-auto mb-1 text-green-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p className="text-xs text-green-100">Free Returns</p>
        </div>
        <div>
          <svg className="w-8 h-8 mx-auto mb-1 text-green-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-green-100">Full Refund</p>
        </div>
        <div>
          <svg className="w-8 h-8 mx-auto mb-1 text-green-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <p className="text-xs text-green-100">Fast Processing</p>
        </div>
      </div>
    </div>
  );
}
