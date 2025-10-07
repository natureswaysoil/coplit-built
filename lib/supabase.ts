import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For server-side operations
export const getServiceSupabase = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  return createClient(supabaseUrl, supabaseServiceKey);
};

// Database Types
export interface EmailSubscriber {
  id?: string;
  email: string;
  subscribed_at?: string;
  source?: string;
  preferences?: any;
}

export interface ChatMessage {
  id?: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
  metadata?: any;
}

export interface CustomerInquiry {
  id?: string;
  email?: string;
  name?: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved';
  created_at?: string;
  resolved_at?: string;
}
