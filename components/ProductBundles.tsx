import { useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/lib/cart';

interface BundleItem {
  product: Product;
  selected: boolean;
}

interface ProductBundlesProps {
  currentProduct: Product;
  relatedProducts: Product[];
}

export default function ProductBundles({ currentProduct, relatedProducts }: ProductBundlesProps) {
  const [bundleItems, setBundleItems] = useState<BundleItem[]>([
    { product: currentProduct, selected: true },
    ...relatedProducts.slice(0, 2).map(p => ({ product: p, selected: false }))
  ]);

  const toggleItem = (index: number) => {
    if (index === 0) return; // Can't deselect main product
    const newItems = [...bundleItems];
    newItems[index].selected = !newItems[index].selected;
    setBundleItems(newItems);
  };

  const selectedItems = bundleItems.filter(item => item.selected);
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.product.price, 0);
  const originalPrice = bundleItems.reduce((sum, item) => sum + item.product.price, 0);
  const discount = selectedItems.length >= 2 ? 0.20 : 0; // 20% off for bundles
  const finalPrice = totalPrice * (1 - discount);
  const savings = totalPrice - finalPrice;

  if (relatedProducts.length < 2) return null;

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-lg p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold animate-pulse">
            SAVE {(discount * 100).toFixed(0)}%
          </span>
          <h3 className="text-xl font-bold text-gray-900">Complete Soil Health Bundle</h3>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-600">Bundle & Save</p>
          <p className="text-2xl font-bold text-green-600">${savings.toFixed(2)}</p>
        </div>
      </div>

      {/* Bundle Items */}
      <div className="space-y-3 mb-4">
        {bundleItems.map((item, index) => (
          <div
            key={item.product.id}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              item.selected ? 'bg-white shadow-md' : 'bg-gray-50'
            }`}
          >
            <input
              type="checkbox"
              checked={item.selected}
              onChange={() => toggleItem(index)}
              disabled={index === 0}
              className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
            />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">
                {index === 0 ? 'This product: ' : '+ '}
                {item.product.title.substring(0, 60)}...
              </p>
              <p className="text-sm text-gray-600">{item.product.category}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">${item.product.price.toFixed(2)}</p>
              {item.selected && discount > 0 && (
                <p className="text-xs text-green-600">
                  Save ${(item.product.price * discount).toFixed(2)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Summary */}
      <div className="border-t-2 border-yellow-300 pt-4 space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Subtotal ({selectedItems.length} items):</span>
          <span className="text-gray-600">${totalPrice.toFixed(2)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-green-600 font-semibold">Bundle Discount ({(discount * 100).toFixed(0)}%):</span>
            <span className="text-green-600 font-semibold">-${savings.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t">
          <span className="text-lg font-bold">Bundle Total:</span>
          <div className="text-right">
            {discount > 0 && (
              <span className="text-gray-400 line-through text-sm mr-2">
                ${totalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-2xl font-bold text-green-600">
              ${finalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={() => {
          // Add bundle to cart logic here
          const slugs = selectedItems.map(item => item.product.slug).join(',');
          window.location.href = `/checkout?bundle=${slugs}`;
        }}
        className="w-full mt-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 rounded-lg shadow-lg transition-all transform hover:scale-105"
      >
        {discount > 0 ? (
          <>
            🎉 Add Bundle to Cart - Save ${savings.toFixed(2)}
          </>
        ) : (
          <>
            Add Selected Items to Cart
          </>
        )}
      </button>

      {/* Benefits */}
      {selectedItems.length >= 2 && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800 text-center">
            <strong>🌱 Complete Soil Solution:</strong> These products work together to maximize soil health and plant growth!
          </p>
        </div>
      )}
    </div>
  );
}
