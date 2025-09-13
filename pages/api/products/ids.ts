import type { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export const config = { runtime: 'edge' }

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const includeInactive = searchParams.get('include') === 'inactive'
  let query = supabase.from('products').select('id, updated_at, is_active, slug').order('updated_at', { ascending: false }).limit(500)
  if (!includeInactive) query = query.eq('is_active', true)
  const { data, error } = await query

  if (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), { status: 500 })
  }

  return new Response(JSON.stringify({ ok: true, count: data?.length || 0, products: data || [] }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120'
    }
  })
}