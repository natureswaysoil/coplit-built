# Nature's Way Soil Store

Next.js (Pages Router) store with cart, NC tax, Stripe payments, and file-based order storage.

## Features
- Product catalog and cart
- NC tax + county auto-fill from ZIP (checkout)
- Stripe Elements payments (PaymentIntent REST API)
- Orders/customers saved in `data/` (JSON)
- Admin Orders page `/admin`
- Health check `/api/health`

## Local development

1) Install deps

```
npm ci
```

2) Create `.env.local` and set required envs (see below)

3) Run dev

```
npm run dev
```

Open http://localhost:3000

## Environment variables

Required:
- STRIPE_SECRET_KEY
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- NEXT_PUBLIC_NC_TAX_RATE (e.g., 0.0475)
- NEXT_PUBLIC_NC_COUNTY_RATES (JSON map, e.g., {"wake":0.025,"durham":0.0225})
- RESEND_API_KEY (optional for emails)

## Production build

```
npm run build
npm run start -- -p 3000 -H 0.0.0.0
```

Smoke checks:
- /smoke-ui — add to cart and create order via API
- /admin — view orders
- /api/health — env key presence

## Docker

Build and run:

```
docker build -t natureswaysoil-store .
docker run --rm -p 3000:3000 \
	-e STRIPE_SECRET_KEY=... \
	-e NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=... \
	-e NEXT_PUBLIC_NC_TAX_RATE=0.0475 \
	-e NEXT_PUBLIC_NC_COUNTY_RATES='{"wake":0.025,"durham":0.0225}' \
	-e RESEND_API_KEY=... \
	-v $(pwd)/data:/app/data \
	natureswaysoil-store
```

Note: Mount `data/` for persistent orders.

### Troubleshooting 401 from Stripe

- 401 usually means STRIPE_SECRET_KEY is missing or invalid (using a pk_ publishable key by mistake).
- Verify envs inside the running app: open /api/health — hasSecret and hasPublishable should both be true.
- If using Docker, ensure you pass -e STRIPE_SECRET_KEY=sk_... and -e NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
- Check server logs for the exact error from /api/create-payment-intent.

## Vercel

Serverless file systems are ephemeral. Use a database (Vercel Postgres, Supabase) for orders instead of `data/` when deploying to Vercel.