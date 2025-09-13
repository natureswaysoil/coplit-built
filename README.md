
## Features
- Product catalog (fallback to static seed if DB unavailable)
- Variations and dynamic pricing
- Cart functionality
- User authentication (Supabase)
- Privacy & Refund policy pages (Markdown -> rendered)
- Stripe-ready Payment Element integration
- ISR revalidation endpoint for catalog freshness
- Admin dashboard (products, variations, promo codes, alerts, analytics)
- Inline product & variation editing + low inventory highlighting
- Inventory alert subscriptions (email + optional product/threshold)
- Promo code CRUD (amount / percent, expirations, max redemptions)
- Analytics summary (events by type, top products)
- CSV export (products, variations, promos)

## Environment Variables (excerpt)
Provide at minimum:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `REVALIDATE_SECRET`

## ISR Revalidation Endpoint
Endpoints:
- `/api/revalidate-products` (legacy)
- `/api/revalidate` (unified; used by dashboard button)

`/api/revalidate` accepts POST JSON body:
```json
{ "slug": "kelp-meal" }
{ "all": true }
{ "all": true, "skipIndex": true }
```
Auth:
- Provide `X-ADMIN-TOKEN: <ADMIN_API_TOKEN>` header OR
- Provide `x-revalidate-secret: <REVALIDATE_SECRET>` header (or `?secret=` query)

Env var:
```
REVALIDATE_SECRET=some-long-random-string

## Row Level Security (RLS) Policies

The schema enables Row Level Security on core tables. Baseline policies only grant full access to the `service_role`. If you query from the browser using the public *anon* key and get an empty array plus a dashboard notice like:

"Policies are required to query data"

…you need read policies that allow the `anon` role to `SELECT` rows.

### Recommended Public Read Policies

`supabase/migrations/008_public_read_policies.sql` adds safe read-only access:

1. Active products only:
```sql
CREATE POLICY "Public read active products" ON public.products
	FOR SELECT USING (is_active IS TRUE);
```
2. Variations of active products:
```sql
CREATE POLICY "Public read product variations" ON public.product_variations
	FOR SELECT USING (EXISTS (
		SELECT 1 FROM public.products p
		WHERE p.id = product_variations.product_id AND p.is_active IS TRUE
	));
```
3. (Optional) Public promo code discovery (remove if codes should stay hidden):
```sql
CREATE POLICY "Public read active promo codes" ON public.promo_codes
	FOR SELECT USING (
		is_active IS TRUE
		AND (starts_at IS NULL OR starts_at <= timezone('utc', now()))
		AND (ends_at IS NULL OR ends_at >= timezone('utc', now()))
	);
```

### Write / Mutation Policies

No `INSERT`, `UPDATE`, or `DELETE` permissions are granted to `anon`. All writes flow through server-side API routes using the `service_role` key (which bypasses RLS) ensuring inventory, pricing, and order integrity.

### Customizing Further

- Add customer-specific policies (e.g. a user can read their own orders) once auth is integrated:
```sql
CREATE POLICY "User read own orders" ON public.orders
	FOR SELECT USING ( auth.uid() IS NOT NULL AND customer_id = auth.uid() );
```
- Introduce soft-deletion: add `deleted_at` column and extend `USING` clauses with `deleted_at IS NULL`.
- Rate limiting / abuse controls remain application-level concerns; RLS only governs row visibility and mutation.

### Troubleshooting Empty Results

Checklist when queries return empty arrays:
1. Confirm table has data (`SELECT count(*) FROM public.products;`).
2. Verify RLS enabled (`SELECT relrowsecurity FROM pg_class WHERE relname='products';`).
3. List policies: `SELECT * FROM pg_policies WHERE tablename='products';`.
4. Ensure the policy predicate actually evaluates to TRUE for at least one row.
5. Re-run migration if the new policy file was added after initial deploy.

If policies exist but still no data, log `auth.role()` via a quick function:
```sql
CREATE OR REPLACE FUNCTION debug_role() RETURNS text LANGUAGE sql AS $$ SELECT auth.role(); $$;
SELECT debug_role();
```
The browser should show `anon`.

### Idempotency

All policy migrations use conditional creation (`IF NOT EXISTS`) or a DO block checking `pg_policies` so re-running migrations is safe on fresh environments.

```

