// pages/api/stripe/webhook.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export const config = { api: { bodyParser: false } } // we need the raw body for signature verification

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  { auth: { persistSession: false } }
)

async function readBuffer(req: NextApiRequest): Promise<Buffer> {
  const chunks: Uint8Array[] = []
  for await (const c of req) chunks.push(typeof c === 'string' ? Buffer.from(c) : c)
  return Buffer.concat(chunks)
}

// Instantiate Stripe with a safe cast for apiVersion to avoid literal-type TS errors
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
} as any)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const sig = req.headers['stripe-signature'] as string
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET as string
  if (!whSecret) return res.status(500).send('Missing STRIPE_WEBHOOK_SECRET')

  let event: Stripe.Event
  try {
    const buf = await readBuffer(req)
    event = stripe.webhooks.constructEvent(buf, sig, whSecret)
  } catch (err: any) {
    console.error('Webhook signature verify failed:', err?.message || err)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object as Stripe.PaymentIntent
        const meta = pi.metadata || {}
        // Update existing order by pi_id; if none, insert a new order record
        const { data: existing } = await supabase
          .from('orders')
          .select('id')
          .eq('pi_id', pi.id)
          .maybeSingle()

        const payload = {
          status: 'paid',
          pi_id: pi.id,
          email: meta.email ?? null,
          name: meta.name ?? null,
          subtotal: meta.subtotal ? Number(meta.subtotal) : null,
          tax: meta.tax ? Number(meta.tax) : null,
          total: pi.amount_received ? Number((pi.amount_received / 100).toFixed(2)) : null,
          billing: {
            name: meta.billing_name, email: meta.billing_email, phone: meta.billing_phone,
            address1: meta.billing_address1, address2: meta.billing_address2,
            city: meta.billing_city, state: meta.billing_state, zip: meta.billing_zip, county: meta.billing_county,
          },
          shipping: {
            name: meta.shipping_name, email: meta.shipping_email, phone: meta.shipping_phone,
            address1: meta.shipping_address1, address2: meta.shipping_address2,
            city: meta.shipping_city, state: meta.shipping_state, zip: meta.shipping_zip, county: meta.shipping_county,
          },
          charge_id: typeof pi.latest_charge === 'string' ? pi.latest_charge : null,
        }

        if (existing?.id) {
          await supabase.from('orders').update(payload).eq('id', existing.id)
        } else {
          await supabase.from('orders').insert(payload)
        }

        // (Optional) Send confirmation email via Resend
        if (process.env.RESEND_API_KEY && meta.email) {
          try {
            await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                from: process.env.RESEND_FROM || "Nature's Way Soil <no-reply@natureswaysoil.com>",
                to: [meta.email],
                subject: `Thanks for your order ${pi.id}`,
                text: `Hi ${meta.name || ''},\n\nWe received your payment of $${(pi.amount_received/100).toFixed(2)}.\nOrder: ${pi.id}\n\n— Nature's Way Soil`,
              }),
            })
          } catch (e) {
            console.warn('Resend failed (non-fatal):', e)
          }
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent
        // Optionally record failure reason
        await supabase.from('orders').update({
          status: 'failed',
          failure_reason: pi.last_payment_error?.message || null,
        }).eq('pi_id', pi.id)
        break
      }

      default:
        // ignore other events
        break
    }
    return res.status(200).json({ received: true })
  } catch (err: any) {
    console.error('Webhook handler error:', err)
    return res.status(500).send('Webhook handler error')
  }
}
