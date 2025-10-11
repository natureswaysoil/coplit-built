import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { searchParams } = new URL(req.url || 'http://localhost')
  const includeInactive = searchParams.get('include') === 'inactive'
  let query = supabase.from('products').select('id, updated_at, is_active, slug').order('updated_at', { ascending: false }).limit(500)
  if (!includeInactive) query = query.eq('is_active', true)
  const { data, error } = await query

  if (error) {
    return res.status(500).json({ ok: false, error: error.message })
  }

  return res
    .status(200)
    .setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=120')
    .json({ ok: true, count: data?.length || 0, products: data || [] })
}