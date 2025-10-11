import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import { normalizeFromRow } from '@/lib/productNormalizer'
import { fetchActiveAlertSubscribers, buildLowInventoryEmail, sendEmail, markNotified, signUnsubscribeToken } from '@/lib/alertEmails'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (!process.env.ADMIN_API_TOKEN) return res.status(500).json({ error: 'ADMIN_API_TOKEN not set' })
  if (req.headers['x-admin-token'] !== process.env.ADMIN_API_TOKEN) return res.status(401).json({ error: 'Unauthorized' })
  const { id, ...payload } = req.body || {}
  if (!id) return res.status(400).json({ error: 'Missing id' })
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return res.status(500).json({ error: 'Server misconfigured' })

  const supabaseAdmin = createClient(url, key, { auth: { persistSession: false } })
  const { data, error } = await supabaseAdmin.from('products').update(payload).eq('id', id).select('*').limit(1)
  if (error) return res.status(500).json({ error: error.message })
  if (!data || !data.length) return res.status(404).json({ error: 'Not found' })
  const product = normalizeFromRow(data[0] as any)
  // If inventory changed and is low, trigger alerts (fire and forget)
  try {
    if (payload.inventory !== undefined) {
      const inventory = payload.inventory
  const productIdNum = Number(product.id)
  const subs = await fetchActiveAlertSubscribers(productIdNum, inventory)
      const notifiedIds: number[] = []
      for (const sub of subs as any[]) {
        if (inventory == null || inventory <= (sub.threshold ?? 5)) {
          const token = signUnsubscribeToken(sub.id, sub.email)
          const { subject, html } = buildLowInventoryEmail({ email: sub.email, threshold: sub.threshold, token }, {
            product_id: productIdNum,
            product_title: product.title,
            current_inventory: inventory,
            threshold: sub.threshold
          })
            // do not block response if email fails
          sendEmail(sub.email, subject, html).then(()=>{ notifiedIds.push(sub.id) }).catch(()=>{})
        }
      }
      if (notifiedIds.length) markNotified(notifiedIds).catch(()=>{})
    }
  } catch (e) {
    console.error('Alert email dispatch error', e)
  }
  return res.status(200).json({ ok: true, product })
}