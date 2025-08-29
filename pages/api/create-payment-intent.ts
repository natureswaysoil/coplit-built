import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const secret = process.env.STRIPE_SECRET_KEY
  if (!secret) return res.status(500).json({ error: 'Missing STRIPE_SECRET_KEY' })

  try {
    // ❌ remove the apiVersion option completely
    const stripe = new Stripe(secret)

    const { amount, currency = 'usd', email, name, items, shipping, billingSame, billing, isCents = false } = (req.body || {}) as any
    const amt = isCents ? Math.floor(amount) : Math.round(Number(amount) * 100)
    if (!Number.isFinite(amt) || amt < 50) return res.status(400).json({ error: 'Invalid amount (min 50¢)' })

    const pi = await stripe.paymentIntents.create({
      amount: amt,
      currency,
      payment_method_types: ['card', 'link'],
      receipt_email: email || undefined,
      metadata: {
        order_name: (name ?? '').toString().slice(0, 120),
        order_email: (email ?? '').toString().slice(0, 120),
        billing_same: String(!!billingSame),
        items: items ? JSON.stringify(items).slice(0, 450) : '',
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

    return res.status(200).json({ clientSecret: pi.client_secret })
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Stripe error' })
  }
}
# rename the file with spaces to the correct filename
git mv "pages/api/create-payment-intent.ts and health.ts" pages/api/create-payment-intent.ts 2>/dev/null || \
mv "pages/api/create-payment-intent.ts and health.ts" pages/api/create-payment-intent.ts

# create a clean, Stripe-free health route
cat > pages/api/health.ts <<'TS'
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    ok: !!process.env.STRIPE_SECRET_KEY && !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    hasSecret: !!process.env.STRIPE_SECRET_KEY,
    hasPublishable: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  })
}
TS

