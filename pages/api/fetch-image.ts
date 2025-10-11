import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';

// Proxy to serve both local and remote images for OCR without CORS issues
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const src = req.query.src;
  if (!src || typeof src !== 'string') {
    res.status(400).json({ error: 'Missing src' });
    return;
  }
  
  try {
    // Check if it's a local image (starts with /)
    if (src.startsWith('/')) {
      const imagePath = path.join(process.cwd(), 'public', src);
      
      // Security check - ensure the path is within public directory
      if (!imagePath.startsWith(path.join(process.cwd(), 'public'))) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }
      
      // Check if file exists
      if (!fs.existsSync(imagePath)) {
        res.status(404).json({ error: 'Image not found' });
        return;
      }
      
      // Read and serve local file
      const imageBuffer = fs.readFileSync(imagePath);
      const ext = path.extname(imagePath).toLowerCase();
      let contentType = 'application/octet-stream';
      
      if (ext === '.png') contentType = 'image/png';
      else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
      else if (ext === '.gif') contentType = 'image/gif';
      else if (ext === '.webp') contentType = 'image/webp';
      
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send(imageBuffer);
      return;
    }
    
    // Handle remote images
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
