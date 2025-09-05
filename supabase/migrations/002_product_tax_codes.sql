-- Create product tax codes table and populate with existing SKUs
BEGIN;

-- Create product_tax_codes table
CREATE TABLE IF NOT EXISTS public.product_tax_codes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sku text UNIQUE NOT NULL,
  tax_code text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.product_tax_codes ENABLE ROW LEVEL SECURITY;

-- Create policy for service role access
CREATE POLICY IF NOT EXISTS "Service role can access product_tax_codes" ON public.product_tax_codes
  FOR ALL USING (auth.role() = 'service_role');

-- Insert tax codes for existing products
INSERT INTO public.product_tax_codes (sku, tax_code) VALUES
  -- Hay Fertilizer
  ('NWS-HAY-1GAL', 'txcd_20030000'), -- Fertilizers and soil conditioners
  ('NWS-HAY-25GAL', 'txcd_20030000'),

  -- Humic Fulvic
  ('NWS-HUMF-KELP-32OZ', 'txcd_20030000'),
  ('NWS-HUMF-KELP-1GAL', 'txcd_20030000'),
  ('NWS-HUMF-KELP-25GAL', 'txcd_20030000'),

  -- Biochar
  ('NWS-BIOCHAR-32OZ', 'txcd_20030000'),
  ('NWS-BIOCHAR-1GAL', 'txcd_20030000'),

  -- Hydroponic
  ('NWS-HYDROP-32OZ', 'txcd_20030000'),
  ('NWS-HYDROP-1GAL', 'txcd_20030000'),

  -- Living Compost
  ('NWS-LCOMP-10LB', 'txcd_20030000'),

  -- Kelp
  ('NWS-KELP-32OZ', 'txcd_20030000'),
  ('NWS-KELP-1GAL', 'txcd_20030000'),
  ('NWS-KELP-25GAL', 'txcd_20030000'),

  -- Bone Meal
  ('NWS-BONEMEAL-32OZ', 'txcd_20030000'),
  ('NWS-BONEMEAL-1GAL', 'txcd_20030000'),

  -- Dog Safe
  ('NWS-DOGSAFE-32OZ', 'txcd_20030000'),
  ('NWS-DOGSAFE-1GAL', 'txcd_20030000'),

  -- Tomato Fertilizer
  ('NWS-TOMATO-LF-32OZ', 'txcd_20030000'),
  ('NWS-TOMATO-LF-1GAL', 'txcd_20030000')
ON CONFLICT (sku) DO NOTHING;

COMMIT;
