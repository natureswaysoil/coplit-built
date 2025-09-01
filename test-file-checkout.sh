#!/bin/bash

echo "🧪 Testing File-Based Live Checkout System"
echo "=========================================="

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
echo "Testing orders list endpoint..."
curl http://localhost:3004/api/orders | jq '.'

echo ""
echo "Testing order-confirmation endpoint..."
curl -X POST http://localhost:3004/api/order-confirmation \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "ORD-20250829-120000",
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
echo "Checking data files..."
echo "Orders file:"
if [ -f "data/orders.json" ]; then
    cat data/orders.json | jq '. | length' 2>/dev/null || echo "No valid JSON in orders.json"
else
    echo "orders.json not found"
fi

echo "Customers file:"
if [ -f "data/customers.json" ]; then
    cat data/customers.json | jq '. | length' 2>/dev/null || echo "No valid JSON in customers.json"
else
    echo "customers.json not found"
fi

echo ""
echo "=========================================="
echo "✅ File-Based System Test Complete!"
echo ""
echo "🎉 If you see real order IDs and data saved to files, you're LIVE!"
echo "📊 View orders at: http://localhost:3004/admin"
echo "📁 Data stored in: /workspaces/coplit-built/data/"
