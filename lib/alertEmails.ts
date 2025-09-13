import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

// Very lightweight email sender placeholder. In production integrate a provider (Resend, Postmark, SES, etc.)
// This just logs to console unless MAIL_PROVIDER_WEBHOOK or RESEND_API_KEY is present (extend as needed).

export interface LowInventoryContext {
  product_id: number
  product_title: string
  current_inventory: number | null
  threshold: number
}

export function buildLowInventoryEmail(sub: { email: string; threshold: number; token?: string }, ctx: LowInventoryContext) {
  const host = process.env.PUBLIC_SITE_URL || 'https://natureswaysoil.com'
  const unsubscribe = sub.token ? `${host}/api/alerts/unsubscribe?token=${encodeURIComponent(sub.token)}` : ''
  const subject = `Low inventory: ${ctx.product_title}`
  const html = `<!doctype html><html><body style="font-family:Arial,sans-serif;">
    <h2 style="color:#174F2E;margin:0 0 12px;">Inventory Alert</h2>
    <p>The product <b>${escape(ctx.product_title)}</b> is at <b>${ctx.current_inventory ?? 'unknown'}</b> units (threshold ${sub.threshold}).</p>
    <p style="font-size:12px;color:#555">Subscription threshold: ${sub.threshold}</p>
    <p><a href="https://natureswaysoil.com/products/${ctx.product_id}" style="background:#174F2E;color:#fff;padding:8px 12px;border-radius:6px;text-decoration:none;font-size:14px;display:inline-block">View Product</a></p>
    <p style="font-size:12px;color:#64748b;">You receive this email because you subscribed to low inventory alerts.${unsubscribe ? ` <a href='${unsubscribe}' style='color:#174F2E'>Unsubscribe</a>` : ''}</p>
  </body></html>`
  return { subject, html }
}

export async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.log('[email:mock] to=%s subject=%s bytes=%d', to, subject, html.length)
    return { id: 'mock-id' }
  }
  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ from: process.env.RESEND_FROM || 'alerts@natureswaysoil.com', to: [to], subject, html })
  })
  if (!resp.ok) {
    const text = await resp.text()
    console.error('Resend error', resp.status, text)
    throw new Error('Email send failed')
  }
  return resp.json()
}

function escape(s: string) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
}

export async function fetchActiveAlertSubscribers(productId: number | null, inventory: number | null) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase env missing')
  const client = createClient(url, key, { auth: { persistSession: false } })
  // Get subscriptions that are active AND (product-specific OR global) and threshold >= current inventory
  let query = client.from('inventory_alert_subscriptions').select('*').eq('is_active', true)
  if (productId) query = query.or(`product_id.eq.${productId},product_id.is.null`)
  const { data, error } = await query
  if (error) throw error
  const cooldownMin = Number(process.env.ALERT_COOLDOWN_MINUTES || 180)
  const now = Date.now()
  return (data || []).filter((sub: any) => {
    if (inventory == null) return true
    if (inventory > (sub.threshold ?? 5)) return false
    if (sub.last_notified) {
      const diffMin = (now - new Date(sub.last_notified).getTime()) / 60000
      if (diffMin < cooldownMin) return false
    }
    return true
  })
}

export async function markNotified(subscriptionIds: number[]) {
  if (!subscriptionIds.length) return
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return
  const client = createClient(url, key, { auth: { persistSession: false } })
  await client.from('inventory_alert_subscriptions').update({ last_notified: new Date().toISOString() }).in('id', subscriptionIds)
}

// Generate a short-lived token for unsubscribe links (HMAC of id+email+secret)
export function signUnsubscribeToken(id: number, email: string) {
  const secret = process.env.ALERT_UNSUBSCRIBE_SECRET || process.env.REVALIDATE_SECRET || 'dev-secret'
  const payload = `${id}:${email}`
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  return Buffer.from(`${payload}:${sig}`).toString('base64url')
}

export function verifyUnsubscribeToken(token: string) {
  try {
    const raw = Buffer.from(token, 'base64url').toString('utf8')
    const [id, email, sig] = raw.split(':')
    if (!id || !email || !sig) return null
    const secret = process.env.ALERT_UNSUBSCRIBE_SECRET || process.env.REVALIDATE_SECRET || 'dev-secret'
    const expected = crypto.createHmac('sha256', secret).update(`${id}:${email}`).digest('hex')
    if (expected !== sig) return null
    return { id: Number(id), email }
  } catch { return null }
}
