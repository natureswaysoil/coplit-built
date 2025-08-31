./lib/supabaseAdmin.ts
./lib/taxCodes.ts

./pages/api/promo/validate.ts
./pages/api/promo/suggest.ts
./pages/api/create-payment-intent-with-tax.ts
./pages/api/webhooks/stripe.ts

./components/PromoField.tsx
./components/CheckoutForm_Tax.tsx

./cart/CartContext.tsx   (only if you don’t already have your own)

./pages/_app.tsx         (merge with yours if it exists)
./pages/checkout.tsx

./styles.css

./.env.local             (create from .env.local.example)

./migrations/2025_08_31_add_product_tax_codes.sql  (run this in Supabase — not needed in repo)
