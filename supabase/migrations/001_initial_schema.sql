
-- Email captures table
CREATE TABLE IF NOT EXISTS email_captures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  source VARCHAR(100) NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_email_captures_email ON email_captures(email);
CREATE INDEX idx_email_captures_created_at ON email_captures(created_at);

-- Chat logs table
CREATE TABLE IF NOT EXISTS chat_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  user_email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_chat_logs_session_id ON chat_logs(session_id);
CREATE INDEX idx_chat_logs_created_at ON chat_logs(created_at);

-- Product views table
CREATE TABLE IF NOT EXISTS product_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id VARCHAR(100) NOT NULL,
  session_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_product_views_product_id ON product_views(product_id);
CREATE INDEX idx_product_views_created_at ON product_views(created_at);

-- Create a materialized view for popular products
CREATE MATERIALIZED VIEW IF NOT EXISTS popular_products AS
SELECT 
  product_id,
  COUNT(*) as view_count,
  COUNT(DISTINCT session_id) as unique_viewers
FROM product_views
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY product_id
ORDER BY view_count DESC;

CREATE UNIQUE INDEX idx_popular_products_product_id ON popular_products(product_id);

-- Function to refresh popular products view
CREATE OR REPLACE FUNCTION refresh_popular_products()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY popular_products;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE email_captures ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_views ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access (adjust based on your needs)
CREATE POLICY "Allow anonymous inserts on email_captures" ON email_captures
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts on chat_logs" ON chat_logs
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts on product_views" ON product_views
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous reads on popular_products" ON popular_products
  FOR SELECT TO anon USING (true);
