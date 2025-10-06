import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

type ResponseData = {
  success?: boolean
  error?: string
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body

  // Validate email
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' })
  }

  try {
    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    const filePath = path.join(dataDir, 'coupon-signups.csv')
    const timestamp = new Date().toISOString()
    const couponCode = 'WELCOME15'

    // Helper to sanitize email for CSV injection
    function sanitizeForCSV(value: string): string {
      // If value starts with =, +, -, or @, prefix with a single quote
      if (/^[=+\-@]/.test(value)) {
        return "'" + value;
      }
      return value;
    }
    
    // Check if file exists to determine if we need headers
    const fileExists = fs.existsSync(filePath)
    
    // Prepare CSV row
    const sanitizedEmail = sanitizeForCSV(email)
    const csvRow = `"${sanitizedEmail}","${timestamp}","${couponCode}"\n`
    
    // If file doesn't exist, add headers
    if (!fileExists) {
      const headers = 'Email,Timestamp,Coupon Code\n'
      fs.writeFileSync(filePath, headers + csvRow)
    } else {
      // Check if email already exists
      const existingData = fs.readFileSync(filePath, 'utf-8')
      // Check for duplicate email by parsing the CSV and comparing only the email column
      const lines = existingData.split('\n').filter(line => line.trim() !== '');
      // Skip header
      let duplicate = false;
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i];
        // Split CSV row, handling quoted fields
        const match = row.match(/^"([^"]*)","[^"]*","[^"]*"$/);
        if (match && match[1] === email) {
          duplicate = true;
          break;
        }
      }
      if (duplicate) {
        return res.status(200).json({ 
          success: true, 
          message: 'You are already subscribed! Check your email for the coupon code.' 
        })
      }
      
      // Append new row
      fs.appendFileSync(filePath, csvRow)
    }

    // Here you would typically send an email with the coupon code
    // For now, we'll just return success
    // You can integrate with your email service (Resend, SendGrid, etc.)
    
    // Optional: Send email using existing email service
    try {
      // Check if email service is configured
      if (process.env.RESEND_API_KEY) {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || 'Nature\'s Way Soil <noreply@natureswaysoil.com>',
            to: email,
            subject: 'Your 15% Off Coupon Code - Welcome to Nature\'s Way Soil!',
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 32px;">Welcome to Nature's Way Soil!</h1>
                  </div>
                  
                  <div style="background: #f9fafb; padding: 40px 30px; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #059669; margin-top: 0;">Your Exclusive 15% Off Coupon</h2>
                    
                    <p style="font-size: 16px;">Thank you for joining our community of gardeners and soil health enthusiasts!</p>
                    
                    <div style="background: white; border: 3px dashed #059669; padding: 30px; text-align: center; margin: 30px 0; border-radius: 10px;">
                      <p style="margin: 0 0 10px 0; font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Your Coupon Code</p>
                      <p style="margin: 0; font-size: 36px; font-weight: bold; color: #059669; letter-spacing: 2px;">${couponCode}</p>
                      <p style="margin: 20px 0 0 0; font-size: 14px; color: #666;">Use this code at checkout to save 15% on your first order</p>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${process.env.PUBLIC_SITE_URL || 'https://natureswaysoil.com'}/products" style="display: inline-block; background: #059669; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Shop Now</a>
                    </div>
                    
                    <div style="background: #ecfdf5; border-left: 4px solid #059669; padding: 20px; margin: 30px 0; border-radius: 5px;">
                      <h3 style="margin-top: 0; color: #059669; font-size: 18px;">Why Choose Nature's Way Soil?</h3>
                      <ul style="margin: 0; padding-left: 20px;">
                        <li style="margin-bottom: 10px;">Science-backed organic formulas</li>
                        <li style="margin-bottom: 10px;">Safe for kids, pets, and pollinators</li>
                        <li style="margin-bottom: 10px;">Restores beneficial soil microbes</li>
                        <li style="margin-bottom: 10px;">Sustainable and environmentally friendly</li>
                      </ul>
                    </div>
                    
                    <p style="font-size: 14px; color: #666; margin-top: 30px;">
                      Questions? Reply to this email or visit our <a href="${process.env.PUBLIC_SITE_URL || 'https://natureswaysoil.com'}/contact" style="color: #059669;">contact page</a>.
                    </p>
                    
                    <p style="font-size: 14px; color: #666; margin-top: 20px;">
                      Happy gardening!<br>
                      <strong>The Nature's Way Soil Team</strong>
                    </p>
                  </div>
                  
                  <div style="text-align: center; padding: 20px; font-size: 12px; color: #999;">
                    <p>You received this email because you signed up for our 15% off coupon at Nature's Way Soil.</p>
                    <p>Nature's Way Soil | Bringing Life Back to Your Soil</p>
                  </div>
                </body>
              </html>
            `,
          }),
        })

        if (!emailResponse.ok) {
          console.error('Failed to send email:', await emailResponse.text())
        }
      }
    } catch (emailError) {
      console.error('Error sending email:', emailError)
      // Don't fail the request if email fails
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Success! Check your email for your 15% off coupon code.' 
    })
  } catch (error) {
    console.error('Error saving coupon signup:', error)
    return res.status(500).json({ error: 'Failed to process signup. Please try again.' })
  }
}
