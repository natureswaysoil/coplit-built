import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    return res.status(500).json({
      error: 'Missing environment variables',
      hasUrl: !!url,
      hasKey: !!key,
      keyPreview: key ? `${key.substring(0, 10)}...` : 'NOT SET'
    })
  }

  try {
    const supabase = createClient(url, key, { auth: { persistSession: false } })

    // Test basic connection
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(5)

    if (tableError) {
      return res.status(500).json({
        error: 'Database connection failed',
        details: tableError.message,
        code: tableError.code
      })
    }

    // Test orders table
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id')
      .limit(1)

    return res.status(200).json({
      success: true,
      message: 'Supabase connection successful',
      tables: tables?.map(t => t.table_name) || [],
      ordersTableExists: !ordersError,
      ordersError: ordersError?.message || null,
      keyLength: key.length
    })

  } catch (err: any) {
    return res.status(500).json({
      error: 'Unexpected error',
      details: err?.message || String(err)
    })
  }
}
