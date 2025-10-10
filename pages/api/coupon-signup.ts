import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = { success?: boolean; error?: string; message?: string }

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Temporarily disabled to ensure a clean deploy while debugging preview 404s
  res.status(410).json({ error: 'Temporarily disabled. Please try again later.' })
}
