// Test payment intent creation
async function testPaymentIntent() {
  console.log('🧪 Testing Payment Intent Creation...\n');

  const testData = {
    items: [{
      id: "1",
      title: "Test Product",
      image: "",
      sku: "TEST001",
      size: "32 oz",
      price: 25.99,
      qty: 1
    }],
    customer: {
      name: "Test Customer",
      email: "test@example.com"
    },
    address: {
      line1: "123 Test St",
      city: "Test City",
      state: "NC",
      postal_code: "27513",
      country: "US"
    }
  };

  try {
    const response = await fetch('http://localhost:3000/api/create-payment-intent-with-tax', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });

    const data = await response.json();

    console.log('Response Status:', response.status);
    console.log('Response Data:', data);

    if (response.ok) {
      console.log('✅ Payment Intent Created Successfully!');
      console.log('Client Secret:', data.clientSecret ? 'Present' : 'Missing');
      console.log('Intent ID:', data.intentId ? 'Present' : 'Missing');
      if (data.breakdown) {
        console.log('Breakdown:', data.breakdown);
      }
    } else {
      console.log('❌ Payment Intent Creation Failed');
      console.log('Error:', data.error);
    }
  } catch (error) {
    console.log('❌ Network Error:', error.message);
  }
}

testPaymentIntent();
