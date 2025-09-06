// pages/api/create-payment-intent.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { getSecretKey, STRIPE_API_VERSION } from '../../lib/stripeConfig'
import { NC_ZIP_TO_COUNTY, NC_CITY_TO_COUNTY } from '../../lib/nc_data'
import { getCountyRate } from '../../lib/nc_tax'

/**
 * Optional server-side price book. If a SKU exists here, we ignore any client
 * price and use this value (USD dollars). Leave empty to trust client prices.
 */
const PRICE_BY_SKU: Record<string, number> = {
  // 'SEAWEED-HUMIC-32OZ': 29.99,
  // 'BONE-MEAL-LIQ-1GAL': 39.99,
}

type CartItem = { sku: string; qty: number; price?: number }
type Address = {
  name?: string
  email?: string
  phone?: string
  address1?: string
  address2?: string
  city?: string
  state?: string
  zip?: string
  county?: string
}

type Body = {
  intentId?: string
  // Option A: itemized cart in dollars
  items?: CartItem[]
  // Option B: precomputed subtotal (in cents)
  amount?: number // cents
  // Common fields
  shipping?: number // cents
  email?: string
  name?: string
  currency?: string
  state?: 'NC' | 'Other'
  county?: string
  zip?: string
  city?: string
  billing?: Address
  shippingAddress?: Address
}

const norm = (s?: string) => (s ?? '').trim().toLowerCase()

// Parse county rates JSON from env, normalize keys (e.g., "wake" -> 0.02)
const COUNTY_RATES: Record<string, number> = (() => {
  try {
    const raw = process.env.NEXT_PUBLIC_NC_COUNTY_RATES || '{}'
    const parsed = JSON.parse(raw) as Record<string, number>
    const out: Record<string, number> = {}
    for (const [k, v] of Object.entries(parsed)) {
      const n = Number(v)
      if (Number.isFinite(n)) out[norm(k)] = n
    }
    return out
  } catch {
    return {}
  }
})()

function resolveCounty(zip?: string, city?: string, fallbackCounty?: string): string | undefined {
  const z = (zip || '').trim()
  if (z && NC_ZIP_TO_COUNTY[z]) return NC_ZIP_TO_COUNTY[z]
  const c = (city || '').trim().toLowerCase()
  if (c && NC_CITY_TO_COUNTY[c]) return NC_CITY_TO_COUNTY[c]
  return fallbackCounty
}

function calcTotals({
  items,
  amountCents,
  state = 'Other',
  county,
  shippingCents = 0,
}: {
  items?: CartItem[]
  amountCents?: number
  state?: 'NC' | 'Other'
  county?: string
  shippingCents?: number
}) {
  // Determine subtotal dollars from items or cents
  let subtotal = 0
  if (items && items.length) {
    for (const it of items) {
      const qty = Number(it.qty)
      const unit = Number.isFinite(PRICE_BY_SKU[it.sku]) ? PRICE_BY_SKU[it.sku] : Number(it.price)
      if (Number.isFinite(qty) && Number.isFinite(unit)) subtotal += qty * unit
    }
  } else if (Number.isFinite(amountCents as number)) {
    subtotal = Number(((amountCents as number) / 100).toFixed(2))
  }
  subtotal = Number(subtotal.toFixed(2))

  const baseNc = Number(process.env.NEXT_PUBLIC_NC_TAX_RATE ?? 0.0475) || 0
  const countyRate = state === 'NC' ? getCountyRate(county) : 0
  const tax = Number((subtotal * (state === 'NC' ? baseNc + countyRate : 0)).toFixed(2))
  const total = Number((subtotal + tax + (shippingCents / 100)).toFixed(2))

  const subtotalCents = Math.round(subtotal * 100)
  const taxCents = Math.round(tax * 100)
  const totalCents = subtotalCents + taxCents + Math.round(shippingCents)

  if (!Number.isFinite(totalCents) || totalCents < 50) {
    throw new Error('Bad total after tax (must be ≥ $0.50)')
  }
  return { subtotal, tax, total, subtotalCents, taxCents, totalCents, shippingCents }
}

function metaFrom(prefix: string, src?: Address): Record<string, string> {
  if (!src) return {}
  const m: Record<string, string> = {}
  const add = (k: keyof Address) => {
    const v = src[k]
    if (v !== undefined && v !== null && String(v).trim() !== '') m[`${prefix}_${k}`] = String(v)
  }
  add('name'); add('email'); add('phone')
  add('address1'); add('address2'); add('city'); add('state'); add('zip'); add('county')
  return m
}

// Instantiate Stripe using centralized key resolution
const stripe = new Stripe(getSecretKey().key, {
  apiVersion: STRIPE_API_VERSION as any,
} as any)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Secret key is resolved at module load via getSecretKey; if misconfigured, module would have thrown.

  let body: Body
  try {
    body = (typeof req.body === 'string') ? JSON.parse(req.body) : (req.body as Body)
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' })
  }

  const {
    intentId,
    items,
    amount: amountCents,
    shipping: shippingCents = 0,
    email = '',
    name = '',
    currency = 'usd',
  state = 'Other',
  county: countyRaw = '',
  zip = '',
  city = '',
    billing,
    shippingAddress,
  } = body

  try {
  const resolvedCounty = resolveCounty(zip, city, countyRaw)
    const { subtotal, tax, total, totalCents, subtotalCents, taxCents } = calcTotals({
      items,
      amountCents,
      state,
      county: resolvedCounty,
      shippingCents,
    })

    const baseMeta: Record<string, string> = {
      email,
      name,
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
      state,
  county: resolvedCounty || '',
    }
    const metadata = {
      ...baseMeta,
  ...metaFrom('billing', billing),
  ...metaFrom('shipping', shippingAddress),
    }

    const resp = intentId
      ? await stripe.paymentIntents.update(intentId, {
          amount: totalCents,
          currency,
          receipt_email: email || undefined,
          metadata,
        })
      : await stripe.paymentIntents.create({
          amount: totalCents,
          currency,
          automatic_payment_methods: { enabled: true },
          receipt_email: email || undefined,
          metadata,
        })

    return res.status(200).json({
      clientSecret: resp.client_secret,
      intentId: resp.id,
      totals: { subtotal, tax, total }, // dollars
      breakdown: { subtotal: subtotalCents, tax: taxCents, shipping: Math.round(shippingCents) }, // cents for UI
    })
  } catch (err: any) {
    console.error('PI error:', err)
    const msg = err?.raw?.message || err?.message || 'Stripe error'
    return res.status(500).json({ error: msg })
  }
}
