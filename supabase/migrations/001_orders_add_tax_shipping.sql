-- Complete Migration for Nature's Way Soil E-commerce
-- This creates all necessary tables, policies, and configurations

-- Step 1: Create customers table
CREATE TABLE IF NOT EXISTS public.customers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Step 2: Create orders table
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

-- Step 3: Create order_items table
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

-- Step 4: Create products table (for future use)
CREATE TABLE IF NOT EXISTS public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sku text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  size text,
  price numeric(10,2) NOT NULL,
  stock_quantity integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Step 5: Enable Row Level Security
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS Policies

-- Customers policies
CREATE POLICY "Customers are viewable by everyone" ON public.customers
  FOR SELECT USING (true);

CREATE POLICY "Customers can be created by anyone" ON public.customers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Customers can be updated by service role" ON public.customers
  FOR UPDATE USING (auth.role() = 'service_role');

-- Orders policies
CREATE POLICY "Orders are viewable by service role" ON public.orders
  FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "Orders can be created by service role" ON public.orders
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Orders can be updated by service role" ON public.orders
  FOR UPDATE USING (auth.role() = 'service_role');

-- Order items policies
CREATE POLICY "Order items are viewable by service role" ON public.order_items
  FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "Order items can be created by service role" ON public.order_items
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Products policies (public read, service role write)
CREATE POLICY "Products are viewable by everyone" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Products can be managed by service role" ON public.products
  FOR ALL USING (auth.role() = 'service_role');

-- Step 7: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);

-- Step 8: Create function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
DECLARE
  order_num text;
BEGIN
  -- Generate order number like ORD-20250828-001
  order_num := 'ORD-' || to_char(now(), 'YYYYMMDD') || '-' ||
               lpad(nextval('order_number_seq')::text, 3, '0');
  RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- Step 9: Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 10: Create triggers
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 11: Insert some sample products (optional)
INSERT INTO public.products (sku, title, description, size, price, stock_quantity)
VALUES
  ('NWS-5G', 'Nature''s Way Soil - Premium Blend', 'Premium organic soil blend', '5 Gallon', 25.00, 100),
  ('NWS-10G', 'Nature''s Way Soil - Premium Blend', 'Premium organic soil blend', '10 Gallon', 45.00, 50),
  ('NWS-25G', 'Nature''s Way Soil - Premium Blend', 'Premium organic soil blend', '25 Gallon', 100.00, 25)
ON CONFLICT (sku) DO NOTHING;
