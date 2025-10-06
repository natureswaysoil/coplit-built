# Promo Code Setup Guide

## SAVE15 - 15% Discount Coupon

This guide explains how to set up and use the SAVE15 promo code for 15% off orders.

## Quick Setup

### Option 1: Automated Script (Recommended)

Run the setup script to automatically create the promo code in Stripe:

```bash
node scripts/create-save15-promo.js
```

This script will:
- Create a coupon with ID "SAVE15" (15% off)
- Create a promotion code "SAVE15" linked to the coupon
- Check if they already exist to avoid duplicates
- Display confirmation and Stripe dashboard links

### Option 2: Manual Setup via Stripe Dashboard

1. Go to [Stripe Dashboard > Coupons](https://dashboard.stripe.com/coupons)
2. Click "Create coupon"
3. Fill in the details:
   - **ID**: SAVE15
   - **Name**: 15% Off
   - **Type**: Percentage
   - **Percent off**: 15
   - **Duration**: Forever (or set expiration as needed)
4. Click "Create coupon"
5. Go to [Promotion Codes](https://dashboard.stripe.com/promotion_codes)
6. Click "Create promotion code"
7. Select the SAVE15 coupon
8. Set code to: **SAVE15**
9. Make sure "Active" is checked
10. Click "Create promotion code"

## How It Works

### Customer Experience

1. Customer adds items to cart
2. Goes to checkout page
3. Sees "Have a Promo Code?" section
4. Enters "SAVE15" in the input field
5. Clicks "Apply"
6. System validates the code with Stripe
7. If valid, discount is applied to the order
8. Order total is recalculated with 15% off
9. Customer completes payment with discounted price

### Technical Flow

1. **Frontend** (`pages/checkout.tsx`):
   - Promo code input field with validation
   - "Apply" button triggers validation
   - Success/error messages displayed
   - Discount shown in order summary

2. **Validation API** (`pages/api/promo/validate.ts`):
   - Receives promo code from frontend
   - Queries Stripe for active promotion codes
   - Returns validation result and coupon details

3. **Payment Intent API** (`pages/api/create-payment-intent-with-tax.ts`):
   - Receives promo code with order details
   - Fetches promotion code from Stripe
   - Applies discount to line items
   - Creates payment intent with discounted amount
   - Stores promo code in order metadata

## Testing the Promo Code

### Test in Development

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Add items to cart and go to checkout

3. Fill in shipping information

4. Enter "SAVE15" in the promo code field

5. Click "Apply"

6. Verify:
   - Green success message appears
   - Discount line shows in order summary
   - Total is reduced by 15%

### Test with Stripe Test Mode

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Any future expiry date
- Any CVC

## Customization

### Change Discount Percentage

Edit `scripts/create-save15-promo.js`:

```javascript
percent_off: 20,  // Change from 15 to 20 for 20% off
```

### Set Expiration Date

Add expiration to the coupon:

```javascript
coupon = await stripe.coupons.create({
  id: 'SAVE15',
  name: '15% Off',
  percent_off: 15,
  duration: 'once',  // or 'repeating'
  redeem_by: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days from now
});
```

### Limit Usage

Add usage limits to the promotion code:

```javascript
promoCode = await stripe.promotionCodes.create({
  coupon: coupon.id,
  code: 'SAVE15',
  active: true,
  max_redemptions: 100,  // Limit to 100 uses
  restrictions: {
    minimum_amount: 5000,  // Minimum $50 order (in cents)
    minimum_amount_currency: 'usd'
  }
});
```

## Creating Additional Promo Codes

### Example: WELCOME20 (20% off)

```javascript
// Create coupon
const coupon = await stripe.coupons.create({
  id: 'WELCOME20',
  name: '20% Off Welcome',
  percent_off: 20,
  duration: 'once'
});

// Create promotion code
const promoCode = await stripe.promotionCodes.create({
  coupon: 'WELCOME20',
  code: 'WELCOME20',
  active: true
});
```

### Example: FREESHIP (Free shipping)

For free shipping, you would need to:
1. Create a fixed amount coupon for your shipping cost
2. Or handle it in the checkout logic separately

## Troubleshooting

### "Invalid or expired promo code" Error

**Possible causes:**
- Code doesn't exist in Stripe
- Code is inactive
- Code has expired
- Code has reached max redemptions

**Solution:**
- Check Stripe dashboard for the promotion code
- Verify it's active
- Run the setup script again

### Discount Not Applied

**Possible causes:**
- Promo code validation succeeded but payment intent not refreshed
- Network error during validation

**Solution:**
- Check browser console for errors
- Verify API endpoints are working
- Check Stripe API logs

### Script Fails to Create Code

**Possible causes:**
- Missing or invalid STRIPE_SECRET_KEY
- Network connectivity issues
- Stripe API error

**Solution:**
- Verify `.env.local` has correct STRIPE_SECRET_KEY
- Check Stripe API status
- Review error message for details

## Monitoring Usage

### View Promo Code Usage in Stripe

1. Go to [Stripe Dashboard > Promotion Codes](https://dashboard.stripe.com/promotion_codes)
2. Click on "SAVE15"
3. View redemption statistics:
   - Times redeemed
   - Total discount amount
   - Recent redemptions

### Track in Your Database

The promo code is stored in the `orders` table:
- `promo_code` column contains the code used
- `discount_cents` column contains the discount amount

Query example:
```sql
SELECT 
  promo_code,
  COUNT(*) as usage_count,
  SUM(discount_cents) as total_discount
FROM orders
WHERE promo_code IS NOT NULL
GROUP BY promo_code;
```

## Security Considerations

1. **Rate Limiting**: Consider adding rate limiting to prevent abuse
2. **Validation**: Always validate promo codes server-side
3. **Expiration**: Set reasonable expiration dates
4. **Usage Limits**: Limit redemptions per customer if needed
5. **Monitoring**: Monitor for unusual usage patterns

## Support

For issues or questions:
- Check Stripe Dashboard for promotion code status
- Review API logs in Stripe Dashboard
- Check application logs for errors
- Contact support@natureswaysoil.com
