// pages/api/supabase-status.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  // Basic environment check
  const envStatus = {
    hasUrl: !!url,
    hasKey: !!key,
    urlFormat: url ? url.includes('.supabase.co') : false,
    urlPreview: url ? url.substring(0, 30) + '...' : 'NOT SET',
    keyPreview: key ? key.substring(0, 20) + '...' : 'NOT SET'
  }

  // Try a simple fetch to the Supabase URL
  let networkTest = null
  if (url) {
    try {
      const response = await fetch(`${url}/rest/v1/`, {
        method: 'GET',
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`,
        },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      })
      networkTest = {
        reachable: response.status < 500,
        status: response.status,
        statusText: response.statusText
      }
    } catch (error: any) {
      networkTest = {
        reachable: false,
        error: error.message,
        type: error.name
      }
    }
  }

  return res.status(200).json({
    timestamp: new Date().toISOString(),
    environment: envStatus,
    network: networkTest,
    recommendations: {
      if_network_failed: [
        '1. Check Supabase status at status.supabase.com',
        '2. Verify your project is active in Supabase dashboard',
        '3. Check if your project URL changed',
        '4. Try refreshing your API keys'
      ],
      if_env_missing: [
        '1. Add NEXT_PUBLIC_SUPABASE_URL to .env.local',
        '2. Add NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local', 
        '3. Add SUPABASE_SERVICE_ROLE_KEY to .env.local',
        '4. Restart your development server'
      ]
    }
  })
}
