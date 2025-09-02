// pages/api/create-payment-intent.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

// Optional: keep a price list on the server so you don't trust client prices
const PRICE_BY_SKU: Record<string, number> = {
  // dollars; fill in your SKUs
  'SEAWEED-HUMIC-32OZ': 29.99,
  'BONE-MEAL-LIQ-1GAL': 39.99,
  // ...
}

// ---- NC tax helpers (county rates come from env JSON; fallback to 0)
const countyRates: Record<string, number> = (() => {
  try {
    return JSON.parse(process.env.NEXT_PUBLIC_NC_COUNTY_RATES || '{}')
  } catch {
    return {}
  }
})()

const norm = (s: string) => (s || '').trim().toLowerCase()

function calcTotals(
  items: Array<{ sku: string; qty: number; price?: number }>,
  state: 'NC' | 'Other',
  county?: string
) {
  // Subtotal from server truth if available; else trust client but coerce
  let subtotal = 0
  for (const it of items || []) {
    const unit = Number.isFinite(PRICE_BY_SKU[it.sku])
      ? PRICE_BY_SKU[it.sku]
      : Number(it.price)
    if (!Number.isFinite(unit) || !Number.isFinite(it.qty)) continue
    subtotal += unit * it.qty
  }
  subtotal = Math.max(0, Number(subtotal.toFixed(2)))

  const baseNc = Number(process.env.NEXT_PUBLIC_NC_TAX_RATE ?? 0.0475) || 0
  const countyRate = state === 'NC' ? (countyRates[norm(county || '')] || 0) : 0
  const tax = Number((subtotal * (state === 'NC' ? baseNc + countyRate : 0)).toFixed(2))
  const total = Number((subtotal + tax).toFixed(2))
  const totalCents = Math.round(total * 100)

  if (!Number.isFinite(totalCents) || totalCents < 50) {
    throw new Error('Bad total after tax (must be ≥ $0.50)')
  }
  return { subtotal, tax, total, totalCents }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const secret = process.env.STRIPE_SECRET_KEY
  if (!secret) return res.status(500).json({ error: 'Missing STRIPE_SECRET_KEY' })

  const stripe = new Stripe(secret) // don't hard-code apiVersion

  try {
    const {
      intentId,                // optional: update an existing PI when address/tax changes
      items = [],
      billing,
      shipping,
      state = 'Other',
      county = '',
      email = '',
      name = '',
      currency = 'usd'
    } = (req.body || {}) as any

    const { subtotal, tax, total, totalCents } = calcTotals(items, state, county)

    // Create or update the PaymentIntent so amount always matches current tax math
    const intent = intentId
      ? await stripe.paymentIntents.update(intentId, {
          amount: totalCents,
          currency,
          metadata: {
            email, name,
            subtotal: subtotal.toFixed(2),
            tax: tax.toFixed(2),
            total: total.toFixed(2),
            state, county
          }
        })
      : await stripe.paymentIntents.create({
          amount: totalCents,
          currency,
          automatic_payment_methods: { enabled: true },
          receipt_email: email || undefined,
          metadata: {
            email, name,
            subtotal: subtotal.toFixed(2),
            tax: tax.toFixed(2),
            total: total.toFixed(2),
            state, county
          }
        })

    return res.status(200).json({ clientSecret: intent.client_secret, intentId: intent.id, totals: { subtotal, tax, total } })
  } catch (err: any) {
    console.error('PI error:', err)
    return res.status(500).json({ error: err?.message || 'Stripe error' })
  }
}
