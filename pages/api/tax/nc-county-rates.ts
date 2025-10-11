import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import { loadCountyRates } from '../../../lib/nc_tax'

// GET /api/tax/nc-county-rates
// Returns merged county rate map, ETag, and cache headers.

let lastJson = ''
let lastEtag = ''
let lastAt = 0
const TTL_MS = 60 * 1000 // 1 minute server-side cache; underlying loader also caches

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const now = Date.now()
  if (!lastJson || now - lastAt > TTL_MS) {
    const data = loadCountyRates()
    lastJson = JSON.stringify({ updated: new Date().toISOString(), count: Object.keys(data).length, rates: data })
    lastEtag = 'W/"' + crypto.createHash('sha1').update(lastJson).digest('hex') + '"'
    lastAt = now
  }
  if (req.headers['if-none-match'] === lastEtag) {
    res.statusCode = 304
    res.end()
    return
  }
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
  res.setHeader('ETag', lastEtag)
  res.send(lastJson)
}
