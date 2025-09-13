
## Features
- Product catalog (fallback to static seed if DB unavailable)
- Variations and dynamic pricing
- Cart functionality
- User authentication (Supabase)
- Privacy & Refund policy pages (Markdown -> rendered)
- Stripe-ready Payment Element integration
- ISR revalidation endpoint for catalog freshness

## Getting Started
1. Clone the repo
2. Install dependencies
3. Set up Supabase & Stripe environment variables
4. Run `npm run dev`

## Environment Variables (excerpt)
Provide at minimum:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `REVALIDATE_SECRET`

## ISR Revalidation Endpoint
Endpoint: `/api/revalidate-products`

Env var:
```
REVALIDATE_SECRET=some-long-random-string
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
- Admin endpoints secured via custom header token (consider hardening with JWT / RLS policies per role).

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
- Admin UI for inventory & variation management

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