// pages/database-setup.tsx
import { useState } from 'react';

export default function DatabaseSetup() {
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/supabase-status');
      const result = await response.json();
      setTestResult(result);
    } catch (error) {
      setTestResult({ error: 'Failed to test connection' });
    }
    setIsLoading(false);
  };

  const testDatabase = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/test-supabase');
      const result = await response.json();
      setTestResult(result);
    } catch (error) {
      setTestResult({ error: 'Failed to test database' });
    }
    setIsLoading(false);
  };

  const migrationSQL = `-- Create basic database schema for e-commerce
-- Safe to run multiple times due to IF NOT EXISTS guards
BEGIN;

-- Create customers table
CREATE TABLE IF NOT EXISTS public.customers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create orders table
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

-- Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  sku text NOT NULL,
  qty integer NOT NULL,
  price numeric(10,2) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (optional, but recommended)
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for service role access (bypass RLS for API calls)
CREATE POLICY IF NOT EXISTS "Service role can access customers" ON public.customers
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "Service role can access orders" ON public.orders
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "Service role can access order_items" ON public.order_items
  FOR ALL USING (auth.role() = 'service_role');

COMMIT;`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('SQL copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Copy failed. Please select and copy manually.');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #174F2E 0%, #22c55e 100%)',
      color: 'white',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          🗄️ Database Setup - Nature's Way Soil
        </h1>
        
        {/* Connection Test */}
        <div style={{ 
          background: 'white', 
          color: '#174F2E', 
          padding: '2rem', 
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <h2 style={{ marginTop: 0 }}>🔌 Step 1: Test Connection</h2>
          <p>First, let's verify your Supabase connection is working:</p>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <button
              onClick={testConnection}
              disabled={isLoading}
              style={{
                backgroundColor: '#174F2E',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '6px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? 'Testing...' : 'Test Connection'}
            </button>
            
            <button
              onClick={testDatabase}
              disabled={isLoading}
              style={{
                backgroundColor: '#22c55e',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '6px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? 'Testing...' : 'Test Database Tables'}
            </button>
          </div>

          {testResult && (
            <div style={{ 
              background: testResult.error || testResult.success === false ? '#fee' : '#efe',
              color: testResult.error || testResult.success === false ? '#c33' : '#363',
              padding: '1rem',
              borderRadius: '6px',
              marginTop: '1rem'
            }}>
              <h4>Test Results:</h4>
              <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Manual Setup Instructions */}
        <div style={{ 
          background: 'white', 
          color: '#174F2E', 
          padding: '2rem', 
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <h2 style={{ marginTop: 0 }}>⚙️ Step 2: Manual Database Setup</h2>
          
          <div style={{ marginBottom: '2rem' }}>
            <h3>Instructions:</h3>
            <ol style={{ fontSize: '16px', lineHeight: '1.6' }}>
              <li><strong>Open your Supabase Dashboard:</strong><br />
                <a href="https://supabase.com/dashboard/project/gixjfavlefeldoostsij" 
                   target="_blank" 
                   style={{ color: '#22c55e', textDecoration: 'none' }}>
                  👉 https://supabase.com/dashboard → Your Project
                </a>
              </li>
              <li><strong>Go to the "SQL Editor" tab</strong></li>
              <li><strong>Copy the SQL below and paste it into the editor</strong></li>
              <li><strong>Click "RUN" to execute the migration</strong></li>
              <li><strong>Test the connection above to verify it worked</strong></li>
            </ol>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>SQL Migration Code:</h3>
              <button
                onClick={() => copyToClipboard(migrationSQL)}
                style={{
                  backgroundColor: '#22c55e',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                📋 Copy SQL
              </button>
            </div>
            
            <textarea
              value={migrationSQL}
              readOnly
              style={{
                width: '100%',
                height: '400px',
                fontFamily: 'monospace',
                fontSize: '12px',
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: '#f8f9fa'
              }}
            />
          </div>
        </div>

        {/* What This Creates */}
        <div style={{ 
          background: 'rgba(255,255,255,0.1)', 
          padding: '2rem', 
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <h2 style={{ marginTop: 0 }}>📋 What This Creates</h2>
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
              <h4>👥 customers table</h4>
              <p>Stores customer information like name and email</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
              <h4>📦 orders table</h4>
              <p>Stores order details, shipping address, tax calculation</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
              <h4>🛒 order_items table</h4>
              <p>Stores individual items within each order</p>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div style={{ 
          background: 'rgba(255,255,255,0.1)', 
          padding: '2rem', 
          borderRadius: '12px'
        }}>
          <h2 style={{ marginTop: 0 }}>🔧 Troubleshooting</h2>
          <div style={{ fontSize: '14px' }}>
            <h4>If connection test fails:</h4>
            <ul>
              <li>Check <a href="https://status.supabase.com" target="_blank" style={{ color: '#22c55e' }}>Supabase status</a></li>
              <li>Verify your project is active in the dashboard</li>
              <li>Make sure your .env.local file has the correct credentials</li>
            </ul>
            
            <h4>If database test fails:</h4>
            <ul>
              <li>Run the SQL migration in your Supabase dashboard first</li>
              <li>Check that all tables were created successfully</li>
              <li>Verify the service role key has proper permissions</li>
            </ul>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <a 
            href="/" 
            style={{ 
              color: 'white', 
              textDecoration: 'none', 
              fontSize: '18px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '1rem 2rem',
              borderRadius: '8px',
              display: 'inline-block'
            }}
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
