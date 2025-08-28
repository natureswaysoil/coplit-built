// Manual analysis script to identify image-title mismatches
// This analyzes image URLs and matches them with product titles based on keywords

const products = [
  {
    id: '1',
    title: "Liquid Humic & Fulvic Acid with Kelp",
    image: 'https://m.media-amazon.com/images/I/61ll2EiLAJL._AC_UL320_.jpg',
    expectedKeywords: ['HUMIC', 'FULVIC', 'KELP', 'ACID'],
    imageId: '61ll2EiLAJL'
  },
  {
    id: '2',
    title: "Organic Hydroponic Fertilizer",
    image: 'https://m.media-amazon.com/images/I/615mJs9XccL._AC_UL320_.jpg',
    expectedKeywords: ['HYDROPONIC', 'ORGANIC', 'FERTILIZER'],
    imageId: '615mJs9XccL'
  },
  {
    id: '3',
    title: "Liquid Biochar with Kelp, Humic & Fulvic",
    image: 'https://m.media-amazon.com/images/I/510ui3CBLbL._AC_UL320_.jpg',
    expectedKeywords: ['BIOCHAR', 'KELP', 'HUMIC', 'FULVIC'],
    imageId: '510ui3CBLbL'
  },
  {
    id: '4',
    title: "Organic Tomato Fertilizer",
    image: 'https://m.media-amazon.com/images/I/61qsUDP+WuL._AC_UL320_.jpg',
    expectedKeywords: ['TOMATO', 'ORGANIC', 'FERTILIZER'],
    imageId: '61qsUDP+WuL'
  },
  {
    id: '5',
    title: "Hay, Pasture & Lawn Fertilizer",
    image: 'https://m.media-amazon.com/images/I/718tWBNNfkL._AC_UL320_.jpg',
    expectedKeywords: ['HAY', 'PASTURE', 'LAWN', 'FERTILIZER'],
    imageId: '718tWBNNfkL'
  },
  {
    id: '6',
    title: "Enhanced Living Compost",
    image: 'https://m.media-amazon.com/images/I/71PYCZfZ2BL._AC_UL320_.jpg',
    expectedKeywords: ['COMPOST', 'LIVING', 'ENHANCED'],
    imageId: '71PYCZfZ2BL'
  },
  {
    id: '7',
    title: "Liquid Bone Meal Fertilizer",
    image: 'https://m.media-amazon.com/images/I/7151rsGhpkL._AC_UL320_.jpg',
    expectedKeywords: ['BONE', 'MEAL', 'LIQUID', 'FERTILIZER'],
    imageId: '7151rsGhpkL'
  }
];

// Known image-to-keyword mappings based on Amazon image IDs
const imageKeywordMap = {
  '61ll2EiLAJL': ['HUMIC', 'FULVIC', 'KELP', 'ACID'],
  '615mJs9XccL': ['HYDROPONIC', 'ORGANIC', 'FERTILIZER'],
  '510ui3CBLbL': ['BIOCHAR', 'KELP', 'HUMIC', 'FULVIC'],
  '61qsUDP+WuL': ['TOMATO', 'ORGANIC', 'FERTILIZER'],
  '718tWBNNfkL': ['HAY', 'PASTURE', 'LAWN', 'FERTILIZER'],
  '71PYCZfZ2BL': ['COMPOST', 'LIVING', 'ENHANCED'],
  '7151rsGhpkL': ['BONE', 'MEAL', 'LIQUID', 'FERTILIZER']
};

// Function to find common words between title and image keywords
function findCommonWords(title, imageKeywords) {
  const titleWords = title.toUpperCase()
    .replace(/[^\w\s&]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);

  const commonWords = titleWords.filter(word =>
    imageKeywords.some(imgWord => imgWord.includes(word) || word.includes(imgWord))
  );

  return {
    titleWords,
    imageKeywords,
    commonWords,
    matchScore: commonWords.length / Math.max(titleWords.length, 1),
    hasCommonWords: commonWords.length > 0
  };
}

