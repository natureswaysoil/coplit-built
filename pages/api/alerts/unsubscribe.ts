import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import { verifyUnsubscribeToken } from '@/lib/alertEmails'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).send('Method not allowed')
  const { token } = req.query
  if (!token || typeof token !== 'string') return res.status(400).send('Missing token')
  const decoded = verifyUnsubscribeToken(token)
  if (!decoded) return res.status(400).send('Invalid token')
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return res.status(500).send('Server misconfigured')
  const client = createClient(url, key, { auth: { persistSession: false } })
  const { error } = await client.from('inventory_alert_subscriptions').update({ is_active: false }).eq('id', decoded.id).eq('email', decoded.email)
  if (error) return res.status(500).send('Failed to unsubscribe')
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.status(200).send(`<html><body style="font-family:Arial,sans-serif;padding:40px;max-width:560px;margin:0 auto;">\n<h2 style='color:#174F2E;margin-top:0'>Unsubscribed</h2><p>You will no longer receive inventory alerts for this subscription.</p><a href='/' style='color:#174F2E'>Return to site</a></body></html>`) 
}
