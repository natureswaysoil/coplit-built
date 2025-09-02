// lib/nc_tax.ts
// Loads NC county add-on rates from a JSON file and/or env var, and exposes helpers.

import fs from 'fs'
import path from 'path'

export type CountyRates = Record<string, number> // lowercased county name -> rate (e.g., 0.02)

const DATA_FILE = path.join(process.cwd(), 'public', 'data', 'nc_county_rates.json')

let cache: CountyRates | null = null
let cacheAt = 0
const TTL = 5 * 60 * 1000

function norm(s: string) {
  return (s || '').trim().toLowerCase()
}

function readJsonFileSafe(filePath: string): any {
  try {
    const raw = fs.readFileSync(filePath, 'utf8')
    if (!raw) return {}
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function readEnvMap(): CountyRates {
  try {
    const raw = process.env.NEXT_PUBLIC_NC_COUNTY_RATES || '{}'
    const parsed = JSON.parse(raw) as Record<string, number>
    const out: CountyRates = {}
    for (const [k, v] of Object.entries(parsed)) {
      const n = Number(v)
      if (Number.isFinite(n)) out[norm(k)] = n
    }
    return out
  } catch {
    return {}
  }
}

export function loadCountyRates(): CountyRates {
  const now = Date.now()
  if (cache && now - cacheAt < TTL) return cache

  const fileMapRaw = readJsonFileSafe(DATA_FILE) as Record<string, number>
  const fileMap: CountyRates = {}
  for (const [k, v] of Object.entries(fileMapRaw || {})) {
    const n = Number(v)
    if (Number.isFinite(n)) fileMap[norm(k)] = n
  }

  const envMap = readEnvMap()
  cache = { ...fileMap, ...envMap }
  cacheAt = now
  return cache
}

export function getCountyRate(county?: string): number {
  if (!county) return 0
  const map = loadCountyRates()
  const v = map[norm(county)] || 0
  if (!v) return 0
  // Support either county add-on (e.g., 0.0225) or total combined (e.g., 0.07)
  // If it looks like a combined total, convert to add-on by subtracting base.
  const baseNc = Number(process.env.NEXT_PUBLIC_NC_TAX_RATE ?? 0.0475) || 0.0475
  if (v > 0.04 && v < 0.12) {
    const addon = v - baseNc
    return addon > 0 ? addon : 0
  }
  return v
}
