'use client';

import Link from 'next/link';
import ProductVideo from './ProductVideo';
import { videoConfig } from '@/config/videoConfig';

export default function ProductsGrid() {
  const productIds = Object.keys(videoConfig.products);

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Products
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Premium organic fertilizers and soil amendments for healthier gardens and lawns
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productIds.map((productId) => {
            const product = videoConfig.products[productId];
            
            return (
              <div 
                key={productId} 
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="relative">
                  <ProductVideo productId={productId} />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem]">
                    {product.name}
                  </h3>
                  
                  <div className="mb-4">
                    <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                      USDA Organic
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    Premium organic formula designed for optimal plant growth and soil health.
                  </p>
                  
                  <div className="space-y-2">
                    <Link 
                      href={product.amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors"
                    >
                      Buy on Amazon
                    </Link>
                    <button className="w-full border-2 border-gray-300 hover:border-green-600 text-gray-700 hover:text-green-600 font-semibold py-3 px-4 rounded-lg transition-colors">
                      Learn More
                    </button>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    SKU: {productId}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
