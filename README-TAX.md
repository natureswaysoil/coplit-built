# Sales Tax & Shipping Fields Setup

## 1) Supabase schema update

Run this SQL in Supabase (SQL editor) to add tax and shipping fields to `public.orders`:

- File: `supabase/migrations/001_orders_add_tax_shipping.sql`

These columns are added:
- tax numeric(10,2) not null default 0
- shipping_state text
- shipping_county text
- shipping_zip text
- shipping_city text
- shipping_address1 text
- shipping_address2 text

If Row Level Security (RLS) is enabled, ensure your inserts are allowed for anonymous users or route via a server-side key.

## 2) Configure tax rate env vars

In Vercel → Project → Settings → Environment Variables:
- `NEXT_PUBLIC_NC_TAX_RATE` — base NC rate (e.g., `0.0475` for 4.75%)
- `NEXT_PUBLIC_NC_COUNTY_RATES` — JSON mapping for county add-ons (keys lowercased). Example:
  {
    "wake": 0.0225,
    "mecklenburg": 0.02,
    "durham": 0.0225
  }

## 3) What the app does
- Checkout computes `tax = subtotal * (NC base + county add-on)` only when state = NC.
- Order stores `total`, `tax`, and shipping fields (fallback to minimal insert if columns don’t exist).
- Confirmation email includes Subtotal, Sales Tax, Total, and Ship To address.

## 4) Testing
- Try checkout with state = NC and fill a county from your JSON map.
- Try with state = Other (tax should be 0).

## 5) Next steps (optional)
- Add full ZIP-based rates or plug a tax API.
- Add server-side validation and service-key API route if RLS blocks inserts.