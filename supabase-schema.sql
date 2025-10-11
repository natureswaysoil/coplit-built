-- Nature's Way Soil Database Schema
-- Run this in your Supabase SQL Editor

-- Email Subscribers Table
CREATE TABLE IF NOT EXISTS email_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source VARCHAR(100),
  preferences JSONB DEFAULT '{}',
  unsubscribed BOOLEAN DEFAULT FALSE,
  unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Customer Inquiries Table
CREATE TABLE IF NOT EXISTS customer_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255),
  name VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- Product Reviews Table (for future use)
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id VARCHAR(100) NOT NULL,
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  verified_purchase BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved BOOLEAN DEFAULT FALSE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_customer_inquiries_status ON customer_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_product_reviews_product ON product_reviews(product_id);

-- Enable Row Level Security (RLS)
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed)
CREATE POLICY "Allow public insert on email_subscribers" ON email_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert on chat_messages" ON chat_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on chat_messages" ON chat_messages
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert on customer_inquiries" ON customer_inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on approved reviews" ON product_reviews
  FOR SELECT USING (approved = true);
