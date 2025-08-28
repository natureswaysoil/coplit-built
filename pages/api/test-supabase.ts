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

    // Test basic connection with a simple query
    const { data: healthCheck, error: healthError } = await supabase
      .from('_supabase_tables')  // This is a system table that should exist
      .select('count')
      .limit(1)
      .maybeSingle()

    if (healthError && healthError.code !== 'PGRST116') { // PGRST116 is "not found" which is expected
      return res.status(500).json({
        error: 'Supabase connection failed',
        details: healthError.message,
        code: healthError.code,
        hint: 'Check if your Supabase project is active and the URL is correct'
      })
    }

    // Test if our tables exist
    const { data: ordersTest, error: ordersError } = await supabase
      .from('orders')
      .select('id')
      .limit(1)

    const { data: customersTest, error: customersError } = await supabase
      .from('customers')
      .select('id')
      .limit(1)

    const { data: orderItemsTest, error: orderItemsError } = await supabase
      .from('order_items')
      .select('id')
      .limit(1)

    return res.status(200).json({
      success: true,
      message: 'Supabase connection successful',
      tables: {
        orders: {
          exists: !ordersError,
          error: ordersError?.message || null
        },
        customers: {
          exists: !customersError,
          error: customersError?.message || null
        },
        order_items: {
          exists: !orderItemsError,
          error: orderItemsError?.message || null
        }
      },
      projectUrl: url.replace(/https?:\/\//, '').split('.')[0],
      troubleshooting: {
        step1: 'Run the database migration in Supabase SQL Editor',
        step2: 'Verify your Supabase project is active',
        step3: 'Check your environment variables are correct'
      }
    })

  } catch (err: any) {
    return res.status(500).json({
      error: 'Unexpected connection error',
      details: err?.message || String(err),
      troubleshooting: [
        '1. Check if your Supabase project is active',
        '2. Verify the project URL is correct',
        '3. Ensure the service role key is valid',
        '4. Check your internet connection',
        '5. Try restarting your development server'
      ]
    })
  }
}
