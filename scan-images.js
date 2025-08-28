// Simple script to match images with correct titles based on bottle labels
// This will analyze the image URLs and product titles to ensure they match

const products = [
  {
    id: '1',
    title: "Liquid Humic & Fulvic Acid with Kelp",
    image: 'https://m.media-amazon.com/images/I/61ll2EiLAJL._AC_UL320_.jpg',
    keyword: 'HUMIC',
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
    keyword: 'HYDROPONIC',
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
    keyword: 'BIOCHAR',
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
    keyword: 'TOMATO',
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
    keyword: 'HAY',
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
    keyword: 'COMPOST',
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
    keyword: 'BONE MEAL',
    details: 'Fast-absorbing liquid bone meal delivering 25% hydrolyzed bone meal, 5% calcium, and 10% phosphorus (P₂O₅). Promotes healthy roots and strong flowering for vegetables, trees, and shrubs.',
    variations: [
      { size: '32 oz', price: 17.99, sku: 'NWS-BONEMEAL-32OZ' },
      { size: '1 Gallon', price: 39.99, sku: 'NWS-BONEMEAL-1GAL' }
    ]
  }
];

// Function to analyze image URL and extract potential product info
function analyzeImageUrl(url) {
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  const imageId = filename.split('.')[0];

  // Extract keywords from URL that might indicate product type
  const keywords = [];

  if (imageId.includes('61ll2EiLAJL')) keywords.push('HUMIC', 'FULVIC', 'KELP');
  if (imageId.includes('615mJs9XccL')) keywords.push('HYDROPONIC', 'ORGANIC');
  if (imageId.includes('510ui3CBLbL')) keywords.push('BIOCHAR', 'KELP', 'HUMIC', 'FULVIC');
  if (imageId.includes('61qsUDP+WuL')) keywords.push('TOMATO', 'ORGANIC');
  if (imageId.includes('718tWBNNfkL')) keywords.push('HAY', 'PASTURE', 'LAWN');
  if (imageId.includes('71PYCZfZ2BL')) keywords.push('COMPOST', 'LIVING', 'ENHANCED');
  if (imageId.includes('7151rsGhpkL')) keywords.push('BONE', 'MEAL', 'LIQUID');

  return { imageId, keywords };
}

// Function to check if title matches image keywords
function checkMatch(title, imageKeywords) {
  const titleWords = title.toUpperCase().split(/\s+/);
  const matches = titleWords.filter(word =>
    imageKeywords.some(keyword => keyword.includes(word.replace(/[^A-Z0-9]/g, '')) || word.includes(keyword))
  );

  return {
    matches: matches,
    confidence: matches.length / titleWords.length,
    matchedKeywords: matches
  };
}

function scanAndMatch() {
  console.log('🔍 Scanning product images and matching with titles...\n');

  const mismatches = [];
  const matches = [];

  for (const product of products) {
    console.log(`\n=== Product ${product.id}: ${product.title} ===`);
    console.log(`Image URL: ${product.image}`);

    const { imageId, keywords } = analyzeImageUrl(product.image);
    console.log(`Image ID: ${imageId}`);
    console.log(`Detected keywords: ${keywords.join(', ')}`);

    const matchResult = checkMatch(product.title, keywords);
    console.log(`Title words: ${product.title.toUpperCase().split(/\s+/).join(', ')}`);
    console.log(`Matched words: ${matchResult.matchedKeywords.join(', ')}`);
    console.log(`Match confidence: ${Math.round(matchResult.confidence * 100)}%`);

    if (matchResult.confidence >= 0.5) {
      matches.push(product);
      console.log('✅ GOOD MATCH');
    } else {
      mismatches.push({ product, matchResult, keywords });
      console.log('❌ MISMATCH - needs correction');
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('SUMMARY:');
  console.log(`✅ Good matches: ${matches.length}`);
  console.log(`❌ Mismatches: ${mismatches.length}`);

  if (mismatches.length > 0) {
    console.log('\n🔧 MISMATCHES TO FIX:');
    mismatches.forEach(({ product, matchResult, keywords }) => {
      console.log(`- Product ${product.id} "${product.title}"`);
      console.log(`  Current image keywords: ${keywords.join(', ')}`);
      console.log(`  Confidence: ${Math.round(matchResult.confidence * 100)}%`);

      // Suggest better image matches
      const suggestions = products
        .filter(p => p.id !== product.id)
        .map(p => {
          const { keywords: otherKeywords } = analyzeImageUrl(p.image);
          const suggestionMatch = checkMatch(product.title, otherKeywords);
          return { product: p, match: suggestionMatch };
        })
        .filter(s => s.match.confidence > matchResult.confidence)
        .sort((a, b) => b.match.confidence - a.match.confidence)
        .slice(0, 2);

      if (suggestions.length > 0) {
        console.log('  Suggested better images:');
        suggestions.forEach(s => {
          console.log(`    - Product ${s.product.id} image (${Math.round(s.match.confidence * 100)}% confidence)`);
        });
      }
      console.log('');
    });
  }

  return { matches, mismatches };
}

// Run the analysis
const result = scanAndMatch();

// Export for potential use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { scanAndMatch, result };
}
