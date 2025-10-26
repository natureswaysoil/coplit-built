// lib/videoHelper.ts
// Helper functions to match products with their videos

import productVideosData from '../data/product-videos.json'
import { videoConfig, getVideoByAsin } from '../config/videoConfig'

export interface ProductVideoInfo {
  url: string
  name: string
  found: boolean
  matchType?: 'asin' | 'parent_asin' | 'sku' | 'title' | 'id' | 'none'
}

/**
 * Find the best video match for a product
 * Tries multiple strategies: ASIN, parent ASIN, SKU, title matching, ID
 */
export function findProductVideo(product: {
  id?: string
  title?: string
  sku?: string
  variations?: Array<{ sku: string }>
}): ProductVideoInfo {
  if (!product) {
    return { url: '', name: '', found: false, matchType: 'none' }
  }

  // Strategy 1: Try to match by product ID if it looks like an ASIN (B0...)
  if (product.id && /^B0[A-Z0-9]{8,}$/i.test(product.id)) {
    const video = getVideoByAsin(product.id)
    if (video) {
      return {
        url: video.url,
        name: video.name,
        found: true,
        matchType: 'asin'
      }
    }
  }

  // Strategy 2: Try to match by SKU from variations (might contain ASIN)
  if (product.variations && product.variations.length > 0) {
    for (const variation of product.variations) {
      if (variation.sku && /B0[A-Z0-9]{8,}/i.test(variation.sku)) {
        const asinMatch = variation.sku.match(/B0[A-Z0-9]{8,}/i)
        if (asinMatch) {
          const video = getVideoByAsin(asinMatch[0])
          if (video) {
            return {
              url: video.url,
              name: video.name,
              found: true,
              matchType: 'sku'
            }
          }
        }
      }
    }
  }

  // Strategy 3: Try to match by title similarity
  if (product.title) {
    const productTitle = product.title.toLowerCase()
    
    // Check productVideosData for title matches
    const titleMatch = productVideosData.find(pv => {
      const videoTitle = pv.title.toLowerCase()
      // Calculate similarity - if > 60% of words match, consider it a match
      const productWords = new Set(productTitle.split(/\s+/).filter(w => w.length > 3))
      const videoWords = videoTitle.split(/\s+/).filter(w => w.length > 3)
      const matches = videoWords.filter(w => productWords.has(w.toLowerCase()))
      return matches.length / videoWords.length > 0.6
    })

    if (titleMatch && (titleMatch.asin || titleMatch.parent_asin)) {
      const asin = titleMatch.asin || titleMatch.parent_asin
      const video = getVideoByAsin(asin)
      if (video) {
        return {
          url: video.url,
          name: video.name,
          found: true,
          matchType: 'title'
        }
      }
    }
  }

  // Strategy 4: Fallback - try simple ID match with videoConfig products
  if (product.id && (videoConfig.products as any)[product.id]) {
    return {
      url: (videoConfig.products as any)[product.id].url,
      name: (videoConfig.products as any)[product.id].name,
      found: true,
      matchType: 'id'
    }
  }

  // No match found
  return {
    url: '',
    name: product.title || '',
    found: false,
    matchType: 'none'
  }
}

/**
 * Check if a product has a video available
 */
export function hasProductVideo(product: { id?: string; title?: string; sku?: string }): boolean {
  const result = findProductVideo(product)
  return result.found
}

/**
 * Get all products that have videos
 */
export function getProductsWithVideos(): string[] {
  return Object.keys(videoConfig.products)
}

/**
 * Get video info by ASIN directly
 */
export function getProductVideoByAsin(asin: string): ProductVideoInfo | null {
  const video = getVideoByAsin(asin)
  if (!video) return null
  
  return {
    url: video.url,
    name: video.name,
    found: true,
    matchType: 'asin'
  }
}
