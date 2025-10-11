-- Add product aggregate view, search function leveraging trigram, inventory decrement trigger
BEGIN;

-- Ensure extension present (idempotent)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 1. Add inventory column to product_variations if not exists (for per-variation stock)
ALTER TABLE public.product_variations ADD COLUMN IF NOT EXISTS inventory integer;

-- 2. View combining products with lowest variation price (if base price null)
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

-- 3. Search function using trigram similarity threshold
CREATE OR REPLACE FUNCTION public.search_products(q text, lim int DEFAULT 20)
RETURNS TABLE(
  id uuid,
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
END;
$$ LANGUAGE plpgsql STABLE;

-- 4. Inventory decrement trigger on order_items insert (assumes SKU matches variation or base product)
-- Map: if SKU matches product_variations.sku decrement that variation; else attempt product inventory.
CREATE OR REPLACE FUNCTION public.decrement_inventory_on_order()
RETURNS trigger AS $$
DECLARE
  v_variation_id uuid;
BEGIN
  -- Try variation first
  SELECT id INTO v_variation_id FROM public.product_variations WHERE sku = NEW.sku LIMIT 1;
  IF v_variation_id IS NOT NULL THEN
    UPDATE public.product_variations
      SET inventory = CASE WHEN inventory IS NULL THEN NULL ELSE GREATEST(inventory - NEW.qty, 0) END,
          updated_at = timezone('utc', now())
      WHERE id = v_variation_id;
  ELSE
    -- Fallback to products table if base product tracked by SKU (optional design: store base SKU in products)
    UPDATE public.products
      SET inventory = CASE WHEN inventory IS NULL THEN NULL ELSE GREATEST(inventory - NEW.qty, 0) END,
          updated_at = timezone('utc', now())
      WHERE id IN (
        SELECT p.id FROM public.products p WHERE p.keyword = NEW.sku -- heuristic placeholder
      );
  END IF;
  RETURN NEW;
END;$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS order_items_decrement_inventory ON public.order_items;
CREATE TRIGGER order_items_decrement_inventory
AFTER INSERT ON public.order_items
FOR EACH ROW EXECUTE FUNCTION public.decrement_inventory_on_order();

-- 5. RLS policies for view & function exposure not needed; relies on underlying table policies.

COMMIT;
