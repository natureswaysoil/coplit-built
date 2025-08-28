import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return res.status(501).json({ error: 'Server email/db not configured' })

  const supabase = createClient(url, key, { auth: { persistSession: false } })

  const { customerId, subtotal, tax, total, items, shipping } = req.body || {}
  if (!customerId || !Array.isArray(items) || typeof total !== 'number') {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        customer_id: customerId,
        total,
        tax: tax ?? 0,
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

    if (orderErr) return res.status(500).json({ error: 'Failed to create order', details: orderErr })

    const orderId = order.id
    const payload = (items as any[]).map(it => ({ order_id: orderId, sku: it.sku, qty: it.qty, price: it.price }))
    const { error: itemsErr } = await supabase.from('order_items').insert(payload)
    if (itemsErr) return res.status(500).json({ error: 'Failed to create order items', details: itemsErr })

    return res.status(200).json({ orderId })
  } catch (err: any) {
    return res.status(500).json({ error: 'Unexpected error', details: err?.message || String(err) })
  }
}
