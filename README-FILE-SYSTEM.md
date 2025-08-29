# Nature's Way Soil - File-Based E-commerce System

## 🚀 You're LIVE! (File-Based Version)

This system is now running **completely independently** of Supabase using a simple, reliable file-based storage system.

## 📁 How It Works

- **Orders** are stored in `data/orders.json`
- **Customers** are stored in `data/customers.json`
- **No database setup required** - works immediately
- **Real order numbers** like `ORD-20250829-120000`
- **Email confirmations** still work via Resend
- **NC county tax calculation** with ZIP auto-fill

## 🛠️ Quick Start

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Test checkout:**
   - Visit `http://localhost:3004/checkout`
   - Add items to cart
   - Fill out form with NC ZIP code
   - Place order

3. **View orders:**
   - Visit `http://localhost:3004/admin`
   - See all orders in a clean dashboard

## 📊 Data Files

### `data/orders.json`
Contains all order information:
```json
[
  {
    "id": "order_1234567890_abc123",
    "orderNumber": "ORD-20250829-120000",
    "customerId": "cust_1234567890_def456",
    "customer": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "555-123-4567",
      "address1": "123 Main St",
      "city": "Raleigh",
      "state": "NC",
      "zip": "27601",
      "county": "Wake"
    },
    "items": [
      {
        "sku": "NWS-5G",
        "title": "Nature's Way Soil - Premium Blend",
        "size": "5 Gallon",
        "qty": 2,
        "price": 25.00,
        "total": 50.00
      }
    ],
    "subtotal": 50.00,
    "tax": 3.00,
    "total": 53.00,
    "status": "confirmed",
    "createdAt": "2025-08-29T12:00:00.000Z"
  }
]
```

### `data/customers.json`
Contains customer information:
```json
[
  {
    "id": "cust_1234567890_def456",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-123-4567",
    "createdAt": "2025-08-29T12:00:00.000Z"
  }
]
```

## 🔧 API Endpoints

### `POST /api/order-create`
Creates a new order and saves it to file.

**Request Body:**
```json
{
  "customer": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-123-4567",
    "address1": "123 Main St",
    "city": "Raleigh",
    "state": "NC",
    "zip": "27601",
    "county": "Wake"
  },
  "items": [
    {
      "sku": "NWS-5G",
      "title": "Nature's Way Soil",
      "size": "5 Gallon",
      "qty": 2,
      "price": 25.00
    }
  ],
  "subtotal": 50.00,
  "tax": 3.00,
  "total": 53.00
}
```

### `GET /api/orders`
Returns all orders for the admin dashboard.

### `POST /api/order-confirmation`
Sends order confirmation email (requires Resend API key).

## 🧪 Testing

Run the test script to verify everything works:

```bash
./test-file-checkout.sh
```

## 📈 Features

- ✅ **Immediate deployment** - no database setup
- ✅ **Real order numbers** with timestamps
- ✅ **NC county tax calculation** with ZIP auto-fill
- ✅ **Email confirmations** via Resend
- ✅ **Admin dashboard** at `/admin`
- ✅ **Customer management** with deduplication
- ✅ **Order status tracking**
- ✅ **Complete order history**

## 🔄 Switching to Database Later

When you're ready to scale up, you can easily switch to Supabase or any database:

1. Update the API files to use database queries
2. Import your existing JSON data
3. Update the admin dashboard to use database queries

## 📞 Support

- **Orders Dashboard:** `http://localhost:3004/admin`
- **Checkout Page:** `http://localhost:3004/checkout`
- **Data Files:** `./data/orders.json` and `./data/customers.json`

## 🎉 You're Live!

Your e-commerce site is now fully operational with:
- Working checkout system
- Tax calculations
- Order management
- Email confirmations
- Admin dashboard

No more Supabase setup issues - just pure, working e-commerce! 🚀
