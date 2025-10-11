// Script to create database tables using Supabase client
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function createTables() {
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
    console.log('📋 Creating customers table...');
    const { error: customersError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.customers (
          id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
          name text NOT NULL,
          email text UNIQUE NOT NULL,
          created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
        );
      `
    });

    if (customersError) {
      console.log('❌ Error creating customers table:', customersError.message);
    } else {
      console.log('✅ Customers table created');
    }

    console.log('📋 Creating orders table...');
    const { error: ordersError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.orders (
          id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
          customer_id uuid REFERENCES public.customers(id) ON DELETE CASCADE,
          total numeric(10,2) NOT NULL,
          tax numeric(10,2) DEFAULT 0 NOT NULL,
          shipping_state text,
          shipping_county text,
          shipping_zip text,
          shipping_city text,
          shipping_address1 text,
          shipping_address2 text,
          shipping_phone text,
          created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
        );
      `
    });

    if (ordersError) {
      console.log('❌ Error creating orders table:', ordersError.message);
    } else {
      console.log('✅ Orders table created');
    }

    console.log('📋 Creating order_items table...');
    const { error: orderItemsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.order_items (
          id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
          order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
          sku text NOT NULL,
          qty integer NOT NULL,
          price numeric(10,2) NOT NULL,
          created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
        );
      `
    });

    if (orderItemsError) {
      console.log('❌ Error creating order_items table:', orderItemsError.message);
    } else {
      console.log('✅ Order_items table created');
    }

    console.log('🔒 Enabling Row Level Security...');
    const tables = ['customers', 'orders', 'order_items'];
    for (const table of tables) {
      const { error: rlsError } = await supabase.rpc('exec_sql', {
        sql: `ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;`
      });

      if (rlsError) {
        console.log(`❌ Error enabling RLS on ${table}:`, rlsError.message);
      } else {
        console.log(`✅ RLS enabled on ${table}`);
      }
    }

    console.log('📋 Creating policies...');
    const policies = [
      {
        table: 'customers',
        sql: `CREATE POLICY IF NOT EXISTS "Service role can access customers" ON public.customers FOR ALL USING (auth.role() = 'service_role');`
      },
      {
        table: 'orders',
        sql: `CREATE POLICY IF NOT EXISTS "Service role can access orders" ON public.orders FOR ALL USING (auth.role() = 'service_role');`
      },
      {
        table: 'order_items',
        sql: `CREATE POLICY IF NOT EXISTS "Service role can access order_items" ON public.order_items FOR ALL USING (auth.role() = 'service_role');`
      }
    ];

    for (const policy of policies) {
      const { error: policyError } = await supabase.rpc('exec_sql', {
        sql: policy.sql
      });

      if (policyError) {
        console.log(`❌ Error creating policy on ${policy.table}:`, policyError.message);
      } else {
        console.log(`✅ Policy created on ${policy.table}`);
      }
    }

    console.log('\n🎉 Database setup complete!');
    console.log('🧪 Testing connection...');

    // Test the tables
    const { data: customers, error: testCustomersError } = await supabase
      .from('customers')
      .select('count')
      .limit(1);

    const { data: orders, error: testOrdersError } = await supabase
      .from('orders')
      .select('count')
      .limit(1);

    const { data: orderItems, error: testOrderItemsError } = await supabase
      .from('order_items')
      .select('count')
      .limit(1);

    console.log('\n📊 Table Status:');
    console.log(`✅ Customers: ${testCustomersError ? 'Error' : 'OK'}`);
    console.log(`✅ Orders: ${testOrdersError ? 'Error' : 'OK'}`);
    console.log(`✅ Order Items: ${testOrderItemsError ? 'Error' : 'OK'}`);

    if (!testCustomersError && !testOrdersError && !testOrderItemsError) {
      console.log('\n🎯 SUCCESS: All tables created and accessible!');
      console.log('🚀 Your checkout process is now fully functional!');
    }

  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
    console.log('\n💡 Alternative: Use Supabase Table Editor in the dashboard');
    console.log('   1. Go to Table Editor');
    console.log('   2. Create tables manually: customers, orders, order_items');
  }
}

createTables();
