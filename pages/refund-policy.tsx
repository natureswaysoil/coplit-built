import Head from 'next/head'
import Link from 'next/link'

export default function RefundPolicy() {
  return (
    <>
      <Head>
        <title>Refund Policy | Nature's Way Soil</title>
        <meta name="description" content="Learn about our hassle-free 30-day refund policy. No returns needed, just contact us." />
      </Head>
      
      <main className="p-xl">
        <div className="container" style={{maxWidth: '900px'}}>
          <div className="mb-xl">
            <h1>Refund Policy</h1>
            <p style={{color: 'var(--neutral-600)'}}>Last updated: August 28, 2025</p>
          </div>

          <div className="card mb-lg" style={{backgroundColor: 'var(--neutral-50)', border: '2px solid var(--primary)'}}>
            <h3 style={{color: 'var(--primary)', marginBottom: 'var(--space-md)'}}>
              Hassle-Free Guarantee
            </h3>
            <p style={{fontSize: '1.2rem', fontWeight: '600', color: 'var(--neutral-800)'}}>
              No Returns Needed — Just request a refund within 30 days — No questions asked.
            </p>
          </div>

          <div className="card mb-lg">
            <h2>How to Request a Refund</h2>
            <ol style={{paddingLeft: 'var(--space-lg)', color: 'var(--neutral-700)'}}>
              <li className="mb-sm">Contact us through the Contact page with your order email and order ID.</li>
              <li className="mb-sm">We will process your refund to the original payment method within 3–5 business days.</li>
            </ol>
          </div>

          <div className="card mb-lg">
            <h2>Eligibility</h2>
            <ul style={{paddingLeft: 'var(--space-lg)', color: 'var(--neutral-700)'}}>
              <li className="mb-sm">Requests must be made within 30 days of purchase.</li>
              <li className="mb-sm">No returns are required. You may keep or dispose of the product responsibly.</li>
            </ul>
          </div>

          <div className="card" style={{backgroundColor: 'var(--neutral-50)'}}>
            <h2>Need Help?</h2>
            <p className="mb-md">
              If you have any questions about our refund policy or need to request a refund, 
              we're here to help make the process as smooth as possible.
            </p>
            <Link href="/contact" className="btn btn-primary">
              Contact Us
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}