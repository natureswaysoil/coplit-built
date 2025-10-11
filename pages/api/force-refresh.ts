import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const timestamp = new Date().toISOString()
  return res.status(200).json({
    message: 'Force refresh triggered',
    timestamp,
    env: process.env.VERCEL_ENV || process.env.NODE_ENV || 'unknown',
    // This will force a new deployment and environment refresh
  })
}
