-- 010_alerts_last_notified.sql
-- Adds last_notified timestamp + notify_cooldown_minutes setting (optional) via a config table in future.

BEGIN;

ALTER TABLE public.inventory_alert_subscriptions
  ADD COLUMN IF NOT EXISTS last_notified timestamptz;

COMMIT;
