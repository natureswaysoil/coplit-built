// @ts-nocheck
import Stripe from '../../lib/stripe-node-mock'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const secret = process.env.STRIPE_SECRET_KEY
  if (!secret) return res.status(500).json({ error: 'Missing STRIPE_SECRET_KEY' })

  try {
    const stripe = new Stripe(secret)

    const { currency = 'usd', email, name, items = [], shipping } = req.body || {}

    const subtotal = Array.isArray(items)
      ? items.reduce((s, it) => s + Number(it.price || 0) * Number(it.qty || 0), 0)
      : 0
    const baseRate = Number(process.env.NEXT_PUBLIC_NC_TAX_RATE || 0.0475)
    let countyRates: Record<string, number> = {}
    if (process.env.NEXT_PUBLIC_NC_COUNTY_RATES) {
      try {
        countyRates = JSON.parse(process.env.NEXT_PUBLIC_NC_COUNTY_RATES)
      } catch {}
    }
    const norm = (s: string) => s.trim().toLowerCase()
    const countyRate =
      shipping?.state === 'NC' && shipping?.county
        ? countyRates[norm(shipping.county)] || 0
        : 0
    const tax = shipping?.state === 'NC' ? subtotal * (baseRate + countyRate) : 0
    const total = subtotal + tax

    const amt = Math.round(total * 100)
    if (!Number.isFinite(amt) || amt < 50) return res.status(400).json({ error: 'Invalid amount (min 50¢)' })

    const pi = await stripe.paymentIntents.create({
      amount: amt,
      currency,
      payment_method_types: ['card', 'link'],   // stay on-site with Link + card
      receipt_email: email || undefined,
      metadata: {
        order_name: String(name ?? '').slice(0, 120),
        order_email: String(email ?? '').slice(0, 120),
        items: items ? JSON.stringify(items).slice(0, 450) : '',
        tax: tax.toFixed(2),
        subtotal: subtotal.toFixed(2),
      },
      shipping: shipping?.address1
        ? {
            name: name || email || 'Customer',
            phone: shipping.phone || undefined,
            address: {
              line1: shipping.address1,
              line2: shipping.address2 || undefined,
              city: shipping.city,
              state: shipping.state,
              postal_code: shipping.zip,
              country: 'US',
            },
          }
        : undefined,
    })

    return res.status(200).json({ clientSecret: pi.client_secret, subtotal, tax, total })
  } catch (err) {
    return res.status(500).json({ error: err?.message || 'Stripe error' })
  }
}

