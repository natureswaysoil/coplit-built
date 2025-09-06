// pages/api/promo/suggest.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { getSecretKey, STRIPE_API_VERSION } from "../../../lib/stripeConfig";

const stripe = new Stripe(getSecretKey().key, { apiVersion: STRIPE_API_VERSION as any });

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
