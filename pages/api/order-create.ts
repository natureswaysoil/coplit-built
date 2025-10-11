// pages/api/order-create.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string, // service role (server only)
  { auth: { persistSession: false } }
)

  const supabase = createClient(url, key, { auth: { persistSession: false } })

  const { customerId, subtotal, tax, total, items, shipping } = req.body || {}
  if (!Array.isArray(items) || typeof total !== 'number') {
    return res.status(400).json({ error: 'Missing required fields' })
  }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const {
      intentId,           // optional: Stripe PI id if you already created one
      items = [] as Item[],
      subtotal, tax, total,
      email, name,
      billing, shipping,
    } = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as {
      intentId?: string; items: Item[]; subtotal: number; tax: number; total: number;
      email?: string; name?: string; billing?: Address; shipping?: Address;
    }

    // Create order
    const { data: order, error: insErr } = await supabase
      .from('orders')
      .insert({
        customer_id: customerId || null,
        total,
        tax: typeof tax === 'number' ? tax : 0,
        shipping_state: shipping?.state ?? null,
        shipping_county: shipping?.county ?? null,
        shipping_zip: shipping?.zip ?? null,
        shipping_city: shipping?.city ?? null,
        shipping_address1: shipping?.address1 ?? null,
        shipping_address2: shipping?.address2 ?? null,
        shipping_phone: shipping?.phone ?? null,
      })
      .select('id')
      .single()

    if (insErr) throw insErr

    // Create order_items
    if (items?.length) {
      const rows = items.map(it => ({
        order_id: order.id,
        sku: it.sku,
        qty: Number(it.qty) || 0,
        price: Number(it.price) || 0,
      }))
      const { error: itemsErr } = await supabase.from('order_items').insert(rows)
      if (itemsErr) throw itemsErr
    }

    return res.status(200).json({ orderId: order.id })
  } catch (e: any) {
    console.error('order-create error:', e)
    return res.status(500).json({ error: e?.message || 'Server error' })
  }
}

