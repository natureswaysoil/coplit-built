// config/videoConfig.js
// Updated to include locally-hosted product videos from /videos/products/
// Maps products by ASIN to video URLs, titles, and metadata

import productVideos from '../data/product-videos.json'

// Build product video mapping from JSON data
const productVideoMap = {}
productVideos.forEach(product => {
  const asin = product.asin || product.parent_asin
  if (asin && product.video_path) {
    // Extract filename from path and map to /videos/products/
    const filename = product.video_path.split('/').pop()
    productVideoMap[asin] = {
      url: `/videos/products/${filename}`,
      name: product.title,
      price: product.price,
      amazonUrl: `https://amazon.com/dp/${asin}`,
      parent_asin: product.parent_asin
    }
  }
})

// Merge with existing CloudFront videos (CloudFront takes precedence for now)
const cloudFrontVideos = {
  "B0D9HT7ND8": {
    url: "https://d3uryq9bhgb5qr.cloudfront.net/Pictory-API-Self-Service-USD-Monthly/6brpmrpiu3k3kud3b4eb7nc1rs/22ddc732-5c9a-46eb-9f92-ff8a5dafb3c0/VIDEO/organic_hydroponic_fertilizer_concentrate_product_.mp4",
    name: "Organic Hydroponic Fertilizer Concentrate",
    amazonUrl: "https://amazon.com/dp/B0D9HT7ND8"
  },
  "B0DXP97C6F": {
    url: "https://d3uryq9bhgb5qr.cloudfront.net/Pictory-API-Self-Service-USD-Monthly/6brpmrpiu3k3kud3b4eb7nc1rs/0bdaff8c-5ac2-4c9d-a16a-172d24b79f52/VIDEO/liquid_bone_meal_fertilizer_product_video.mp4",
    name: "Liquid Bone Meal Fertilizer",
    amazonUrl: "https://amazon.com/dp/B0DXP97C6F"
  },
  "B0FFZPLCG7": {
    url: "https://d3uryq9bhgb5qr.cloudfront.net/Pictory-API-Self-Service-USD-Monthly/6brpmrpiu3k3kud3b4eb7nc1rs/99e79e43-6242-4029-bcc3-18563dd1e2c3/VIDEO/natures_way_soil_liquid_kelp_fertilizer_product_vi.mp4",
    name: "Nature's Way Soil® Liquid Kelp Fertilizer",
    amazonUrl: "https://amazon.com/dp/B0FFZPLCG7"
  },
  "B0FGWSKGCY": {
    url: "https://d3uryq9bhgb5qr.cloudfront.net/Pictory-API-Self-Service-USD-Monthly/6brpmrpiu3k3kud3b4eb7nc1rs/7e73b697-52ad-4a55-b6e1-b25664378032/VIDEO/seaweed__humic_acid_lawn_treatment_product_video.m.mp4",
    name: "Seaweed & Humic Acid Lawn Treatment",
    amazonUrl: "https://amazon.com/dp/B0FGWSKGCY"
  },
  "B0822RH5L3": {
    url: "https://d3uryq9bhgb5qr.cloudfront.net/Pictory-API-Self-Service-USD-Monthly/6brpmrpiu3k3kud3b4eb7nc1rs/4e66a5bb-ec66-48e2-ab35-7f5746f15e6f/VIDEO/organic_liquid_fertilizer_for_garden_and_house_pla.mp4",
    name: "Organic Liquid Fertilizer for Garden and House Plants",
    amazonUrl: "https://amazon.com/dp/B0822RH5L3"
  }
}

export const videoConfig = {
  hero: {
    src: "https://d3uryq9bhgb5qr.cloudfront.net/Pictory-API-Self-Service-USD-Monthly/6brpmrpiu3k3kud3b4eb7nc1rs/a2a35808-5743-40eb-8023-22b2c6b6cf2d/VIDEO/soil_symbiosis_hero_video.mp4",
    title: "Soil Symbiosis and Organic Farming",
    alt: "Nature's Way Soil - Healthy soil restoration and organic farming practices",
    poster: "/images/hero-poster.jpg",
  },
  products: {
    // ID-based mappings for products without ASINs
    "1": {
      url: "/videos/products/Parent_B0DJ1MF2BP_video.mp4",
      name: "Nature's Way Soil Hay and Pasture Liquid Fertilizer",
      amazonUrl: "https://amazon.com/dp/B0DJ1MF2BP"
    },
    "4": {
      url: "https://d3uryq9bhgb5qr.cloudfront.net/Pictory-API-Self-Service-USD-Monthly/6brpmrpiu3k3kud3b4eb7nc1rs/22ddc732-5c9a-46eb-9f92-ff8a5dafb3c0/VIDEO/organic_hydroponic_fertilizer_concentrate_product_.mp4",
      name: "Nature's Way Soil Organic Hydroponic Fertilizer Concentrate",
      amazonUrl: "https://amazon.com/dp/B0D9HT7ND8"
    },
    "5": {
      url: "/videos/products/Parent_B0DDCPZY3C_video.mp4",
      name: "Nature's Way Soil Enhanced Living Compost",
      amazonUrl: "https://amazon.com/dp/B0DDCPZY3C"
    },
    "7": {
      url: "https://d3uryq9bhgb5qr.cloudfront.net/Pictory-API-Self-Service-USD-Monthly/6brpmrpiu3k3kud3b4eb7nc1rs/0bdaff8c-5ac2-4c9d-a16a-172d24b79f52/VIDEO/liquid_bone_meal_fertilizer_product_video.mp4",
      name: "Nature's Way Soil Liquid Bone Meal Fertilizer",
      amazonUrl: "https://amazon.com/dp/B0DXP97C6F"
    },
    "8": {
      url: "/videos/products/Parent_B0DC9CSMWS_video.mp4",
      name: "Nature's Way Soil Dog Urine Neutralizer & Lawn Revitalizer",
      amazonUrl: "https://amazon.com/dp/B0DC9CSMWS"
    },
    "9": {
      url: "/videos/products/Parent_B0D6886G54_video.mp4",
      name: "Nature's Way Soil Organic Tomato Liquid Fertilizer",
      amazonUrl: "https://amazon.com/dp/B0D6886G54"
    },
    // Merge local videos with CloudFront (local videos take precedence for new products)
    ...productVideoMap,
    ...cloudFrontVideos
  }
};

// Helper function to get video by ASIN or parent_asin
export function getVideoByAsin(asin) {
  if (!asin) return null
  
  // Try direct ASIN match first
  if (videoConfig.products[asin]) {
    return videoConfig.products[asin]
  }
  
  // Try parent_asin match
  const matchedProduct = productVideos.find(p => 
    p.asin === asin || p.parent_asin === asin
  )
  
  if (matchedProduct && matchedProduct.parent_asin) {
    return videoConfig.products[matchedProduct.parent_asin]
  }
  
  return null
}

// Get all available product IDs with videos
export function getProductsWithVideos() {
  return Object.keys(videoConfig.products)
}

console.log(`📹 Video config loaded: ${getProductsWithVideos().length} products with videos`)

export default videoConfig;
