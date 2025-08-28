import type { NextApiRequest, NextApiResponse } from 'next';

// Simple proxy to fetch remote images so the client can OCR without CORS issues
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const src = req.query.src;
  if (!src || typeof src !== 'string') {
    res.status(400).json({ error: 'Missing src' });
    return;
  }
  try {
    const resp = await fetch(src);
    if (!resp.ok) {
      res.status(resp.status).json({ error: `Upstream error ${resp.status}` });
      return;
    }
    const contentType = resp.headers.get('content-type') || 'application/octet-stream';
    const arrayBuffer = await resp.arrayBuffer();
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(Buffer.from(arrayBuffer));
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Proxy failed' });
  }
}
