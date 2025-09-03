import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
} as any)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { pi } = req.query

  if (!pi || typeof pi !== 'string') {
    return res.status(400).json({ error: 'Payment Intent ID required' })
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe not configured' })
  }

  try {
    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(pi)
    
    return res.status(200).json({
      status: paymentIntent.status,
      details: {
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        receipt_email: paymentIntent.receipt_email,
        created: paymentIntent.created,
        description: paymentIntent.description,
        last_payment_error: paymentIntent.last_payment_error?.message
      }
    })
  } catch (error: any) {
    console.error('Payment verification error:', error)
    
    if (error.type === 'StripeInvalidRequestError') {
      return res.status(404).json({ error: 'Payment not found' })
    }
    
    return res.status(500).json({ error: 'Unable to verify payment' })
  }
}
