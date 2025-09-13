-- Fresh install consolidated schema (bigint-based) for products, variations, orders, search, inventory.
-- Use this ONLY for a new project without previous uuid-based migrations applied.
-- If you already have data under uuid IDs, DO NOT run this directly—migrate/transform instead.
--
-- Contents:
-- 1. Extensions
-- 2. Core tables (orders, customers, order_items)
-- 3. Product taxonomy tables (product_tax_codes)
-- 4. Products (bigint identity) + variations (FK bigint)
-- 5. Promo codes & analytics events
-- 6. RLS policies (service_role convenience)
-- 7. Shared trigger function (set_updated_at)
-- 8. View + search function
-- 9. Inventory decrement trigger
-- 10. Seed products & variations

BEGIN;

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto; -- for gen_random_uuid() if needed elsewhere
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. Core commerce tables
CREATE TABLE IF NOT EXISTS public.customers (
  id bigserial PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text,
  created_at timestamptz DEFAULT timezone('utc', now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.orders (
  id bigserial PRIMARY KEY,
  customer_id bigint REFERENCES public.customers(id) ON DELETE SET NULL,
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  tax_amount numeric(10,2) DEFAULT 0,
  shipping_amount numeric(10,2) DEFAULT 0,
  total_amount numeric(10,2) DEFAULT 0,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT timezone('utc', now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc', now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id bigserial PRIMARY KEY,
  order_id bigint REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id bigint, -- optional reference style (if base product tracked)
  variation_id bigint, -- optional reference style (if variation used)
  sku text NOT NULL,
  qty integer NOT NULL DEFAULT 1,
  unit_price numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT timezone('utc', now()) NOT NULL
);

-- 3. Product tax codes / classification
CREATE TABLE IF NOT EXISTS public.product_tax_codes (
  code text PRIMARY KEY,
  description text
);

-- 4. Products + variations (bigint ids)
CREATE TABLE IF NOT EXISTS public.products (
  id bigserial PRIMARY KEY,
  slug text UNIQUE,
  title text NOT NULL,
  short_description text,
  details text,
  image_url text,
  price numeric(10,2),
  keyword text,
  inventory integer,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT timezone('utc', now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc', now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.product_variations (
  id bigserial PRIMARY KEY,
  product_id bigint REFERENCES public.products(id) ON DELETE CASCADE,
  size text NOT NULL,
  price numeric(10,2) NOT NULL,
  sku text UNIQUE NOT NULL,
  inventory integer,
  created_at timestamptz DEFAULT timezone('utc', now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc', now()) NOT NULL
);

-- 5. Promo Codes & Analytics
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id bigserial PRIMARY KEY,
  code text UNIQUE NOT NULL,
  description text,
  discount_type text NOT NULL CHECK (discount_type IN ('percent','fixed')),
  discount_value numeric(10,2) NOT NULL CHECK (discount_value > 0),
  max_uses integer,
  uses integer DEFAULT 0,
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT timezone('utc', now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc', now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id bigserial PRIMARY KEY,
  event_type text NOT NULL,
  product_id bigint,
  variation_id bigint,
  meta jsonb,
  ip inet,
  user_agent text,
  created_at timestamptz DEFAULT timezone('utc', now()) NOT NULL
);

-- Simple helper to apply a promo code (returns discounted subtotal). Business logic can expand later.
CREATE OR REPLACE FUNCTION public.apply_promo(subtotal numeric, promo text)
RETURNS numeric AS $$
DECLARE v_row record; v_now timestamptz := timezone('utc', now()); v_result numeric := subtotal; BEGIN
  SELECT * INTO v_row FROM public.promo_codes
   WHERE code = promo AND is_active
     AND (starts_at IS NULL OR starts_at <= v_now)
     AND (ends_at IS NULL OR ends_at >= v_now)
     AND (max_uses IS NULL OR uses < max_uses)
  LIMIT 1;
  IF NOT FOUND THEN RETURN subtotal; END IF;
  IF v_row.discount_type = 'percent' THEN
    v_result := ROUND(subtotal * (1 - (v_row.discount_value/100.0))::numeric, 2);
  ELSE
    v_result := GREATEST(0, subtotal - v_row.discount_value);
  END IF;
  -- Increment usage (optimistic, not locked; acceptable for low contention). Could add FOR UPDATE if needed.
  UPDATE public.promo_codes SET uses = uses + 1, updated_at = timezone('utc', now()) WHERE id = v_row.id;
  RETURN v_result;
END;$$ LANGUAGE plpgsql VOLATILE;

-- 6. RLS policies (service_role bypass note: service_role already bypasses RLS; policies kept for clarity)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='Service role full access products') THEN
    CREATE POLICY "Service role full access products" ON public.products FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='Service role full access product_variations') THEN
    CREATE POLICY "Service role full access product_variations" ON public.product_variations FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='Service role full access orders') THEN
    CREATE POLICY "Service role full access orders" ON public.orders FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='Service role full access order_items') THEN
    CREATE POLICY "Service role full access order_items" ON public.order_items FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='Service role full access customers') THEN
    CREATE POLICY "Service role full access customers" ON public.customers FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
  END IF;