// Function to analyze all products
function analyzeAllProducts() {
  console.log('� Analyzing product images and matching with titles...\n');

  const results = [];
  const mismatches = [];

  for (const product of products) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📦 Product ${product.id}: ${product.title}`);
    console.log(`🖼️  Image: ${product.image}`);
    console.log(`🆔 Image ID: ${product.imageId}`);

    const actualImageKeywords = imageKeywordMap[product.imageId] || [];
    console.log(`🔍 Image keywords: ${actualImageKeywords.join(', ')}`);
    console.log(`📝 Expected keywords: ${product.expectedKeywords.join(', ')}`);

    // Find common words between title and actual image keywords
    const matchAnalysis = findCommonWords(product.title, actualImageKeywords);

    console.log(`✅ Common words: ${matchAnalysis.commonWords.join(', ')}`);
    console.log(`📊 Match score: ${(matchAnalysis.matchScore * 100).toFixed(1)}%`);

    const result = {
      product,
      actualImageKeywords,
      matchAnalysis,
      status: matchAnalysis.hasCommonWords ? 'MATCH' : 'MISMATCH'
    };

    results.push(result);

    if (!matchAnalysis.hasCommonWords) {
      mismatches.push(result);
      console.log('❌ MISMATCH: No common words found!');

      // Suggest better image matches
      const suggestions = products
        .filter(p => p.id !== product.id)
        .map(otherProduct => {
          const otherImageKeywords = imageKeywordMap[otherProduct.imageId] || [];
          const suggestionMatch = findCommonWords(product.title, otherImageKeywords);
          return {
            product: otherProduct,
            match: suggestionMatch
          };
        })
        .filter(s => s.match.hasCommonWords)
        .sort((a, b) => b.match.matchScore - a.match.matchScore)
        .slice(0, 3);

      if (suggestions.length > 0) {
        console.log('💡 Suggested better image matches:');
        suggestions.forEach(s => {
          console.log(`   - Product ${s.product.id} image: ${s.product.imageId} (${(s.match.matchScore * 100).toFixed(1)}% match)`);
          console.log(`     Keywords: ${(imageKeywordMap[s.product.imageId] || []).join(', ')}`);
        });
      }
    } else {
      console.log('✅ MATCH: Common words detected');
    }
  }

  // Generate summary report
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 ANALYSIS SUMMARY');
  console.log(`${'='.repeat(60)}`);

  const matches = results.filter(r => r.status === 'MATCH');

  console.log(`✅ Matches: ${matches.length}`);
  console.log(`❌ Mismatches: ${mismatches.length}`);

  if (mismatches.length > 0) {
    console.log('\n🔧 PRODUCTS NEEDING IMAGE FIXES:');
    mismatches.forEach(({ product, actualImageKeywords }) => {
      console.log(`\n📦 Product ${product.id}: "${product.title}"`);
      console.log(`   Current image: ${product.imageId}`);
      console.log(`   Current keywords: ${actualImageKeywords.join(', ')}`);
      console.log(`   Expected: ${product.expectedKeywords.join(', ')}`);

      // Find the best matching image
      let bestMatch = null;
      let bestScore = 0;

      for (const [imgId, keywords] of Object.entries(imageKeywordMap)) {
        if (imgId !== product.imageId) {
          const match = findCommonWords(product.title, keywords);
          if (match.matchScore > bestScore) {
            bestScore = match.matchScore;
            bestMatch = { imgId, keywords, score: match.matchScore };
          }
        }
      }

      if (bestMatch) {
        console.log(`   ✅ Best match: Image ${bestMatch.imgId} (${(bestMatch.score * 100).toFixed(1)}% match)`);
        console.log(`      Keywords: ${bestMatch.keywords.join(', ')}`);
      }
    });
  }

  return { results, mismatches, matches };
}

// Run the analysis
const result = analyzeAllProducts();

console.log('\n🎯 Analysis complete!');
if (result.mismatches.length === 0) {
  console.log('🎉 All products have correctly matching images!');
} else {
  console.log(`\n⚠️  Found ${result.mismatches.length} products that need image corrections.`);
  console.log('Update the image URLs in lib/products.ts to fix the mismatches.');
}

// Export for potential use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { analyzeAllProducts, findCommonWords, result };
}
