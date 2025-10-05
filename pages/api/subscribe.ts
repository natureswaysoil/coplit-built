import type { NextApiRequest, NextApiResponse } from 'next';
import { getServiceSupabase } from '../../lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, source = 'website' } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    // Save to Supabase
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from('email_subscribers')
      .insert([{ email, source }])
      .select()
      .single();

    if (error) {
      // Check if email already exists
      if (error.code === '23505') {
        return res.status(200).json({ 
          message: 'You are already subscribed!',
          alreadySubscribed: true 
        });
      }
      throw error;
    }

    // Send welcome email via Resend
    try {
      await resend.emails.send({
        from: 'Nature\'s Way Soil <hello@natureswaysoil.com>',
        to: email,
        subject: '🌱 Welcome to Nature\'s Way Soil Family!',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #2d5016 0%, #4a7c2c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .tip { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #4a7c2c; }
                .cta { background: #4a7c2c; color: white; padding: 15px 30px; text-decoration: none; display: inline-block; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🌱 Welcome to Nature's Way!</h1>
                  <p>Your journey to healthier soil starts here</p>
                </div>
                <div class="content">
                  <h2>Thank you for joining our community!</h2>
                  <p>We're excited to help you transform your soil and grow healthier plants naturally.</p>
                  
                  <h3>🌿 Quick Soil Health Tips:</h3>
                  
                  <div class="tip">
                    <strong>1. Feed the Soil, Not Just the Plants</strong>
                    <p>Healthy soil is alive with beneficial microorganisms. Our products nurture these tiny helpers that make nutrients available to your plants.</p>
                  </div>
                  
                  <div class="tip">
                    <strong>2. Avoid Synthetic Fertilizers</strong>
                    <p>Chemical fertilizers can harm beneficial soil life. They provide a quick fix but damage long-term soil health.</p>
                  </div>
                  
                  <div class="tip">
                    <strong>3. Build Organic Matter</strong>
                    <p>Compost, mulch, and organic amendments improve soil structure, water retention, and nutrient availability.</p>
                  </div>
                  
                  <a href="https://natureswaysoil.com/products" class="cta">Shop Our Products</a>
                  
                  <p><strong>Special Welcome Offer:</strong> Use code <strong>WELCOME10</strong> for 10% off your first order!</p>
                  
                  <p>Have questions? Our educational chat widget on the website can answer all your soil health questions!</p>
                </div>
                <div class="footer">
                  <p>Nature's Way Soil - Growing Naturally Since Day One</p>
                  <p>You're receiving this because you subscribed at natureswaysoil.com</p>
                </div>
              </div>
            </body>
          </html>
        `,
      });
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Don't fail the request if email fails
    }

    return res.status(200).json({ 
      message: 'Successfully subscribed! Check your email for a welcome message.',
      success: true 
    });

  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({ error: 'Failed to subscribe. Please try again.' });
  }
}
