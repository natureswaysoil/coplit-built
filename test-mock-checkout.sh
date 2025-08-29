#!/bin/bash

echo "Testing Mock Checkout System..."
echo "================================"

# Test the order-create endpoint
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
        "id": "test-product",
        "title": "Test Product",
        "size": "5 Gallon",
        "qty": 2,
        "price": 25.00,
        "sku": "TEST-001"
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
    "orderId": "TEST-12345",
    "email": "test@example.com",
    "name": "Test Customer",
    "items": [
      {
        "title": "Test Product",
        "size": "5 Gallon",
        "qty": 2,
        "price": 25.00,
        "sku": "TEST-001"
      }
    ],
    "subtotal": 50.00,
    "tax": 3.00,
    "total": 53.00
  }' | jq '.'

echo ""
echo "Testing test-supabase endpoint..."
curl http://localhost:3004/api/test-supabase | jq '.'

echo ""
echo "================================"
echo "Mock Checkout System Test Complete!"
