#!/bin/bash

echo "🧪 Testing Live Checkout System"
echo "==============================="

# Test the order-create endpoint with live data
echo "Testing order-create endpoint..."
curl -X POST http://localhost:3004/api/order-create \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "name": "Test Customer",
      "email": "test@example.com",
      "phone": "555-123-4567",
      "address1": "123 Test St",
      "city": "Raleigh",
      "state": "NC",
      "zip": "27601",
      "county": "Wake"
    },
    "items": [
      {
        "sku": "NWS-5G",
        "title": "Nature'\''s Way Soil - Premium Blend",
        "size": "5 Gallon",
        "qty": 2,
        "price": 25.00
      }
    ],
    "subtotal": 50.00,
    "tax": 3.00,
    "total": 53.00
  }' | jq '.'

echo ""
echo "Testing order-confirmation endpoint..."
curl -X POST http://localhost:3004/api/order-confirmation \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "ORD-20250828-001",
    "email": "test@example.com",
    "name": "Test Customer",
    "items": [
      {
        "sku": "NWS-5G",
        "title": "Nature'\''s Way Soil - Premium Blend",
        "size": "5 Gallon",
        "qty": 2,
        "price": 25.00
      }
    ],
    "subtotal": 50.00,
    "tax": 3.00,
    "total": 53.00,
    "shipping": {
      "address1": "123 Test St",
      "city": "Raleigh",
      "state": "NC",
      "zip": "27601",
      "county": "Wake"
    }
  }' | jq '.'

echo ""
echo "Testing test-supabase endpoint..."
curl http://localhost:3004/api/test-supabase | jq '.'

echo ""
echo "==============================="
echo "Live System Test Complete!"
echo ""
echo "✅ If you see real order IDs and no mock messages, you're LIVE!"
echo "❌ If you see mock responses, check your Supabase setup."
