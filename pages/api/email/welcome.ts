import type { NextApiRequest, NextApiResponse } from 'next'
import { sendWelcomeEmail } from '@/lib/resend_client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, firstName } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    // Send welcome email (server-side only)
    const result = await sendWelcomeEmail(email, firstName)

    if (result.success) {
      return res.status(200).json({ success: true, data: result.data })
    } else {
      return res.status(500).json({ success: false, error: result.error })
    }
  } catch (error: any) {
    console.error('Welcome email API error:', error)
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to send welcome email' 
    })
  }
}
