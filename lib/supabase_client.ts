
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface EmailCapture {
  id?: string
  email: string
  source: string
  created_at?: string
  metadata?: any
}

export interface ChatLog {
  id?: string
  session_id: string
  message: string
  response: string
  created_at?: string
  user_email?: string
}

export interface ProductView {
  id?: string
  product_id: string
  session_id: string
  created_at?: string
}

// Email capture functions
export async function captureEmail(email: string, source: string, metadata?: any) {
  try {
    const { data, error } = await supabase
      .from('email_captures')
      .insert([{ email, source, metadata }])
      .select()
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error capturing email:', error)
    return { success: false, error }
  }
}

// Chat log functions
export async function logChat(session_id: string, message: string, response: string, user_email?: string) {
  try {
    const { data, error } = await supabase
      .from('chat_logs')
      .insert([{ session_id, message, response, user_email }])
      .select()
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error logging chat:', error)
    return { success: false, error }
  }
}

// Product view tracking
export async function trackProductView(product_id: string, session_id: string) {
  try {
    const { data, error } = await supabase
      .from('product_views')
      .insert([{ product_id, session_id }])
      .select()
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error tracking product view:', error)
    return { success: false, error }
  }
}

// Get popular products
export async function getPopularProducts(limit: number = 5) {
  try {
    const { data, error } = await supabase
      .from('product_views')
      .select('product_id, count')
      .order('count', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error getting popular products:', error)
    return { success: false, error }
  }
}
