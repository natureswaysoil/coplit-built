export type ProductVariation = {
  size: string;
  price: number;
  sku: string;
};

export type Product = {
  id: string;
  title: string;
  image: string;
  // Canonical keyword to show on image badges and for search/filtering
  keyword?: string;
  details: string;
  variations: ProductVariation[];
};

export const products: Product[] = [
  {
    id: '1',
    title: "Nature's Way Soil Horse Safe Hay, Pasture & Lawn Fertilizer - Organic Microbial Nitrogen Blend for Greener Grass & Improved Soil",
    image: 'https://m.media-amazon.com/images/I/61ll2EiLAJL._AC_UL320_.jpg',
    keyword: 'HAY FERTILIZER',
    details: 'Premium horse-safe microbial nitrogen fertilizer blend specifically designed for hay fields, pastures, and lawns. This organic formula naturally feeds grass, turf, and forage while supporting sustained growth, creating greener lawns, and improving soil structure. Safe for horses, livestock, and beneficial for sustainable agriculture. Perfect for organic farms, horse pastures, and residential lawns.',
    variations: [
      { size: '1 Gallon', price: 39.99, sku: 'NWS-HAY-1GAL' },
      { size: '2.5 Gallons', price: 99.99, sku: 'NWS-HAY-25GAL' }
    ]
  },
  {
    id: '2',
    title: "Nature's Way Soil Liquid Humic & Fulvic Acid with Kelp - Organic Soil Conditioner for Enhanced Nutrient Uptake",
    image: 'https://m.media-amazon.com/images/I/615mJs9XccL._AC_UL320_.jpg',
    keyword: 'HUMIC FULVIC',
    details: 'Professional-grade liquid humic and fulvic acid fertilizer enriched with organic kelp extract. This carbon-rich soil amendment revives tired, depleted soil by enhancing nutrient uptake, stimulating beneficial microbial activity, and boosting overall plant vigor. Ideal for organic gardening, improving clay or sandy soils, and increasing plant resistance to stress. Perfect for vegetables, flowers, trees, and lawn care.',
    variations: [
      { size: '32 oz', price: 19.99, sku: 'NWS-HUMF-KELP-32OZ' },
      { size: '1 Gallon', price: 39.99, sku: 'NWS-HUMF-KELP-1GAL' },
      { size: '2.5 Gallon', price: 69.99, sku: 'NWS-HUMF-KELP-25GAL' }
    ]
  },
  {
    id: '3',
    title: "Nature's Way Soil Liquid Biochar with Kelp, Humic & Fulvic Acids - Premium Soil Amendment for Water Retention",
    image: 'https://m.media-amazon.com/images/I/510ui3CBLbL._AC_UL320_.jpg',
    keyword: 'BIOCHAR SOIL',
    details: 'Advanced liquid biochar soil conditioner combining activated biochar, organic kelp, and humic/fulvic acids to dramatically improve soil health. This premium formula supercharges beneficial microbial life, increases nutrient retention, and enhances water holding capacity. Perfect for gardens, lawns, and agricultural applications seeking long-term soil fertility improvements and sustainable growing practices.',
    variations: [
      { size: '32 oz', price: 29.99, sku: 'NWS-BIOCHAR-32OZ' },
      { size: '1 Gallon', price: 89.95, sku: 'NWS-BIOCHAR-1GAL' }
    ]
  },
  {
    id: '4',
    title: "Nature's Way Soil Organic Hydroponic Fertilizer - Complete Liquid Plant Food for Hydroponic & Aquaponic Systems",
    image: 'https://m.media-amazon.com/images/I/61qsUDP+WuL._AC_UL320_.jpg',
    keyword: 'HYDROPONIC ORGANIC',
    details: 'Premium organic hydroponic fertilizer concentrate that yields up to 512 gallons of complete nutrient solution. Specially formulated for hydroponic and aquaponic growing systems, providing perfectly balanced nutrition for rapid plant growth. This pet-safe, chemical-free formula supports healthy development without harsh synthetic additives. Ideal for indoor growing, greenhouses, and soilless cultivation of vegetables, herbs, and flowers.',
    variations: [
      { size: '32 oz', price: 25.98, sku: 'NWS-HYDROP-32OZ' },
      { size: '1 Gallon', price: 59.99, sku: 'NWS-HYDROP-1GAL' }
    ]
  },
  {
    id: '5',
    title: "Nature's Way Soil Enhanced Living Compost - Premium Blend with Worm Castings, Biochar & Duckweed Extract",
    image: 'https://m.media-amazon.com/images/I/718tWBNNfkL._AC_UL320_.jpg',
    keyword: 'LIVING COMPOST',
    details: 'Superior living compost blend featuring fermented duckweed extract, 20% premium worm castings, 20% activated biochar, and 60% weed-free aged compost. This powerful soil amendment dramatically enriches soil biology, stimulates healthy root development, and provides slow-release nutrition. Perfect for organic gardens, raised beds, containers, and improving existing garden soil for maximum plant health and productivity.',
    variations: [
      { size: 'Bag 10 lb', price: 29.99, sku: 'NWS-LCOMP-10LB' }
    ]
  },
  {
    id: '6',
    title: "Nature's Way Soil Liquid Kelp Fertilizer - Organic Seaweed Extract for Root Development & Plant Vigor",
    image: 'https://m.media-amazon.com/images/I/71PYCZfZ2BL._AC_UL320_.jpg',
    keyword: 'KELP SEAWEED',
    details: 'Premium liquid kelp fertilizer made fresh weekly with organic seaweed extract, Vitamin B-1, and aloe vera. This concentrated formula promotes stronger root systems, healthier plant transplants, and prevents common plant disorders like blossom end rot. Rich in natural plant hormones, trace minerals, and growth stimulants. Perfect for vegetables, tomatoes, peppers, and all garden plants requiring enhanced root development and stress resistance.',
    variations: [
      { size: '32 oz', price: 24.99, sku: 'NWS-KELP-32OZ' },
      { size: '1 Gallon', price: 34.99, sku: 'NWS-KELP-1GAL' },
      { size: '2.5 Gallon', price: 64.99, sku: 'NWS-KELP-25GAL' }
    ]
  },
  {
    id: '7',
    title: "Nature's Way Soil Liquid Bone Meal Fertilizer - Fast-Absorbing Phosphorus & Calcium for Root Development",
    image: 'https://m.media-amazon.com/images/I/7151rsGhpkL._AC_UL320_.jpg',
    keyword: 'BONE MEAL LIQUID',
    details: 'Fast-absorbing liquid bone meal fertilizer containing 25% hydrolyzed bone meal, 5% calcium, and 10% phosphorus (P₂O₅) for immediate plant uptake. This organic formula promotes robust root development, stronger flowering, and improved fruit set in vegetables, trees, and flowering shrubs. Superior to traditional granular bone meal with instant availability and easy application for all garden plants.',
    variations: [
      { size: '32 oz', price: 24.99, sku: 'NWS-BONEMEAL-32OZ' },
      { size: '1 Gallon', price: 39.99, sku: 'NWS-BONEMEAL-1GAL' }
    ]
  },
  {
    id: '8',
    title: "Nature's Way Soil Dog Urine Neutralizer & Lawn Repair - Pet-Safe Grass Repair Spray for Yellow Spots & Odor Control",
    image: '/screenshots/Screenshot 2025-08-21 103911 dog details.png',
    keyword: 'DOG URINE LAWN',
    details: 'Professional-strength dog urine neutralizer and lawn repair spray specifically formulated to eliminate yellow spots caused by pet urine burn. This pet-safe formula neutralizes harmful salts, eliminates odors, and revives damaged grass for a healthy, green lawn. Safe for dogs, cats, and other pets while effectively restoring lawn beauty. Essential for pet owners maintaining pristine yards without harmful chemicals.',
    variations: [
      { size: '32 oz', price: 29.99, sku: 'NWS-DOGSAFE-32OZ' },
      { size: '1 Gallon', price: 59.99, sku: 'NWS-DOGSAFE-1GAL' }
    ]
  },
  {
    id: '9',
    title: "Nature's Way Soil Organic Tomato Fertilizer - Liquid Concentrate with Vitamin B-1 & Aloe Vera for Maximum Yields",
    image: '/screenshots/Screenshot 2025-08-21 103351 liquid fertilizer details.png',
    keyword: 'TOMATO ORGANIC FERTILIZER',
    details: 'Premium organic tomato fertilizer made fresh weekly with balanced nutrition for maximum tomato yields. This concentrated liquid formula includes Vitamin B-1 and aloe vera for faster root establishment, healthier transplants, and prevention of blossom end rot. Perfect for organic tomato growing, providing easily absorbed essential nutrients that promote healthy growth and increased fruit production. Ideal for organic farms, greenhouses, and home gardens.',
    variations: [
      { size: '32 oz', price: 29.99, sku: 'NWS-TOMATO-LF-32OZ' },
      { size: '1 Gallon', price: 64.99, sku: 'NWS-TOMATO-LF-1GAL' }
    ]
  }
];