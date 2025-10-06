
import { useState } from 'react';
import Link from 'next/link';

interface BundleProduct {
  id: string;
  title: string;
  slug: string;
  price: number;
  image: string;
  category: string;
  active: boolean;
}

interface BundleItem {
  product: BundleProduct;
  selected: boolean;
}

interface ProductBundlesProps {
  currentProduct: BundleProduct;
  relatedProducts: BundleProduct[];
}

export default function ProductBundles({ currentProduct, relatedProducts }: ProductBundlesProps) {
  const [bundleItems, setBundleItems] = useState<BundleItem[]>([
    { product: currentProduct, selected: true },
    ...relatedProducts.slice(0, 2).map(p => ({ product: p, selected: false }))
  ]);

  const toggleItem = (index: number) => {
    if (index === 0) return;
    const newItems = [...bundleItems];
    newItems[index].selected = !newItems[index].selected;
    setBundleItems(newItems);
  };

  const selectedItems = bundleItems.filter(item => item.selected);
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.product.price, 0);
  const originalPrice = bundleItems.reduce((sum, item) => sum + item.product.price, 0);
  const discount = selectedItems.length >= 2 ? 0.20 : 0;
  const finalPrice = totalPrice * (1 - discount);
  const savings = totalPrice - finalPrice;

  if (relatedProducts.length < 2) return null;

  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-400 rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
            SAVE {(discount * 100).toFixed(0)}%
          </span>
          <h3 className="text-xl font-bold text-gray-900">Complete Soil Health Bundle</h3>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-600">Bundle & Save</p>
          <p className="text-2xl font-bold text-green-600">${savings.toFixed(2)}</p>
        </div>
      </div>

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

      <div className="border-t-2 border-green-300 pt-4 space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Original Price:</span>
          <span className="line-through text-gray-500">${originalPrice.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-green-700 font-semibold">Bundle Discount ({(discount * 100).toFixed(0)}%):</span>
            <span className="text-green-700 font-semibold">-${savings.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between items-center text-lg font-bold pt-2 border-t border-green-200">
          <span>Bundle Total:</span>
          <span className="text-green-700">${finalPrice.toFixed(2)}</span>
        </div>
      </div>

      <button
        className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md"
        disabled={selectedItems.length < 2}
      >
        {selectedItems.length < 2 ? 'Select 2+ Items for Bundle' : 'Add Bundle to Cart'}
      </button>

      <p className="text-xs text-center text-gray-600 mt-3">
        Save more when you bundle! Select additional products to unlock your discount.
      </p>
    </div>
  );
}
