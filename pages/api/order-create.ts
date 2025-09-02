// pages/api/order-create.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string, // service role (server only)
  { auth: { persistSession: false } }
)

type Item = { sku: string; qty: number; price: number }
type Address = {
  name?: string; email?: string; phone?: string;
  address1?: string; address2?: string; city?: string; state?: string; zip?: string; county?: string;
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
        status: 'pending',
        pi_id: intentId || null,
        email, name,
        subtotal: Number(subtotal) || 0,
        tax: Number(tax) || 0,
        total: Number(total) || 0,
        billing,
        shipping,
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

