# Stripe Setup Instructions

## Issue
The "connection to Stripe" error occurs when the Stripe publishable key or secret key is missing, invalid, or mismatched.

## Solution Steps

### 1. Get Your Stripe Keys
- Go to [Stripe Dashboard](https://dashboard.stripe.com)
- Navigate to Developers > API keys
- Copy your **Test** keys (for development):
  - Publishable key (starts with `pk_test_...`)
  - Secret key (starts with `sk_test_...`)

### 2. Update Environment Variables

#### For Local Development (.env.local):
```bash
# Add these to /workspaces/coplit-built/.env.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

#### For Vercel Deployment:
1. Go to Vercel Dashboard > Project Settings > Environment Variables
2. Add these variables:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = your publishable key
   - `STRIPE_SECRET_KEY` = your secret key  
   - `STRIPE_WEBHOOK_SECRET` = your webhook secret
3. Redeploy after adding variables

### 3. Test the Connection
After updating the keys, the checkout should work with:
- Name: James Jones
- Email: natureswaysoil@gmail.com
- Phone: 2525607390
- Address: 533 Eden Church Rd.
- City: Snow Hill, NC
- State: NC
- ZIP: 28580

### 4. Test Payment
Use Stripe test card numbers:
- Success: `4242 4242 4242 4242`
- Declined: `4000 0000 0000 0002`
- Any future expiry date and any 3-digit CVC

## Current Features
 Full billing/shipping address collection
 NC sales tax calculation by ZIP/city
 Runtime Stripe key loading (no build-time env issues)
 Onsite checkout with Stripe Elements
 Order confirmation and webhooks

## Next Steps
1. Replace the organic gardening solution keys in `.env.local` with your actual Stripe test keys
2. Set the same keys in Vercel environment variables  
3. Test checkout locally first, then push to production
 STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY
 STRIPE_WEBHOOK_SECRET=YOUR_STRIPE_WEBHOOK_SECRET
