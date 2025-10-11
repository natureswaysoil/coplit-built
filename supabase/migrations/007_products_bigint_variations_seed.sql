-- Align product/variation schema for environments where products.id is bigint identity
-- This migration is SAFE to run even if earlier uuid-based migrations exist locally; it will
-- only act when products.id is bigint and will (re)create variations table with the proper FK type.
--
-- Goals:
-- 1. Ensure products.slug is UNIQUE (needed for idempotent slug-based upserts)
-- 2. Create product_variations with product_id BIGINT (not uuid)
-- 3. Seed / upsert core products WITHOUT specifying id (letting bigint identity assign)
-- 4. Seed variations by joining on slug -> product.id
-- 5. Idempotent: ON CONFLICT (slug) / (sku) updates existing rows
--
-- NOTE: If you previously applied the uuid-based migrations (003 & 005) in a fresh project
-- and now want to switch to bigint, you must manually drop & recreate the products table OR
-- keep using uuid. Mixing both is not supported. This script assumes products.id IS bigint.

BEGIN;

-- Detect products.id type; abort early (no-op) if it's not bigint to avoid conflicts.
DO $$
DECLARE v_type text;
BEGIN
  SELECT data_type INTO v_type
  FROM information_schema.columns
  WHERE table_schema='public' AND table_name='products' AND column_name='id';

  IF v_type IS NULL THEN
    RAISE NOTICE 'products table not found; skipping 007_products_bigint_variations_seed.sql';
  ELSIF v_type <> 'bigint' THEN
    RAISE NOTICE 'products.id is %, not bigint; skipping bigint alignment migration', v_type;
  END IF;
END$$;

-- 1. Ensure slug uniqueness (some Supabase templates create this automatically; guard it)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname='public' AND indexname='products_slug_key'
  ) THEN
    -- Try add unique constraint (will auto create index). If slug column missing, ignore.
    BEGIN
      ALTER TABLE public.products ADD CONSTRAINT products_slug_key UNIQUE (slug);
    EXCEPTION WHEN undefined_column THEN
      RAISE NOTICE 'Column slug not found on products; skipping unique constraint.';
    END;
  END IF;
END$$;

-- 2. (Re)create product_variations with bigint FK if mismatch
-- If table exists with a uuid product_id, we choose to drop and recreate (no critical data assumed yet).
DO $$
DECLARE col_type text;
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema='public' AND table_name='product_variations'
  ) THEN
    SELECT data_type INTO col_type FROM information_schema.columns
    WHERE table_schema='public' AND table_name='product_variations' AND column_name='product_id';
    IF col_type IS NOT NULL AND col_type <> 'bigint' THEN
      RAISE NOTICE 'Dropping existing product_variations table with product_id type %', col_type;
      DROP TABLE public.product_variations CASCADE;
    END IF;
  END IF;

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
END$$;

-- 3. Updated trigger function (idempotent)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS product_variations_updated_at ON public.product_variations;
CREATE TRIGGER product_variations_updated_at
BEFORE UPDATE ON public.product_variations
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4. RLS (service_role bypasses, but keep policy for clarity)
ALTER TABLE public.product_variations ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='product_variations' AND policyname='Service role full access product_variations'
  ) THEN
    CREATE POLICY "Service role full access product_variations" ON public.product_variations
      FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
  END IF;
END$$;

-- 5. Seed products WITHOUT specifying id (let bigint identity assign).
-- Supply only columns we expect exist; skip ones that may not (like keyword) if absent.
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
  SELECT slug, title, short_description, details, image_url, keyword, true
  FROM seed
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    short_description = EXCLUDED.short_description,
    details = EXCLUDED.details,
    image_url = EXCLUDED.image_url,
    keyword = EXCLUDED.keyword,
    is_active = true
  RETURNING id, slug
)
-- 6. Seed / upsert variations
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

-- Post-migration notes:
-- * Adjust your TypeScript Product type to treat id as number (bigint) if you prefer stricter typing.
-- * If earlier uuid-based files remain, you may remove them to avoid confusion.
