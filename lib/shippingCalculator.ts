// lib/shippingCalculator.ts
export interface ShippingItem {
  sku: string;
  size: string;
  qty: number;
  weight?: number; // pounds
}

export interface ShippingRates {
  standard: number;
  expedited?: number;
  priority?: number;
}

// Define shipping weights for different product sizes
const PRODUCT_WEIGHTS: Record<string, number> = {
  // Liquid products (approximate shipping weights including packaging)
  '32 oz': 3.0,      // 2 lbs product + 1 lb packaging
  '1 Gallon': 10.0,   // 8.3 lbs product + 1.7 lbs packaging  
  '2.5 Gallon': 22.0, // 20.8 lbs product + 1.2 lbs packaging
  '2.5 Gallons': 22.0, // Alternative spelling
  // Solid products
  'Bag 10 lb': 12.0,  // 10 lbs product + 2 lbs packaging
};

// Shipping rate tiers based on total weight  
const SHIPPING_TIERS = [
  { maxWeight: 5, rate: 8.99 },     // Up to 5 lbs - competitive with Amazon
  { maxWeight: 15, rate: 12.99 },   // 5.1-15 lbs  
  { maxWeight: 30, rate: 18.99 },   // 15.1-30 lbs
  { maxWeight: 50, rate: 24.99 },   // 30.1-50 lbs
  { maxWeight: 100, rate: 34.99 },  // 50.1-100 lbs
  { maxWeight: Infinity, rate: 44.99 } // Over 100 lbs
];

// Free shipping thresholds
export const FREE_SHIPPING_MINIMUM = 75.00; // Lowered from $150 to $75
export const FLAT_RATE_OPTION = 8.99; // Competitive flat rate option

export function calculateShipping(items: ShippingItem[], subtotal: number): ShippingRates {
  // Free shipping for orders over threshold
  if (subtotal >= FREE_SHIPPING_MINIMUM) {
    return { standard: 0 };
  }

  // Calculate total weight
  const totalWeight = items.reduce((total, item) => {
    const unitWeight = PRODUCT_WEIGHTS[item.size] || 5.0; // Default 5 lbs if size not found
    return total + (unitWeight * item.qty);
  }, 0);

  // Find appropriate shipping tier
  const tier = SHIPPING_TIERS.find(t => totalWeight <= t.maxWeight);
  const standardRate = tier?.rate || 69.99;

  return {
    standard: Math.min(standardRate, FLAT_RATE_OPTION), // Use flat rate if cheaper
    expedited: standardRate + 15.00, // Add $15 for expedited
    priority: standardRate + 25.00   // Add $25 for priority
  };
}

// Alternative: Distance-based shipping (if you want to add zip code logic)
export function calculateDistanceShipping(zipCode: string, items: ShippingItem[], subtotal: number): ShippingRates {
  if (subtotal >= FREE_SHIPPING_MINIMUM) {
    return { standard: 0 };
  }

  // NC zip codes get lower rates
  const isNCZip = /^2[6-8]\d{3}$/.test(zipCode);
  const baseRate = isNCZip ? 8.99 : 12.99;

  const totalWeight = items.reduce((total, item) => {
    const unitWeight = PRODUCT_WEIGHTS[item.size] || 5.0;
    return total + (unitWeight * item.qty);
  }, 0);

  // Weight multiplier
  const weightMultiplier = Math.max(1, Math.ceil(totalWeight / 10));
  const standardRate = baseRate * weightMultiplier;

  return {
    standard: Math.min(standardRate, 49.99), // Cap at $49.99
    expedited: standardRate + 15.00,
    priority: standardRate + 25.00
  };
}
