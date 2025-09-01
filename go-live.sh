#!/bin/bash

echo "🚀 Nature's Way Soil - GO LIVE SETUP"
echo "===================================="
echo ""

echo "📋 Your Supabase Configuration:"
echo "NEXT_PUBLIC_SUPABASE_URL: $NEXT_PUBLIC_SUPABASE_URL"
echo "SUPABASE_SERVICE_ROLE_KEY: ${SUPABASE_SERVICE_ROLE_KEY:0:20}..."
echo ""

echo "📊 Ready to execute database migration!"
echo ""
echo "📝 MANUAL STEPS TO GO LIVE:"
echo "==========================="
echo ""
echo "1. Go to your Supabase Dashboard SQL Editor:"
echo "   https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql"
echo ""
echo "2. Copy and paste the following SQL in chunks:"
echo ""
echo "   CHUNK 1 - Tables:"
cat << 'EOF'
-- Create customers table
CREATE TABLE IF NOT EXISTS public.customers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id uuid REFERENCES public.customers(id) ON DELETE CASCADE,
  order_number text UNIQUE NOT NULL,
  total numeric(10,2) NOT NULL,
  subtotal numeric(10,2) NOT NULL,
  tax numeric(10,2) DEFAULT 0 NOT NULL,
  shipping_state text,
  shipping_county text,
  shipping_zip text,
  shipping_city text,
  shipping_address1 text,
  shipping_address2 text,
  shipping_phone text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  sku text NOT NULL,
  title text NOT NULL,
  size text NOT NULL,
  qty integer NOT NULL,
  price numeric(10,2) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
EOF

echo ""
echo "   CHUNK 2 - Security:"
cat << 'EOF'
-- Enable Row Level Security
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Customers are viewable by everyone" ON public.customers FOR SELECT USING (true);
CREATE POLICY "Customers can be created by anyone" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Orders are viewable by service role" ON public.orders FOR SELECT USING (auth.role() = 'service_role');
CREATE POLICY "Orders can be created by service role" ON public.orders FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Order items are viewable by service role" ON public.order_items FOR SELECT USING (auth.role() = 'service_role');
CREATE POLICY "Order items can be created by service role" ON public.order_items FOR INSERT WITH CHECK (auth.role() = 'service_role');
EOF

echo ""
echo "   CHUNK 3 - Functions & Triggers:"
cat << 'EOF'
-- Create function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
DECLARE
  order_num text;
BEGIN
  order_num := 'ORD-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(nextval('order_number_seq')::text, 3, '0');
  RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EOF

echo ""
echo "3. After running all chunks, test with this command:"
echo "   curl -X GET '$NEXT_PUBLIC_SUPABASE_URL/rest/v1/customers?select=*' \\"
echo "     -H 'apikey: $SUPABASE_SERVICE_ROLE_KEY' \\"
echo "     -H 'Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY'"
echo ""
echo "4. Start your Next.js app:"
echo "   npm run dev"
echo ""
echo "5. Test checkout at: http://localhost:3004/checkout"
echo ""
echo "🎉 You're LIVE!"
