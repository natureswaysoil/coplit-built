// Product video mappings from data/product-videos.json
// Videos are expected to be hosted and accessible via URL

export interface ProductVideo {
  asin: string
  parent_asin: string
  title: string
  price: string
  video_url?: string // Public video URL
  video_path?: string // Original path reference
}

// Video mappings by parent ASIN for easy lookup
export const productVideos: Record<string, ProductVideo> = {
  'B0822RH5L3': {
    asin: 'B0822RH5L3',
    parent_asin: 'B0822RH5L3',
    title: "Nature's Way Soil Organic Liquid Fertilizer",
    price: '20.99',
    video_url: '/videos/products/B0822RH5L3.mp4',
    video_path: '/home/ubuntu/runway_videos/Parent_B0822RH5L3_video.mp4'
  },
  'B0D52CQNGN': {
    asin: 'B0D52CQNGN',
    parent_asin: 'B0D52CQNGN',
    title: 'Horticultural Activated Charcoal for Plants',
    price: '29.99',
    video_url: '/videos/products/B0D52CQNGN.mp4',
    video_path: '/home/ubuntu/runway_videos/Parent_B0D52CQNGN_video.mp4'
  },
  'B0D6886G54': {
    asin: 'B0D6886G54',
    parent_asin: 'B0D6886G54',
    title: "Nature's Way Soil Organic Tomato Liquid Fertilizer",
    price: '29.99',
    video_url: '/videos/products/B0D6886G54.mp4',
    video_path: '/home/ubuntu/runway_videos/Parent_B0D6886G54_video.mp4'
  },
  'B0D69LNC5T': {
    asin: 'B0D69LNC5T',
    parent_asin: 'B0D69LNC5T',
    title: "Nature's Way Soil Booster and Loosener",
    price: '29.99',
    video_url: '/videos/products/B0D69LNC5T.mp4',
    video_path: '/home/ubuntu/runway_videos/Parent_B0D69LNC5T_video.mp4'
  },
  'B0D7T3TLQP': {
    asin: 'B0D7T3TLQP',
    parent_asin: 'B0D7T3TLQP',
    title: "Nature's Way Soil® Orchid & African Violet Potting Mix",
    price: '29.99',
    video_url: '/videos/products/B0D7T3TLQP.mp4',
    video_path: '/home/ubuntu/runway_videos/Parent_B0D7T3TLQP_video.mp4'
  },
  'B0D7V76PLY': {
    asin: 'B0D7V76PLY',
    parent_asin: 'B0D7V76PLY',
    title: "Nature's Way Soil Organic Orchid Fertilizer",
    price: '',
    video_url: '/videos/products/B0D7V76PLY.mp4',
    video_path: '/home/ubuntu/runway_videos/Parent_B0D7V76PLY_video.mp4'
  },
  'B0D9HT7ND8': {
    asin: 'B0D9HT7ND8',
    parent_asin: 'B0D9HT7ND8',
    title: "Nature's Way Soil Organic Hydroponic Fertilizer Concentrate",
    price: '19.99',
    video_url: '/videos/products/B0D9HT7ND8.mp4',
    video_path: '/home/ubuntu/runway_videos/Parent_B0D9HT7ND8_video.mp4'
  },
  'B0FG38PQQX': {
    asin: 'B0FG38PQQX',
    parent_asin: 'B0FG38PQQX',
    title: "Nature's Way Soil Dog Urine Neutralizer & Lawn Revitalizer",
    price: '29.99',
    video_url: '/videos/products/B0FG38PQQX.mp4',
    video_path: '/home/ubuntu/runway_videos/Parent_B0FG38PQQX_video.mp4'
  },
  'B0DDCPYLG1': {
    asin: 'B0DDCPYLG1',
    parent_asin: 'B0DDCPYLG1',
    title: "Nature's Way Soil Enhanced Living Compost",
    price: '29.99',
    video_url: '/videos/products/B0DDCPYLG1.mp4',
    video_path: '/home/ubuntu/runway_videos/Parent_B0DDCPYLG1_video.mp4'
  },
  'B0DJ1JNQW4': {
    asin: 'B0DJ1JNQW4',
    parent_asin: 'B0DJ1JNQW4',
    title: "Nature's Way Soil Hay, Pasture & Lawn Fertilizer",
    price: '99.99',
    video_url: '/videos/products/B0DJ1JNQW4.mp4',
    video_path: '/home/ubuntu/runway_videos/Parent_B0DJ1JNQW4_video.mp4'
  },
  'B0F9W7B3NL': {
    asin: 'B0F9W7B3NL',
    parent_asin: 'B0F9W7B3NL',
    title: "Nature's Way Soil Liquid Bone Meal Fertilizer",
    price: '19.99',
    video_url: '/videos/products/B0F9W7B3NL.mp4',
    video_path: '/home/ubuntu/runway_videos/Parent_B0F9W7B3NL_video.mp4'
  },
  'B0F4NQNTSW': {
    asin: 'B0F4NQNTSW',
    parent_asin: 'B0F4NQNTSW',
    title: "Nature's Way Soil Spray Pattern Indicator",
    price: '29.99',
    video_url: '/videos/products/B0F4NQNTSW.mp4',
    video_path: '/home/ubuntu/runway_videos/Parent_B0F4NQNTSW_video.mp4'
  }
}

// Helper function to get video by parent ASIN
export function getVideoByParentAsin(parentAsin: string): ProductVideo | undefined {
  return productVideos[parentAsin]
}

// Helper function to get video URL by product slug (you'll need to map slugs to ASINs)
export function getVideoBySlug(slug: string): string | undefined {
  // Map slugs to ASINs - add your slug mappings here
  const slugToAsinMap: Record<string, string> = {
    'hay-fertilizer': 'B0DJ1JNQW4',
    'organic-hydroponic': 'B0D9HT7ND8',
    'tomato-fertilizer': 'B0D6886G54',
    'orchid-potting-mix': 'B0D7T3TLQP',
    'orchid-fertilizer': 'B0D7V76PLY',
    'soil-booster': 'B0D69LNC5T',
    'activated-charcoal': 'B0D52CQNGN',
    'living-compost': 'B0DDCPYLG1',
    'dog-urine-neutralizer': 'B0FG38PQQX',
    'liquid-bone-meal': 'B0F9W7B3NL',
    'spray-pattern-indicator': 'B0F4NQNTSW',
    'liquid-fertilizer': 'B0822RH5L3'
  }
  
  const asin = slugToAsinMap[slug]
  return asin ? productVideos[asin]?.video_url : undefined
}
