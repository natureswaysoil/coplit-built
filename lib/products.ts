export type ProductVariation = {
  size: string;
  price: number;
  sku: string;
};

export type Product = {
  id: string;
  title: string;
  image: string;
  details: string;
  variations: ProductVariation[];
};

export const products: Product[] = [
  {
    id: '1',
  title: "Liquid Humic & Fulvic Acid with Kelp",
  image: 'https://m.media-amazon.com/images/I/61ll2EiLAJL._AC_UL320_.jpg',
    details: 'Revive tired soil with a carbon-rich blend of humic and fulvic acids plus organic kelp. Enhances nutrient uptake, stimulates microbial activity, and boosts overall plant vigor.',
    variations: [
  { size: '32 oz', price: 19.99, sku: 'NWS-HUMF-KELP-32OZ' },
  { size: '1 Gallon', price: 39.99, sku: 'NWS-HUMF-KELP-1GAL' },
      { size: '2.5 Gallon', price: 69.99, sku: 'NWS-HUMF-KELP-25GAL' }
    ]
  },
  {
    id: '2',
  title: "Organic Hydroponic Fertilizer",
  image: 'https://m.media-amazon.com/images/I/615mJs9XccL._AC_UL320_.jpg',
    details: 'This organic concentrate yields up to 512 gallons of nutrient solution providing balanced nutrition for hydroponic or aquaponic setups. Safe and pet-friendly, it supports rapid growth without harsh chemicals.',
    variations: [
      { size: '32 oz', price: 25.98, sku: 'NWS-HYDROP-32OZ' },
      { size: '1 Gallon', price: 59.99, sku: 'NWS-HYDROP-1GAL' }
    ]
  },
  {
    id: '3',
  title: "Liquid Biochar with Kelp, Humic & Fulvic",
  image: 'https://m.media-amazon.com/images/I/510ui3CBLbL._AC_UL320_.jpg',
    details: 'A premium soil conditioner combining activated biochar, kelp, and humic/fulvic acids to supercharge microbial life and nutrient retention. Ideal for gardens and lawns seeking better water holding and long-term fertility.',
    variations: [
  { size: '32 oz', price: 29.99, sku: 'NWS-BIOCHAR-32OZ' },
      { size: '1 Gallon', price: 89.95, sku: 'NWS-BIOCHAR-1GAL' }
    ]
  },
  {
    id: '4',
  title: "Organic Tomato Fertilizer",
  image: 'https://m.media-amazon.com/images/I/61qsUDP+WuL._AC_UL320_.jpg',
    details: 'Made fresh weekly with Vitamin B-1 and aloe vera, this concentrate encourages stronger roots, healthier transplants, and prevents blossom end rot. Tailored nutrients help produce abundant, tasty tomatoes.',
    variations: [
      { size: '32 oz', price: 29.99, sku: 'NWS-TOMATO-32OZ' },
      { size: '1 Gallon', price: 64.99, sku: 'NWS-TOMATO-1GAL' }
    ]
  },
  {
    id: '5',
  title: "Hay, Pasture & Lawn Fertilizer",
  image: 'https://m.media-amazon.com/images/I/718tWBNNfkL._AC_UL320_.jpg',
    details: 'A pet-safe microbial nitrogen blend that naturally feeds grass, turf, and forage. Supports sustained growth, greener lawns, and improved soil structure.',
    variations: [
      { size: '1 Gallon', price: 49.99, sku: 'NWS-HAY-1GAL' },
      { size: '2.5 Gallons', price: 99.99, sku: 'NWS-HAY-25GAL' }
    ]
  },
  {
    id: '6',
  title: "Enhanced Living Compost",
  image: 'https://m.media-amazon.com/images/I/71PYCZfZ2BL._AC_UL320_.jpg',
    details: 'Features fermented duckweed extract, 20% worm castings, 20% activated biochar, and 60% weed-free compost. A powerful amendment that enriches soil biology and stimulates root development.',
    variations: [
      { size: 'Bag 10 lb', price: 12.99, sku: 'NWS-LCOMP-10LB' },
      { size: 'Bag 25 lb', price: 24.99, sku: 'NWS-LCOMP-25LB' },
      { size: 'Bag 40 lb', price: 39.99, sku: 'NWS-LCOMP-40LB' }
    ]
  },
  {
    id: '7',
  title: "Liquid Bone Meal Fertilizer",
  image: 'https://m.media-amazon.com/images/I/7151rsGhpkL._AC_UL320_.jpg',
    details: 'Fast-absorbing liquid bone meal delivering 25% hydrolyzed bone meal, 5% calcium, and 10% phosphorus (P₂O₅). Promotes healthy roots and strong flowering for vegetables, trees, and shrubs.',
    variations: [
      { size: '32 oz', price: 17.99, sku: 'NWS-BONEMEAL-32OZ' },
      { size: '1 Gallon', price: 39.99, sku: 'NWS-BONEMEAL-1GAL' }
    ]
  }
];
