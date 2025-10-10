# Stripe Key Security Guide

## SAFE SETUP

### Local Development (.env.local)
```bash
# Use TEST keys only - these are safe and won't charge real money
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### Production (Vercel Environment Variables)
```bash
# Use LIVE keys only on production servers
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

## Security Best Practices

1. **Never commit live keys to git**
2. **Use test keys for all local development**
3. **Live keys only on secure production servers**
4. **Regularly rotate your keys**

## Testing

With test keys, you can safely test with these cards:
- Success: `4242 4242 4242 4242`
- Declined: `4000 0000 0000 0002`
- Require authentication: `4000 0000 0000 3220`

## 🚨 If You Accidentally Exposed Live Keys

1. Immediately revoke the keys in Stripe Dashboard
2. Generate new live keys
3. Update production environment variables
4. Never commit the compromised keys

## Current Setup Status

- Local: Should use test keys (publishable and secret)
- Vercel: Has your live keys (publishable and secret)
- Code: Runtime key loading prevents build-time exposure
