-- 009_inventory_alert_subscriptions.sql
-- Allows store admins (or system) to subscribe emails to low inventory alerts.
-- This table is intentionally simple; notification sending is handled application-side.

BEGIN;

CREATE TABLE IF NOT EXISTS public.inventory_alert_subscriptions (
  id bigserial PRIMARY KEY,
  email text NOT NULL,
  product_id bigint, -- optional: null means subscribe to ANY product low inventory
  threshold integer NOT NULL DEFAULT 5,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT timezone('utc', now()) NOT NULL
);

ALTER TABLE public.inventory_alert_subscriptions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='Service role full access inventory_alert_subscriptions') THEN
    CREATE POLICY "Service role full access inventory_alert_subscriptions" ON public.inventory_alert_subscriptions
      FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
  END IF;
END $$;

COMMIT;
