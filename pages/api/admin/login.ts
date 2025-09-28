import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { password } = req.body

  if (!password) {
    return res.status(400).json({ error: 'Password is required' })
  }

  // Get admin password from environment
  const adminPassword = process.env.ADMIN_PASSWORD
  
  if (!adminPassword) {
    console.error('ADMIN_PASSWORD environment variable not set')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  // Simple constant-time comparison to prevent timing attacks
  const providedHash = crypto.createHash('sha256').update(password).digest('hex')
  const expectedHash = crypto.createHash('sha256').update(adminPassword).digest('hex')
  
  // Use constant-time comparison to prevent timing attacks
  const providedBuffer = Buffer.from(providedHash, 'hex')
  const expectedBuffer = Buffer.from(expectedHash, 'hex')
  if (
    providedBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    // Add a small delay to prevent brute force attacks
    await new Promise(resolve => setTimeout(resolve, 1000))
    return res.status(401).json({ error: 'Invalid password' })
  }

  // Log successful admin login (for security monitoring)
  const ip = (typeof req.headers['x-forwarded-for'] === 'string'
    ? req.headers['x-forwarded-for'].split(',')[0].trim()
    : req.socket?.remoteAddress);
  console.log(`Admin login successful at ${new Date().toISOString()} from IP: ${ip}`);

  return res.status(200).json({ 
    success: true,
    message: 'Login successful',
    timestamp: Date.now()
  })
}
