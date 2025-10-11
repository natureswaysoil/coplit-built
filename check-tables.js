// Simple table creation using Supabase client
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function createTablesSimple() {
  console.log('🔧 Creating database tables using Supabase client...\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Missing Supabase environment variables');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  try {
    // Test existing tables
    console.log('🧪 Testing existing tables...');

    const { error: customersError } = await supabase
      .from('customers')
      .select('id')
      .limit(1);

    const { error: ordersError } = await supabase
      .from('orders')
      .select('id')
      .limit(1);

    const { error: orderItemsError } = await supabase
      .from('order_items')
      .select('id')
      .limit(1);

    console.log('📊 Current Table Status:');
    console.log(`📋 Customers: ${customersError ? '❌ Missing' : '✅ Exists'}`);
    console.log(`📋 Orders: ${ordersError ? '❌ Missing' : '✅ Exists'}`);
    console.log(`📋 Order Items: ${orderItemsError ? '❌ Missing' : '✅ Exists'}`);

    if (!customersError && !ordersError && !orderItemsError) {
      console.log('\n🎉 All tables already exist! Your database is ready.');
      return;
    }

    console.log('\n📝 Missing tables detected. Please create them manually:');
    console.log('\n1️⃣ Go to Supabase Dashboard → Table Editor');
    console.log('2️⃣ Click "New Table" for each missing table');

    if (customersError) {
      console.log('\n📋 Create CUSTOMERS table with these columns:');
      console.log('   • id (uuid, primary key, default: gen_random_uuid())');
      console.log('   • name (text, not null)');
      console.log('   • email (text, unique, not null)');
      console.log('   • created_at (timestamp with time zone, default: now())');
    }

    if (ordersError) {
      console.log('\n📋 Create ORDERS table with these columns:');
      console.log('   • id (uuid, primary key, default: gen_random_uuid())');
      console.log('   • customer_id (uuid, foreign key to customers.id)');
      console.log('   • total (numeric(10,2), not null)');
      console.log('   • tax (numeric(10,2), default: 0)');
      console.log('   • shipping_state (text)');
      console.log('   • shipping_county (text)');
      console.log('   • shipping_zip (text)');
      console.log('   • shipping_city (text)');
      console.log('   • shipping_address1 (text)');
      console.log('   • shipping_address2 (text)');
      console.log('   • shipping_phone (text)');
      console.log('   • created_at (timestamp with time zone, default: now())');
    }

    if (orderItemsError) {
      console.log('\n📋 Create ORDER_ITEMS table with these columns:');
      console.log('   • id (uuid, primary key, default: gen_random_uuid())');
      console.log('   • order_id (uuid, foreign key to orders.id)');
      console.log('   • sku (text, not null)');
      console.log('   • qty (integer, not null)');
      console.log('   • price (numeric(10,2), not null)');
      console.log('   • created_at (timestamp with time zone, default: now())');
    }

    console.log('\n🔒 After creating tables, enable Row Level Security:');
    console.log('   • Go to Authentication → Policies');
    console.log('   • Create policies for service role access');

    console.log('\n🧪 Test after creation:');
    console.log('   curl http://localhost:3000/api/test-supabase');

  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

createTablesSimple();