Examples:
```
curl -H "x-revalidate-secret: $REVALIDATE_SECRET" https://your-domain/api/revalidate-products
curl -H "x-revalidate-secret: $REVALIDATE_SECRET" "https://your-domain/api/revalidate-products?all=true"
curl -H "x-revalidate-secret: $REVALIDATE_SECRET" "https://your-domain/api/revalidate-products?slug=hay-fertilizer"
curl -H "x-revalidate-secret: $REVALIDATE_SECRET" "https://your-domain/api/revalidate-products?all=true&skipIndex=true"
```

If the Supabase `products` table is absent the build still succeeds thanks to static fallback data; revalidation uses whichever source (DB or static fallback) is available.

## Database Migration Baseline

The project now uses a single consolidated baseline migration: `000_bigint_full_schema.sql`.

It includes:
- Core commerce tables (customers, orders, order_items)
- Products & product_variations (bigint IDs)
- Promo codes (`promo_codes`) with basic apply function `apply_promo(subtotal, code)`
- Analytics event logging table (`analytics_events`)
- Enriched products view `v_products_enriched`
- Trigram-enabled search function `search_products(q, lim)`
- Inventory decrement trigger on order item insert
- Seed products & variations (idempotent)

### Applying & Generating Types
```
npm install -g supabase
supabase link --project-ref <PROJECT_REF>
supabase db push
npx supabase gen types typescript --project-id <PROJECT_REF> --schema public > types/supabase.ts
```

### TypeScript Model Note
`Product.id` is `number` (bigint). For very large scale you can switch to serializing IDs as strings in responses if exceeding JS safe integer range becomes a concern.

## Development Notes
- Normalizer provides graceful fallback when DB rows unavailable.
- Variation pricing picks lowest variation if base price null.
- Admin endpoints secured via custom header token (`X-ADMIN-TOKEN`).
- Revalidation button hits `/api/revalidate` (ensure an API route exists that validates `x-admin-token` or `x-revalidate-secret`).
- Alerts tab uses `/api/alerts/*` endpoints with service role behind API.
- Analytics tab consumes `/api/analytics/summary`.
- CSV export is client-side only; adjust fields if you add columns.
- Inventory alert emails: triggered when product or variation inventory is updated (if new inventory <= subscriber threshold). Extend `sendEmail` in `lib/alertEmails.ts` to integrate a provider (Resend, SES, Postmark).
- Alert email cooldown: set `ALERT_COOLDOWN_MINUTES` (default 180) to avoid sending repeated low-inventory emails too frequently to the same subscription.
- Unsubscribe links: signed with `ALERT_UNSUBSCRIBE_SECRET` (fallback `REVALIDATE_SECRET`); `/api/alerts/unsubscribe?token=...` deactivates a subscription.
- Resend integration: set `RESEND_API_KEY` (+ optional `RESEND_FROM`) for real email delivery; fallback logs to console.
- Batch revalidation: `/api/revalidate-batch` supports `{ page, size, includeIndex }` for chunked regeneration.

## Email / Resend Diagnostics

Endpoints (admin token required):

1. `GET /api/email/health` – configuration & connectivity status
2. `POST /api/email/test` – sends a simple test message

Environment variables:
- `RESEND_API_KEY` – required for real sends
- `RESEND_FROM` – optional, e.g. `"Nature's Way Soil <no-reply@natureswaysoil.com>"`
- `ADMIN_API_TOKEN` – used to authorize these endpoints

