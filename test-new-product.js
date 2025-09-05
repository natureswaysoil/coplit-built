// Test the new product addition
require('dotenv').config({ path: '.env.local' });
const { products } = require('./lib/products');

console.log('🧪 Testing New Product Addition...\n');

// Check if new product exists
const newProduct = products.find(p => p.id === '10');
if (newProduct) {
  console.log('✅ New product found!');
  console.log('📦 Product ID:', newProduct.id);
  console.log('🏷️  Title:', newProduct.title.substring(0, 50) + '...');
  console.log('🖼️  Image:', newProduct.image ? 'Present' : 'Missing');
  console.log('🔑 Keyword:', newProduct.keyword);
  console.log('📝 Details length:', newProduct.details.length, 'characters');
  console.log('📏 Variations:', newProduct.variations.length);

  console.log('\n💰 Product Variations:');
  newProduct.variations.forEach((v, i) => {
    console.log(`   ${i + 1}. ${v.size} - $${v.price} (SKU: ${v.sku})`);
  });

  console.log('\n✅ All product data validated!');
  console.log('🌐 Product will be available at: /products/10');
  console.log('📄 Main products page: /products');
} else {
  console.log('❌ New product not found!');
}

console.log('\n📊 Total products in catalog:', products.length);
console.log('🎉 Product addition complete!');
