#!/bin/bash

# Database Setup Script for Nature's Way Soil E-commerce
# This script will help you set up your Supabase database

echo "Nature's Way Soil - Database Setup"
echo "======================================"

# Check if environment variables are set
if [ -f .env.local ]; then
    echo "Found .env.local file"
    source .env.local
else
    echo "No .env.local file found"
    echo "Please create .env.local with your Supabase credentials"
    exit 1
fi

# Validate required environment variables
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "Missing required Supabase environment variables"
    echo "Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY"
    exit 1
fi

echo "Environment variables configured"
echo "Project URL: $NEXT_PUBLIC_SUPABASE_URL"

# Test connection
echo ""
echo "Testing connection to Supabase..."
HEALTH_CHECK=$(curl -s -w "%{http_code}" -o /dev/null \
    -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
    -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
    "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/")

if [ "$HEALTH_CHECK" = "200" ] || [ "$HEALTH_CHECK" = "404" ]; then
    echo "Supabase connection successful (HTTP $HEALTH_CHECK)"
else
    echo "Supabase connection failed (HTTP $HEALTH_CHECK)"
    echo "Please check:"
    echo "  1. Your project is active at https://supabase.com/dashboard"
    echo "  2. Your URL and keys are correct"
    echo "  3. Supabase service status at https://status.supabase.com"
    exit 1
fi

# Show migration files
echo ""
echo "📄 Database Migration Files:"
if [ -d "supabase/migrations" ]; then
    ls -la supabase/migrations/
else
    echo "No migration files found in supabase/migrations/"
    exit 1
fi

echo ""
echo "Database Tables to Create:"
echo "  • customers - Store customer information"
echo "  • orders - Store order details with tax/shipping"
echo "  • order_items - Store individual order items"
echo ""

# Instructions for manual setup
echo "MANUAL SETUP REQUIRED:"
echo ""
echo "1. Open your Supabase project dashboard:"
echo "   Open https://supabase.com/dashboard and select your project"
echo ""
echo "2. Go to the SQL Editor tab"
echo ""
echo "3. Copy and paste the SQL from this file:"
echo "   Run: $(pwd)/supabase/migrations/001_orders_add_tax_shipping.sql"
echo ""
echo "4. Click 'RUN' to execute the migration"
echo ""
echo "5. Test the setup by running:"
echo "   Run: npm run dev"
echo "   Run: curl http://localhost:3000/api/test-supabase"
echo ""

# Show the SQL content for easy copying
echo "SQL TO COPY (copy everything between the lines):"
echo "=" | tr '=' '='
echo "$(printf '=%.0s' {1..60})"
cat supabase/migrations/001_orders_add_tax_shipping.sql
echo "$(printf '=%.0s' {1..60})"
echo ""

echo "✨ After running the SQL migration, your database will be ready!"
echo "This will enable full checkout functionality with order storage."
