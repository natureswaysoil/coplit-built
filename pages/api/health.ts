// pages/api/health.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ ok: true, status: 'healthy', ts: Date.now() });
}

// no-op change to trigger Vercel preview deployment
