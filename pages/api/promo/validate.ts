// pages/api/promo/validate.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const apiVersion = (process.env.STRIPE_API_VERSION as Stripe.LatestApiVersion | undefined) || "2024-06-20";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion } as any);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const code = String(req.query.code || "").trim();
  if (!code) return res.status(400).json({ valid: false, reason: "EMPTY" });

  try {
    const found = await stripe.promotionCodes.list({ code, active: true, limit: 1 });
    const promo = found.data[0];
    if (!promo) return res.status(200).json({ valid: false, reason: "NOT_FOUND" });
    const c = promo.coupon;
    return res.status(200).json({
      valid: true,
      coupon: {
        id: c.id,
        name: c.name,
        percent_off: c.percent_off ?? null,
        amount_off: c.amount_off ?? null,
        currency: c.currency ?? "usd",
        duration: c.duration,
      },
      promotion_code: promo.code,
    });
  } catch (e: any) {
    return res.status(500).json({ valid: false, reason: "ERROR", message: e.message });
  }
}
