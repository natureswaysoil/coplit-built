// Test Stripe configuration
async function testStripeConfig() {
  try {
    console.log('Testing Stripe configuration...');

    // Test publishable key endpoint
    const pkResponse = await fetch('http://localhost:3000/api/config/stripe-pk');
    const pkData = await pkResponse.json();

    console.log('Publishable Key Status:', pkResponse.status);
    console.log('Publishable Key:', pkData.publishableKey ? 'Present' : 'Missing');

    if (!pkResponse.ok) {
      console.log('❌ Stripe publishable key not configured properly');
      return;
    }

    // Test payment intent creation with minimal data
    const piResponse = await fetch('http://localhost:3000/api/create-payment-intent-with-tax', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{
          id: 'test',
          title: 'Test Product',
          image: '',
          sku: 'TEST001',
          size: '32 oz',
          price: 25.99,
          qty: 1
        }],
        customer: { name: 'Test User', email: 'test@example.com' },
        address: {
          line1: '123 Test St',
          city: 'Test City',
          state: 'NC',
          postal_code: '27513',
          country: 'US'
        }
      })
    });

    const piData = await piResponse.json();
    console.log('Payment Intent Status:', piResponse.status);
    console.log('Payment Intent Error:', piData.error || 'None');

    if (piResponse.ok) {
      console.log('✅ Stripe configuration is working!');
    } else {
      console.log('❌ Stripe secret key or configuration issue');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testStripeConfig();
