import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

// Returns summary analytics:
// - total_events (all time)
// - last_7d_events
// - events_by_type (array of { event_type, total, last_7d })
// - top_products (by event count last 7d, if product_id present)
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  if (req.headers['x-admin-token'] !== process.env.ADMIN_API_TOKEN) return res.status(401).json({ error: 'Unauthorized' })
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return res.status(500).json({ error: 'Server misconfigured' })
  const supabaseAdmin = createClient(url, key, { auth: { persistSession: false } })

  const now = new Date()
  const since7 = new Date(now.getTime() - 7*24*60*60*1000).toISOString()

  // total events
  const { count: totalEvents, error: totalErr } = await supabaseAdmin.from('analytics_events').select('*', { count: 'exact', head: true })
  if (totalErr) return res.status(500).json({ error: totalErr.message })

  // last 7d events
  const { count: last7dEvents, error: lastErr } = await supabaseAdmin.from('analytics_events').select('*', { count: 'exact', head: true }).gte('created_at', since7)
  if (lastErr) return res.status(500).json({ error: lastErr.message })

  // events by type total
  const { data: byTypeData, error: typeErr } = await supabaseAdmin.rpc('analytics_events_by_type_total')
  // If RPC not present fall back to manual aggregate queries
  let eventsByType: any[] = []
  if (!typeErr && byTypeData) {
    eventsByType = byTypeData as any[]
  } else {
    // fallback manual aggregation
    const { data: manual, error: manualErr } = await supabaseAdmin.from('analytics_events')
      .select('event_type')
    if (manualErr) return res.status(500).json({ error: manualErr.message })
    const counts: Record<string, number> = {}
    manual.forEach(r => { counts[r.event_type] = (counts[r.event_type]||0)+1 })
    eventsByType = Object.entries(counts).map(([event_type, total]) => ({ event_type, total, last_7d: null }))
  }

  // attach last 7d per type
  const { data: lastWindow, error: lastWinErr } = await supabaseAdmin.from('analytics_events')
    .select('event_type, created_at')
    .gte('created_at', since7)
  if (lastWinErr) return res.status(500).json({ error: lastWinErr.message })
  const lastCounts: Record<string, number> = {}
  lastWindow.forEach(r => { lastCounts[r.event_type] = (lastCounts[r.event_type]||0)+1 })
  eventsByType = eventsByType.map(row => ({ ...row, last_7d: lastCounts[row.event_type] || 0 }))

  // top products last 7d
  const { data: prodWindow, error: prodErr } = await supabaseAdmin.from('analytics_events')
    .select('product_id')
    .not('product_id', 'is', null)
    .gte('created_at', since7)
  if (prodErr) return res.status(500).json({ error: prodErr.message })
  const prodCounts: Record<string, number> = {}
  prodWindow.forEach(r => { prodCounts[r.product_id] = (prodCounts[r.product_id]||0)+1 })
  const topProducts = Object.entries(prodCounts)
    .sort((a,b)=> b[1]-a[1])
    .slice(0,10)
    .map(([product_id, count]) => ({ product_id, last_7d: count }))

  return res.status(200).json({
    ok: true,
    total_events: totalEvents || 0,
    last_7d_events: last7dEvents || 0,
    events_by_type: eventsByType,
    top_products: topProducts
  })
}
