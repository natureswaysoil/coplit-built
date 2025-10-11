import type { NextApiRequest, NextApiResponse } from 'next'
import { getCountyRate, loadCountyRates } from '../../../lib/nc_tax'
import { NC_ZIP_TO_COUNTY, NC_CITY_TO_COUNTY } from '../../../lib/nc_data'

// POST /api/tax/nc-debug
// Body: { items?: { sku:string; qty:number; price:number }[], amount?: number (cents), state?: string, county?: string, zip?: string, city?: string, shipping?: number (cents) }
// Returns detailed breakdown of NC tax computation.

type Item = { sku: string; qty: number; price: number }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const {
    items = [],
    amount, // cents alternative subtotal
    state = 'NC',
    county: countyRaw = '',
    zip = '',
    city = '',
    shipping = 0, // cents
  } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}

  // Reuse logic similar to create-payment-intent (simplified)
  const norm = (s?: string) => (s ?? '').trim().toLowerCase()

  // Resolve subtotal
  let subtotal = 0
  if (items.length) {
    for (const it of items as Item[]) {
      const q = Number(it.qty)
      const p = Number(it.price)
      if (Number.isFinite(q) && Number.isFinite(p)) subtotal += q * p
    }
  } else if (Number.isFinite(amount)) {
    subtotal = Number((Number(amount) / 100).toFixed(2))
  }
  subtotal = Number(subtotal.toFixed(2))

  // Attempt to mirror county resolution order used in main endpoint.
  // NOTE: We do not import NC_ZIP_TO_COUNTY / NC_CITY_TO_COUNTY here to keep it light; we just echo provided county.
  const zipTrim = (zip || '').trim()
  let resolvedCounty = ''
  if (zipTrim && NC_ZIP_TO_COUNTY[zipTrim]) resolvedCounty = NC_ZIP_TO_COUNTY[zipTrim]
  else {
    const cityKey = norm(city)
    if (cityKey && NC_CITY_TO_COUNTY[cityKey]) resolvedCounty = NC_CITY_TO_COUNTY[cityKey]
  }
  if (!resolvedCounty && countyRaw) resolvedCounty = countyRaw

  const providedCounty = countyRaw

  const baseRate = Number(process.env.NEXT_PUBLIC_NC_TAX_RATE ?? 0.0475) || 0.0475
  const map = loadCountyRates()
  const rawCountyValue = map[norm(resolvedCounty)] || 0
  const addon = getCountyRate(resolvedCounty)
  const combined = state === 'NC' ? baseRate + addon : 0

  const shippingTaxable = (process.env.NC_TAX_TAXABLE_SHIPPING || '').toLowerCase() === 'true'
  const shippingD = Number(((shipping || 0) / 100).toFixed(2))
  const taxableBase = shippingTaxable ? subtotal + shippingD : subtotal
  const tax = Number((taxableBase * combined).toFixed(2))
  // shippingD defined earlier
  const total = Number((subtotal + tax + shippingD).toFixed(2))

  const effectivePercent = Number((combined * 100).toFixed(4))

  const notes: string[] = []
  if (!resolvedCounty) notes.push('no_county_provided')
  if (rawCountyValue && rawCountyValue > 0.04 && rawCountyValue < 0.12) notes.push('raw_value_interpreted_as_combined_total')
  if (addon === 0 && rawCountyValue > 0 && rawCountyValue <= 0.04) notes.push('addon_rate_used_directly')
  if (combined === baseRate) notes.push('no_county_addon_applied')

  return res.status(200).json({
    ok: true,
    input: { items, amount, state, county: countyRaw, zip, city, shipping_cents: shipping },
    rates: {
      baseRate,
      rawCountyValue,
      interpretedCountyAddon: addon,
      combinedRate: combined,
      combinedPercent: effectivePercent,
      shippingTaxable,
    },
    money: {
      subtotal,
      taxableBase,
      tax,
      shipping: shippingD,
      total,
    },
    notes,
  })
}
