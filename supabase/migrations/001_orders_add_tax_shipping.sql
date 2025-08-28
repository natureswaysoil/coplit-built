-- Adds tax and shipping fields to the orders table
-- Safe to run multiple times due to IF NOT EXISTS guards
BEGIN;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS tax numeric(10,2) DEFAULT 0 NOT NULL,
  ADD COLUMN IF NOT EXISTS shipping_state text,
  ADD COLUMN IF NOT EXISTS shipping_county text,
  ADD COLUMN IF NOT EXISTS shipping_zip text,
  ADD COLUMN IF NOT EXISTS shipping_city text,
  ADD COLUMN IF NOT EXISTS shipping_address1 text,
  ADD COLUMN IF NOT EXISTS shipping_address2 text,
  ADD COLUMN IF NOT EXISTS shipping_phone text;

COMMIT;
