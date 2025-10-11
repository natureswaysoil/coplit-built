
import type { NextApiRequest, NextApiResponse } from 'next'
import { captureEmail } from '../../lib/supabase_client'
import { sendWelcomeEmail } from '../../lib/resend_client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, source, metadata, couponCode } = req.body

    if (!email || !source) {
      return res.status(400).json({ error: 'Email and source are required' })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    // Add coupon code to metadata if provided
    const enrichedMetadata = {
      ...metadata,
      couponCode: couponCode || null
    }

    // Capture to Supabase
    const captureResult = await captureEmail(email, source, enrichedMetadata)

    if (!captureResult.success) {
      throw new Error('Failed to capture email')
    }

    // Send welcome email with coupon code (don't wait for it)
    sendWelcomeEmail(email, couponCode).catch(err => {
      console.error('Failed to send welcome email:', err)
    })

    return res.status(200).json({ 
      success: true,
      message: 'Email captured successfully',
      couponCode: couponCode || null
    })
  } catch (error: any) {
    console.error('Email capture error:', error)
    return res.status(500).json({ 
      error: 'Failed to capture email',
      details: error.message 
    })
  }
}
