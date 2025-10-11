const fs = require('fs');
const path = require('path');
const Tesseract = require('tesseract.js');

async function extractProductData() {
  const screenshotDir = path.join(__dirname, 'public', 'screenshots');
  const screenshots = [
    'Screenshot 2025-08-21 102112  humic details.png',
    'Screenshot 2025-08-21 102258 hydrophonic.png', 
    'Screenshot 2025-08-21 102544 seaweed.png',
    'Screenshot 2025-08-21 102710  hay details.png',
    'Screenshot 2025-08-21 102853 compost details.png',
    'Screenshot 2025-08-21 103208  bone meal details.png',
    'Screenshot 2025-08-21 103351 liquid fertilizer details.png',
    'Screenshot 2025-08-21 103738 32 ounce kelp detais.png',
    'Screenshot 2025-08-21 103911 dog details.png'
  ];

  const products = [];

  for (const screenshot of screenshots) {
    const imagePath = path.join(screenshotDir, screenshot);
    
    if (!fs.existsSync(imagePath)) {
      console.log(`❌ Image not found: ${screenshot}`);
      continue;
    }

    console.log(`\n🔍 Processing: ${screenshot}`);
    
    try {
      const worker = await Tesseract.createWorker('eng');
      const { data: { text } } = await worker.recognize(imagePath);
      await worker.terminate();
      
      console.log('📝 Extracted text:');
      console.log('=' * 50);
      console.log(text);
      console.log('=' * 50);
      
      // Basic parsing to extract product info
      const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      
      let productName = '';
      let price = '';
      let variations = [];
      let description = '';
      
      // Look for product patterns
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Look for prices ($ followed by numbers)
        if (line.match(/\$[\d,]+\.?\d*/)) {
          price = line.match(/\$[\d,]+\.?\d*/)[0];
        }
        
        // Look for product names (usually at the top or in caps)
        if (line.length > 3 && line.length < 50 && !line.includes('$')) {
          if (!productName || line.length > productName.length) {
            productName = line;
          }
        }
        
        // Look for variations (oz, lb, gallon, etc.)
        if (line.match(/\d+\s*(oz|lb|gallon|qt|pt)/i)) {
          variations.push(line);
        }
      }
      
      products.push({
        screenshot,
        productName: productName || 'Unknown Product',
        price: price || 'Price not found',
        variations,
        fullText: text,
        extractedLines: lines
      });
      
    } catch (error) {
      console.log(`❌ Error processing ${screenshot}:`, error.message);
    }
  }

  // Output results
  console.log('\n📊 SUMMARY OF EXTRACTED PRODUCTS:\n');
  products.forEach((product, index) => {
    console.log(`${index + 1}. ${product.productName}`);
    console.log(`   Price: ${product.price}`);
    console.log(`   Variations: ${product.variations.join(', ') || 'None found'}`);
    console.log(`   Source: ${product.screenshot}\n`);
  });

  // Save to file for reference
  fs.writeFileSync('extracted-products.json', JSON.stringify(products, null, 2));
  console.log('💾 Full extraction saved to extracted-products.json');
}

extractProductData().catch(console.error);
