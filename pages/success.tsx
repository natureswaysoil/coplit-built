
import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';
import { useCart } from '@/lib/cartContext';

export default function Success() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear the cart after successful purchase
    clearCart();
  }, [clearCart]);

  return (
    <>
      <Head>
        <title>Order Confirmed | Nature's Way Soil</title>
        <meta name="description" content="Thank you for your order!" />
      </Head>

      <main className="container p-xl">
        <div className="text-center" style={{maxWidth: '600px', margin: '0 auto'}}>
          <div style={{fontSize: '4rem', marginBottom: '1rem'}}>
            <svg className="w-24 h-24 mx-auto text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h1 style={{marginBottom: '1rem'}}>Thank You for Your Order</h1>
          
          <p style={{fontSize: '1.1rem', color: 'var(--neutral-600)', marginBottom: '2rem'}}>
            Your order has been confirmed and will be processed shortly. 
            You will receive an email confirmation with your order details and tracking information.
          </p>

          <div className="card" style={{backgroundColor: 'var(--neutral-50)', marginBottom: '2rem', textAlign: 'left'}}>
            <h3 style={{marginBottom: '1rem'}}>What's Next?</h3>
            <ul style={{listStyle: 'none', padding: 0}}>
              <li style={{marginBottom: '0.75rem', display: 'flex', alignItems: 'start'}}>
                <span style={{marginRight: '0.5rem', color: 'var(--primary)', fontWeight: 'bold'}}>1.</span>
                <span>Check your email for order confirmation and receipt</span>
              </li>
              <li style={{marginBottom: '0.75rem', display: 'flex', alignItems: 'start'}}>
                <span style={{marginRight: '0.5rem', color: 'var(--primary)', fontWeight: 'bold'}}>2.</span>
                <span>Your order will be carefully prepared and packaged</span>
              </li>
              <li style={{marginBottom: '0.75rem', display: 'flex', alignItems: 'start'}}>
                <span style={{marginRight: '0.5rem', color: 'var(--primary)', fontWeight: 'bold'}}>3.</span>
                <span>You'll receive tracking information once shipped</span>
              </li>
              <li style={{display: 'flex', alignItems: 'start'}}>
                <span style={{marginRight: '0.5rem', color: 'var(--primary)', fontWeight: 'bold'}}>4.</span>
                <span>Expect delivery within 5-7 business days</span>
              </li>
            </ul>
          </div>

          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
            <Link href="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
            <Link href="/" className="btn btn-secondary">
              Return Home
            </Link>
          </div>

          <div style={{marginTop: '3rem', padding: '1.5rem', backgroundColor: 'var(--primary-50)', borderRadius: '0.5rem'}}>
            <h3 style={{marginBottom: '0.5rem'}}>Need Help?</h3>
            <p style={{color: 'var(--neutral-600)', marginBottom: '1rem'}}>
              If you have any questions about your order, please don't hesitate to contact us.
            </p>
            <Link href="/contact" className="btn btn-outline">
              Contact Support
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
