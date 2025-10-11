#!/usr/bin/env node
/**
 * Script to create SAVE15 promo code in Stripe
 * This creates a 15% discount coupon that can be used at checkout
 * 
 * Usage: node scripts/create-save15-promo.js
 */

const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

async function createPromoCode() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  
  if (!stripeSecretKey) {
    console.error('❌ Error: STRIPE_SECRET_KEY not found in environment variables');
    console.error('Please make sure .env.local exists and contains STRIPE_SECRET_KEY');
    process.exit(1);
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2023-10-16',
  });

  try {
    console.log('🔍 Checking if SAVE15 coupon already exists...');
    
    // Check if coupon already exists
    let coupon;
    try {
      coupon = await stripe.coupons.retrieve('SAVE15');
      console.log('✅ Coupon SAVE15 already exists');
    } catch (err) {
      if (err.code === 'resource_missing') {
        // Create the coupon
        console.log('📝 Creating new coupon SAVE15...');
        coupon = await stripe.coupons.create({
          id: 'SAVE15',
          name: '15% Off',
          percent_off: 15,
          duration: 'forever',
          metadata: {
            description: 'Welcome discount - 15% off entire order',
            created_by: 'setup_script'
          }
        });
        console.log('✅ Coupon created successfully');
      } else {
        throw err;
      }
    }

    console.log('\n📋 Coupon Details:');
    console.log(`   ID: ${coupon.id}`);
    console.log(`   Name: ${coupon.name}`);
    console.log(`   Discount: ${coupon.percent_off}%`);
    console.log(`   Duration: ${coupon.duration}`);

    // Check if promotion code already exists
    console.log('\n🔍 Checking if SAVE15 promotion code already exists...');
    const existingPromoCodes = await stripe.promotionCodes.list({
      code: 'SAVE15',
      limit: 1
    });

    let promoCode;
    if (existingPromoCodes.data.length > 0) {
      promoCode = existingPromoCodes.data[0];
      console.log('✅ Promotion code SAVE15 already exists');
    } else {
      // Create the promotion code
      console.log('📝 Creating promotion code SAVE15...');
      promoCode = await stripe.promotionCodes.create({
        coupon: coupon.id,
        code: 'SAVE15',
        active: true,
        metadata: {
          description: 'Welcome discount code',
          created_by: 'setup_script'
        }
      });
      console.log('✅ Promotion code created successfully');
    }

    console.log('\n📋 Promotion Code Details:');
    console.log(`   Code: ${promoCode.code}`);
    console.log(`   Active: ${promoCode.active}`);
    console.log(`   Coupon: ${promoCode.coupon.id}`);
    console.log(`   Discount: ${promoCode.coupon.percent_off}%`);

    console.log('\n✨ Success! The SAVE15 promo code is ready to use.');
    console.log('\n💡 Customers can now use code "SAVE15" at checkout for 15% off!');
    console.log('\n🔗 View in Stripe Dashboard:');
    console.log(`   https://dashboard.stripe.com/coupons/${coupon.id}`);

  } catch (error) {
    console.error('\n❌ Error creating promo code:', error.message);
    if (error.type === 'StripeAuthenticationError') {
      console.error('\n💡 Tip: Make sure your STRIPE_SECRET_KEY is correct and starts with "sk_"');
    }
    process.exit(1);
  }
}

// Run the script
createPromoCode();
