// Test the checkout API endpoints
require('dotenv').config({ path: '.env.local' });

async function testCheckoutAPI() {
  console.log('🧪 Testing Checkout API Endpoints...\n');

  const baseUrl = 'http://localhost:3000';

  try {
    // Test health endpoint
    console.log('🏥 Testing health endpoint...');
    const healthResponse = await fetch(`${baseUrl}/api/health`);
    const healthData = await healthResponse.json();
    console.log(`✅ Health: ${healthResponse.status} - ${healthData.status || 'OK'}`);

    // Test Supabase connection
    console.log('\n🔗 Testing Supabase connection...');
    const supabaseResponse = await fetch(`${baseUrl}/api/test-supabase`);
    const supabaseData = await supabaseResponse.json();

    if (supabaseResponse.ok) {
      console.log('✅ Supabase API: Connected');
      console.log('📊 Tables Status:');
      console.log(`   • Customers: ${supabaseData.tables?.customers?.exists ? '✅' : '❌'}`);
      console.log(`   • Orders: ${supabaseData.tables?.orders?.exists ? '✅' : '❌'}`);
      console.log(`   • Order Items: ${supabaseData.tables?.order_items?.exists ? '✅' : '❌'}`);
    } else {
      console.log('❌ Supabase API Error:', supabaseData.error);
    }

    // Test Stripe configuration
    console.log('\n💳 Testing Stripe configuration...');
    const stripeResponse = await fetch(`${baseUrl}/api/config/stripe-pk`);
    const stripeData = await stripeResponse.json();

    if (stripeResponse.ok && stripeData.publishableKey) {
      console.log('✅ Stripe: Configured');
    } else {
      console.log('❌ Stripe: Not configured');
    }

    // Test payment intent creation (with minimal data)
    console.log('\n💰 Testing payment intent creation...');
    const testItems = [{
      id: 'test-001',
      title: 'Test Product',
      image: '',
      sku: 'TEST001',
      size: '32 oz',
      price: 25.99,
      qty: 1
    }];

    const testCustomer = {
      name: 'Test Customer',
      email: 'test@example.com'
    };

    const testAddress = {
      line1: '123 Test St',
      city: 'Test City',
      state: 'NC',
      postal_code: '27513',
      country: 'US'
    };

    const paymentIntentResponse = await fetch(`${baseUrl}/api/create-payment-intent-with-tax`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: testItems,
        customer: testCustomer,
        address: testAddress
      })
    });

    const paymentIntentData = await paymentIntentResponse.json();

    if (paymentIntentResponse.ok) {
      console.log('✅ Payment Intent: Created successfully');
      console.log(`   • Client Secret: ${paymentIntentData.clientSecret ? 'Present' : 'Missing'}`);
      console.log(`   • Intent ID: ${paymentIntentData.intentId ? 'Present' : 'Missing'}`);
      if (paymentIntentData.breakdown) {
        console.log(`   • Subtotal: $${(paymentIntentData.breakdown.subtotal / 100).toFixed(2)}`);
        console.log(`   • Tax: $${(paymentIntentData.breakdown.tax / 100).toFixed(2)}`);
        console.log(`   • Total: $${(paymentIntentData.breakdown.total / 100).toFixed(2)}`);
      }
    } else {
      console.log('❌ Payment Intent Error:', paymentIntentData.error);
    }

    console.log('\n🎉 Checkout API Test Complete!');

    // Summary
    const allGood = supabaseResponse.ok && stripeResponse.ok && paymentIntentResponse.ok;
    if (allGood) {
      console.log('\n✅ SUCCESS: All systems operational!');
      console.log('🚀 Your checkout process is fully functional!');
      console.log('\n🌐 Test your checkout at: http://localhost:3000/checkout');
    } else {
      console.log('\n⚠️  Some issues detected - check the errors above');
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the development server is running:');
    console.log('   npm run dev');
  }
}

testCheckoutAPI();
