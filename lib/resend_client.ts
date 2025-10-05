
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailTemplate {
  to: string
  subject: string
  html: string
  from?: string
}

// Welcome email for new subscribers
export async function sendWelcomeEmail(email: string, firstName?: string) {
  const name = firstName || 'Friend'
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'Nature\'s Way Soil <hello@natureswaysoil.com>',
      to: email,
      subject: 'Welcome to Nature\'s Way Soil - Your Journey to Healthier Soil Starts Here',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2d5016;">Welcome, ${name}!</h1>
          <p>Thank you for joining the Nature's Way Soil community. We're excited to help you discover the power of organic soil health.</p>
          
          <h2 style="color: #2d5016;">Why Organic Matters</h2>
          <p>Did you know that synthetic fertilizers can disrupt the natural symbiotic relationships between plants and beneficial soil fungi? Our organic fertilizers work with nature, not against it.</p>
          
          <h2 style="color: #2d5016;">Get Started</h2>
          <ul>
            <li>Browse our <a href="https://natureswaysoil.com/products">product collection</a></li>
            <li>Learn about <a href="https://natureswaysoil.com/blog">soil health</a></li>
            <li>Get personalized recommendations from our chat assistant</li>
          </ul>
          
          <p style="margin-top: 30px;">
            <a href="https://natureswaysoil.com/products" style="background-color: #2d5016; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Shop Now</a>
          </p>
          
          <p style="color: #666; font-size: 12px; margin-top: 40px;">
            You're receiving this email because you signed up at natureswaysoil.com
          </p>
        </div>
      `
    })
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return { success: false, error }
  }
}

// Abandoned cart email
export async function sendAbandonedCartEmail(email: string, cartItems: any[]) {
  try {
    const itemsHtml = cartItems.map(item => `
      <li style="margin-bottom: 10px;">
        <strong>${item.title}</strong> - $${item.price}
      </li>
    `).join('')
    
    const { data, error } = await resend.emails.send({
      from: 'Nature\'s Way Soil <hello@natureswaysoil.com>',
      to: email,
      subject: 'Don\'t Forget Your Cart - Complete Your Order Today',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2d5016;">Your Cart is Waiting</h1>
          <p>We noticed you left some items in your cart. Complete your order now and start improving your soil health!</p>
          
          <h2 style="color: #2d5016;">Your Items:</h2>
          <ul style="list-style: none; padding: 0;">
            ${itemsHtml}
          </ul>
          
          <p style="margin-top: 30px;">
            <a href="https://natureswaysoil.com/cart" style="background-color: #2d5016; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Complete Your Order</a>
          </p>
          
          <p style="color: #666; margin-top: 20px;">
            <strong>Free shipping on orders over $50!</strong>
          </p>
        </div>
      `
    })
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error sending abandoned cart email:', error)
    return { success: false, error }
  }
}

// Educational drip campaign
export async function sendEducationalEmail(email: string, topic: string, dayNumber: number) {
  const topics: Record<string, any> = {
    'soil-health': {
      1: {
        subject: 'Day 1: Understanding Your Soil Microbiome',
        content: 'Learn about the invisible world beneath your feet and how it affects plant health.'
      },
      3: {
        subject: 'Day 3: The Problem with Synthetic Fertilizers',
        content: 'Discover how chemical fertilizers disrupt natural soil processes.'
      },
      5: {
        subject: 'Day 5: Making the Switch to Organic',
        content: 'Your step-by-step guide to transitioning to organic soil care.'
      }
    }
  }
  
  const emailContent = topics[topic]?.[dayNumber]
  if (!emailContent) return { success: false, error: 'Invalid topic or day' }
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'Nature\'s Way Soil <hello@natureswaysoil.com>',
      to: email,
      subject: emailContent.subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2d5016;">${emailContent.subject}</h1>
          <p>${emailContent.content}</p>
          
          <p style="margin-top: 30px;">
            <a href="https://natureswaysoil.com/blog" style="background-color: #2d5016; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Read More</a>
          </p>
        </div>
      `
    })
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error sending educational email:', error)
    return { success: false, error }
  }
}

// Order confirmation
export async function sendOrderConfirmation(email: string, orderDetails: any) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Nature\'s Way Soil <orders@natureswaysoil.com>',
      to: email,
      subject: `Order Confirmation #${orderDetails.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2d5016;">Thank You for Your Order!</h1>
          <p>Your order #${orderDetails.orderNumber} has been confirmed and will ship soon.</p>
          
          <h2 style="color: #2d5016;">Order Details:</h2>
          <p><strong>Total:</strong> $${orderDetails.total}</p>
          
          <p style="margin-top: 30px;">
            <a href="https://natureswaysoil.com/orders/${orderDetails.orderNumber}" style="background-color: #2d5016; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Track Your Order</a>
          </p>
        </div>
      `
    })
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error sending order confirmation:', error)
    return { success: false, error }
  }
}
