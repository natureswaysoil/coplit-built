// @ts-nocheck
export default function handler(_req, res) {
  res.status(200).json({
    ok: !!process.env.STRIPE_SECRET_KEY && !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    hasSecret: !!process.env.STRIPE_SECRET_KEY,
    hasPublishable: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  })
}