END $$;

-- 7. Shared trigger function (idempotent)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_updated_at ON public.products;
CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS product_variations_updated_at ON public.product_variations;
CREATE TRIGGER product_variations_updated_at BEFORE UPDATE ON public.product_variations
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS orders_updated_at ON public.orders;
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 8. Enriched products view + search
CREATE OR REPLACE VIEW public.v_products_enriched AS
SELECT
  p.id,
  p.slug,
  p.title,
  p.short_description,
  p.details,
  p.image_url,
  COALESCE(p.price, MIN(v.price)) AS effective_price,
  p.price AS base_price,
  p.keyword,
  p.inventory AS product_inventory,
  SUM(v.inventory) FILTER (WHERE v.inventory IS NOT NULL) AS variations_inventory_sum,
  COALESCE(p.is_active, true) AS is_active,
  p.created_at,
  p.updated_at
FROM public.products p
LEFT JOIN public.product_variations v ON v.product_id = p.id
GROUP BY p.id;

CREATE OR REPLACE FUNCTION public.search_products(q text, lim int DEFAULT 20)
RETURNS TABLE(
  id bigint,
  slug text,
  title text,
  short_description text,
  details text,
  image_url text,
  effective_price numeric(10,2),
  keyword text,
  score real
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.slug,
    p.title,
    p.short_description,
    p.details,
    p.image_url,
    COALESCE(p.price, MIN(v.price)) AS effective_price,
    p.keyword,
    GREATEST(similarity(p.title, q), similarity(coalesce(p.keyword,''), q)) AS score
  FROM public.products p
  LEFT JOIN public.product_variations v ON v.product_id = p.id
  WHERE (
    p.title ILIKE '%' || q || '%'
    OR p.keyword ILIKE '%' || q || '%'
    OR similarity(p.title, q) > 0.25
    OR similarity(coalesce(p.keyword,''), q) > 0.25
  )
  AND COALESCE(p.is_active, true)
  GROUP BY p.id
  ORDER BY score DESC, p.title ASC
  LIMIT lim;
END;$$ LANGUAGE plpgsql STABLE;

-- 9. Inventory decrement trigger based on SKU mapping
CREATE OR REPLACE FUNCTION public.decrement_inventory_on_order()
RETURNS trigger AS $$
DECLARE
  v_variation_id bigint;
BEGIN
  SELECT id INTO v_variation_id FROM public.product_variations WHERE sku = NEW.sku LIMIT 1;
  IF v_variation_id IS NOT NULL THEN
    UPDATE public.product_variations
      SET inventory = CASE WHEN inventory IS NULL THEN NULL ELSE GREATEST(inventory - NEW.qty, 0) END,
          updated_at = timezone('utc', now())
      WHERE id = v_variation_id;
  ELSE
    UPDATE public.products
      SET inventory = CASE WHEN inventory IS NULL THEN NULL ELSE GREATEST(inventory - NEW.qty, 0) END,
          updated_at = timezone('utc', now())
      WHERE keyword = NEW.sku; -- heuristic placeholder
  END IF;
  RETURN NEW;
END;$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS order_items_decrement_inventory ON public.order_items;
CREATE TRIGGER order_items_decrement_inventory
AFTER INSERT ON public.order_items
FOR EACH ROW EXECUTE FUNCTION public.decrement_inventory_on_order();

-- 10. Seed products & variations
WITH seed(slug, title, short_description, details, image_url, keyword) AS (
  VALUES
    ('hay-fertilizer', 'Nature''s Way Soil Horse Safe Hay, Pasture & Lawn Fertilizer - Organic Microbial Nitrogen Blend for Greener Grass & Improved Soil', 'Horse safe microbial nitrogen fertilizer for hay, pasture & lawns.', 'Premium horse-safe microbial nitrogen fertilizer blend specifically designed for hay fields, pastures, and lawns. This organic formula naturally feeds grass, turf, and forage while supporting sustained growth, creating greener lawns, and improving soil structure. Safe for horses, livestock, and beneficial for sustainable agriculture.', 'https://m.media-amazon.com/images/I/61ll2EiLAJL._AC_UL320_.jpg', 'HAY FERTILIZER'),
    ('humic-fulvic-kelp','Nature''s Way Soil Liquid Humic & Fulvic Acid with Kelp - Organic Soil Conditioner for Enhanced Nutrient Uptake','Liquid humic & fulvic acid with kelp.','Professional-grade liquid humic and fulvic acid fertilizer enriched with organic kelp extract. This carbon-rich soil amendment revives tired, depleted soil by enhancing nutrient uptake, stimulating beneficial microbial activity, and boosting overall plant vigor. Ideal for organic gardening, improving clay or sandy soils, and increasing plant resistance to stress. Perfect for vegetables, flowers, trees, and lawn care.','https://m.media-amazon.com/images/I/615mJs9XccL._AC_UL320_.jpg','HUMIC FULVIC'),
    ('liquid-biochar','Nature''s Way Soil Liquid Biochar with Kelp, Humic & Fulvic Acids - Premium Soil Amendment for Water Retention','Liquid biochar soil conditioner.','Advanced liquid biochar soil conditioner combining activated biochar, organic kelp, and humic/fulvic acids to dramatically improve soil health. This premium formula supercharges beneficial microbial life, increases nutrient retention, and enhances water holding capacity. Perfect for gardens, lawns, and agricultural applications seeking long-term soil fertility improvements and sustainable growing practices.','https://m.media-amazon.com/images/I/510ui3CBLbL._AC_UL320_.jpg','BIOCHAR SOIL'),
    ('organic-hydroponic','Nature''s Way Soil Organic Hydroponic Fertilizer - Complete Liquid Plant Food for Hydroponic & Aquaponic Systems','Organic hydroponic fertilizer.','Premium organic hydroponic fertilizer concentrate that yields up to 512 gallons of complete nutrient solution. Specially formulated for hydroponic and aquaponic growing systems, providing perfectly balanced nutrition for rapid plant growth. This pet-safe, chemical-free formula supports healthy development without harsh synthetic additives. Ideal for indoor growing, greenhouses, and soilless cultivation of vegetables, herbs, and flowers.','https://m.media-amazon.com/images/I/61qsUDP+WuL._AC_UL320_.jpg','HYDROPONIC ORGANIC'),
    ('living-compost','Nature''s Way Soil Enhanced Living Compost - Premium Blend with Worm Castings, Biochar & Duckweed Extract','Living compost with biochar & worm castings.','Superior living compost blend featuring fermented duckweed extract, 20% premium worm castings, 20% activated biochar, and 60% weed-free aged compost. This powerful soil amendment dramatically enriches soil biology, stimulates healthy root development, and provides slow-release nutrition. Perfect for organic gardens, raised beds, containers, and improving existing garden soil for maximum plant health and productivity.','https://m.media-amazon.com/images/I/718tWBNNfkL._AC_UL320_.jpg','LIVING COMPOST'),
    ('liquid-kelp','Nature''s Way Soil Liquid Kelp Fertilizer - Organic Seaweed Extract for Root Development & Plant Vigor','Organic liquid kelp fertilizer.','Premium liquid kelp fertilizer made fresh weekly with organic seaweed extract, Vitamin B-1, and aloe vera. This concentrated formula promotes stronger root systems, healthier plant transplants, and prevents common plant disorders like blossom end rot. Rich in natural plant hormones, trace minerals, and growth stimulants. Perfect for vegetables, tomatoes, peppers, and all garden plants requiring enhanced root development and stress resistance.','https://m.media-amazon.com/images/I/71PYCZfZ2BL._AC_UL320_.jpg','KELP SEAWEED'),
    ('liquid-bone-meal','Nature''s Way Soil Liquid Bone Meal Fertilizer - Fast-Absorbing Phosphorus & Calcium for Root Development','Fast absorbing liquid bone meal.','Fast-absorbing liquid bone meal fertilizer containing 25% hydrolyzed bone meal, 5% calcium, and 10% phosphorus (P₂O₅) for immediate plant uptake. This organic formula promotes robust root development, stronger flowering, and improved fruit set in vegetables, trees, and flowering shrubs. Superior to traditional granular bone meal with instant availability and easy application for all garden plants.','https://m.media-amazon.com/images/I/7151rsGhpkL._AC_UL320_.jpg','BONE MEAL LIQUID'),
    ('dog-urine-neutralizer','Nature''s Way Soil Dog Urine Neutralizer & Lawn Repair - Pet-Safe Grass Repair Spray for Yellow Spots & Odor Control','Dog urine lawn spot repair.','Professional-strength dog urine neutralizer and lawn repair spray specifically formulated to eliminate yellow spots caused by pet urine burn. This pet-safe formula neutralizes harmful salts, eliminates odors, and revives damaged grass for a healthy, green lawn. Safe for dogs, cats, and other pets while effectively restoring lawn beauty. Essential for pet owners maintaining pristine yards without harmful chemicals.','https://m.media-amazon.com/images/I/61jHzXvOJjL._AC_UL320_.jpg','DOG URINE LAWN'),
    ('organic-tomato-fertilizer','Nature''s Way Soil Organic Tomato Fertilizer - Liquid Concentrate with Vitamin B-1 & Aloe Vera for Maximum Yields','Organic tomato fertilizer.','Premium organic tomato fertilizer made fresh weekly with balanced nutrition for maximum tomato yields. This concentrated liquid formula includes Vitamin B-1 and aloe vera for faster root establishment, healthier transplants, and prevention of blossom end rot. Perfect for organic tomato growing, providing easily absorbed essential nutrients that promote healthy growth and increased fruit production. Ideal for organic farms, greenhouses, and home gardens.','https://m.media-amazon.com/images/I/71K9tXvL8pL._AC_UL320_.jpg','TOMATO ORGANIC FERTILIZER')
)
, upserts AS (
  INSERT INTO public.products (slug, title, short_description, details, image_url, keyword, is_active)
  SELECT slug, title, short_description, details, image_url, keyword, true FROM seed
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    short_description = EXCLUDED.short_description,
    details = EXCLUDED.details,
    image_url = EXCLUDED.image_url,
    keyword = EXCLUDED.keyword,
    is_active = true
  RETURNING id, slug
)
, variation_seed(slug, size, price, sku) AS (
  VALUES
    ('hay-fertilizer','1 Gallon',39.99,'NWS-HAY-1GAL'),
    ('hay-fertilizer','2.5 Gallons',99.99,'NWS-HAY-25GAL'),
    ('humic-fulvic-kelp','32 oz',19.99,'NWS-HUMF-KELP-32OZ'),
    ('humic-fulvic-kelp','1 Gallon',39.99,'NWS-HUMF-KELP-1GAL'),
    ('humic-fulvic-kelp','2.5 Gallon',69.99,'NWS-HUMF-KELP-25GAL'),
    ('liquid-biochar','32 oz',29.99,'NWS-BIOCHAR-32OZ'),
    ('liquid-biochar','1 Gallon',89.95,'NWS-BIOCHAR-1GAL'),
    ('organic-hydroponic','32 oz',25.98,'NWS-HYDROP-32OZ'),
    ('organic-hydroponic','1 Gallon',59.99,'NWS-HYDROP-1GAL'),
    ('living-compost','Bag 10 lb',29.99,'NWS-LCOMP-10LB'),
    ('liquid-kelp','32 oz',24.99,'NWS-KELP-32OZ'),
    ('liquid-kelp','1 Gallon',34.99,'NWS-KELP-1GAL'),
    ('liquid-kelp','2.5 Gallon',64.99,'NWS-KELP-25GAL'),
    ('liquid-bone-meal','32 oz',24.99,'NWS-BONEMEAL-32OZ'),
    ('liquid-bone-meal','1 Gallon',39.99,'NWS-BONEMEAL-1GAL'),
    ('dog-urine-neutralizer','32 oz',29.99,'NWS-DOGSAFE-32OZ'),
    ('dog-urine-neutralizer','1 Gallon',59.99,'NWS-DOGSAFE-1GAL'),
    ('organic-tomato-fertilizer','32 oz',29.99,'NWS-TOMATO-LF-32OZ'),
    ('organic-tomato-fertilizer','1 Gallon',64.99,'NWS-TOMATO-LF-1GAL')
)
INSERT INTO public.product_variations (product_id, size, price, sku)
SELECT u.id, vs.size, vs.price, vs.sku
FROM variation_seed vs
JOIN upserts u ON u.slug = vs.slug
ON CONFLICT (sku) DO UPDATE SET
  size = EXCLUDED.size,
  price = EXCLUDED.price,
  product_id = EXCLUDED.product_id;

COMMIT;
