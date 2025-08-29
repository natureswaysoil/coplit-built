
 import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    ok: !!process.env.STRIPE_SECRET_KEY && !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    hasSecret: !!process.env.STRIPE_SECRET_KEY,
    hasPublishable: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  })
}
