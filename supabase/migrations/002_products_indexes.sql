-- Add indexes for faster product filtering and search
-- Safe to run multiple times (IF NOT EXISTS guards)

-- Basic btree indexes
CREATE INDEX IF NOT EXISTS products_slug_idx ON products (slug);
CREATE INDEX IF NOT EXISTS products_is_active_idx ON products (is_active);
CREATE INDEX IF NOT EXISTS products_is_active_price_idx ON products (is_active, price);

-- Enable pg_trgm extension for fuzzy search (if not already)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Trigram index on title + keyword combined for flexible searching
CREATE INDEX IF NOT EXISTS products_title_trgm_idx ON products USING gin ((coalesce(title,'') || ' ' || coalesce(keyword,'')) gin_trgm_ops);