Health response example:
```json
{
	"ok": true,
	"provider": "resend",
	"configured": true,
	"reachable": true,
	"from": "Nature's Way Soil <no-reply@natureswaysoil.com>",
	"fromDomain": "natureswaysoil.com",
	"fromDomainStatus": "verified",
	"domains": [ { "id": "dom_123", "name": "natureswaysoil.com", "status": "verified" } ]
}
```

Test send (replace values accordingly):
```bash
curl -X GET \
	-H "X-ADMIN-TOKEN: $ADMIN_API_TOKEN" \
	https://your-domain/api/email/health

curl -X POST \
	-H "Content-Type: application/json" \
	-H "X-ADMIN-TOKEN: $ADMIN_API_TOKEN" \
	-d '{"to":"you@example.com"}' \
	https://your-domain/api/email/test
```

If `configured` is false the application will still function; emails fall back to console logs for development. Avoid exposing these endpoints without auth; they can otherwise be abused to probe provider status or send unauthorized messages. For higher security consider adding rate limiting (e.g. via middleware or an edge function) and logging admin usage.

### Security Considerations

- Always require `X-ADMIN-TOKEN` for operational endpoints (`/api/email/*`, `/api/revalidate*`, promo/admin routes).
- Do not leak provider secrets or raw error bodies—surface only coarse error identifiers.
- Consider adding a simple in-memory or KV-based rate limiter (sliding window) for test/health endpoints.
- Log administrative actions (who triggered test send, when) for observability; integrate with your existing analytics/events pipeline.
- Rotate `RESEND_API_KEY` and `ADMIN_API_TOKEN` periodically; store them only in secure environment variable stores (Vercel / Docker secrets / HashiCorp Vault).


## Legal Pages
- [Privacy Policy](pages/privacy-policy.md)
- [Refund Policy](pages/refund-policy.md)

## Deployment
- Deploy to Vercel (see `vercel.json`).
- Use `REVALIDATE_SECRET` to trigger on-demand ISR after product or variation updates.

## Future Enhancements (Ideas)
- Public promo code validation endpoint (currently only DB function)
- Analytics ingestion endpoint batching & retention pruning
- Rate limiting on public search endpoint
- Automated low inventory email sender / cron
- Soft-delete support & audit logging

---
This README reflects the bigint-first migration strategy. Adjust or prune legacy files before first production migration.
\n+### Database Migrations & Types\n+\n+Migrations live in `supabase/migrations` and are ordered numerically. Apply them to your Supabase project with the CLI.\n+\n+1. Install CLI (if needed):\n+```bash\n+npm install -g supabase\n+```\n+2. Link your project (once):\n+```bash\n+supabase link --project-ref <PROJECT_REF>\n+```\n+3. Push local migrations:\n+```bash\n+supabase db push\n+```\n+4. (Optional) Generate a diff after manual DB changes:\n+```bash\n+supabase db diff --linked\n+```\n+5. Regenerate TypeScript types after any schema change:\n+```bash\n+npx supabase gen types typescript --project-id <PROJECT_REF> --schema public > types/supabase.ts\n+```\n+\n+Key migrations:\n+- `001_orders_add_tax_shipping.sql` – customers/orders/order_items base\n+- `002_product_tax_codes.sql` – tax code mapping table\n+- `003_products_table.sql` – products catalog (slug, pricing, inventory)\n+- `004_products_indexes.sql` – performance indexes + trigram search\n+\n+Regeneration keeps `types/supabase.ts` aligned with the database, enabling safer queries.\n+
## Legal Pages
- [Privacy Policy](pages/privacy-policy.md)
- [Refund Policy](pages/refund-policy.md)

## Deployment
- GitHub Actions workflow `.github/workflows/deploy-vercel.yml` deploys to Vercel on push to `main`.
- Last trigger: 2025-08-28.
- Redeploy triggered: 2025-09-10.
- Force refresh env vars: 2025-09-10.