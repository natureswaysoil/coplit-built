// pages/api/promo/suggest.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const apiVersion = (process.env.STRIPE_API_VERSION as Stripe.LatestApiVersion | undefined) || "2024-06-20";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const q = String(req.query.q || "").trim().toLowerCase();
  const limit = Math.max(1, Math.min(50, Number(process.env.STRIPE_PROMO_SUGGEST_LIMIT || 10)));

  try {
    const list = await stripe.promotionCodes.list({ active: true, limit: 100 });
    const filtered = list.data
      .map(pc => pc.code || "")
      .filter(code => code.toLowerCase().includes(q))
      .slice(0, limit);
    return res.status(200).json({ suggestions: filtered });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
