-- 008_public_read_policies.sql
-- Purpose: Add row level security policies to permit public (anon) read access
-- for active products and their variations while keeping write access restricted
-- to the service role. Also adds safe read policies for promo codes if needed.
--
-- This migration is idempotent: it checks for existing policies before creating.
-- Run after baseline 000_bigint_full_schema.sql.

BEGIN;

-- Ensure RLS is enabled (it already is in baseline, but harmless if repeated)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

-- Public (anon) can select only active products marked is_active = true
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read active products') THEN
    CREATE POLICY "Public read active products" ON public.products
      FOR SELECT USING ( is_active IS TRUE );
  END IF;
END $$;

-- Public (anon) can select variations belonging to active products
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read product variations') THEN
    CREATE POLICY "Public read product variations" ON public.product_variations
      FOR SELECT USING ( EXISTS (
        SELECT 1 FROM public.products p
        WHERE p.id = product_variations.product_id AND p.is_active IS TRUE
      ) );
  END IF;
END $$;

-- Optional: Allow public read of active promo codes (omit if you want codes to be secret)
-- Here we restrict to is_active plus date window.
DO $$ BEGIN
  IF to_regclass('public.promo_codes') IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read active promo codes') THEN
      CREATE POLICY "Public read active promo codes" ON public.promo_codes
        FOR SELECT USING (
          is_active IS TRUE
          AND (starts_at IS NULL OR starts_at <= timezone('utc', now()))
          AND (ends_at IS NULL OR ends_at >= timezone('utc', now()))
        );
    END IF;
  END IF;
END $$;

-- Service role full access policies already exist in baseline; we retain them.
-- No write policies for anon; anonymous inserts/updates/deletes remain blocked.

COMMIT;
