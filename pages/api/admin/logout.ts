import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Log logout for security monitoring
  const ip = (typeof req.headers['x-forwarded-for'] === 'string'
    ? req.headers['x-forwarded-for'].split(',')[0].trim()
    : Array.isArray(req.headers['x-forwarded-for']) && req.headers['x-forwarded-for'].length > 0
      ? req.headers['x-forwarded-for'][0]
      : req.socket?.remoteAddress);
  console.log(`Admin logout at ${new Date().toISOString()} from IP: ${ip}`);
  // Clear the admin session cookie
  res.setHeader('Set-Cookie', [
    'admin-session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict'
  ])

  return res.status(200).json({ 
    success: true,
    message: 'Logged out successfully'
  })
}
