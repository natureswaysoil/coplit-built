-- Add indexes for faster product filtering and search (runs after products table exists)
BEGIN;

CREATE INDEX IF NOT EXISTS products_slug_idx ON public.products (slug);
CREATE INDEX IF NOT EXISTS products_is_active_idx ON public.products (is_active);
CREATE INDEX IF NOT EXISTS products_is_active_price_idx ON public.products (is_active, price);

CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS products_title_trgm_idx ON public.products USING gin ((coalesce(title,'') || ' ' || coalesce(keyword,'')) gin_trgm_ops);

COMMIT;
