import Head from 'next/head'
import Link from 'next/link'

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy | Nature's Way Soil</title>
        <meta name="description" content="Learn how Nature's Way Soil collects, uses, and protects your personal information." />
      </Head>
      
      <main className="p-xl">
        <div className="container" style={{maxWidth: '900px'}}>
          <div className="mb-xl">
            <h1>Privacy Policy</h1>
            <p style={{color: 'var(--neutral-600)'}}>Last updated: August 28, 2025</p>
          </div>

          <div className="card mb-lg">
            <p style={{fontSize: '1.1rem', color: 'var(--neutral-700)'}}>
              We respect your privacy. This policy explains what information we collect, how we use it,
              and the choices you have.
            </p>
          </div>

          <div className="card mb-lg">
            <h2>Information We Collect</h2>
            <ul style={{paddingLeft: 'var(--space-lg)', color: 'var(--neutral-700)'}}>
              <li className="mb-sm">Contact details you provide (like name and email) when placing an order or contacting us.</li>
              <li className="mb-sm">Order details (items purchased, totals, transaction timestamps).</li>
              <li className="mb-sm">Usage data such as pages visited and basic device information (via cookies/analytics).</li>
            </ul>
          </div>

          <div className="card mb-lg">
            <h2>How We Use Information</h2>
            <ul style={{paddingLeft: 'var(--space-lg)', color: 'var(--neutral-700)'}}>
              <li className="mb-sm">To process orders, provide customer support, and communicate about your purchase.</li>
              <li className="mb-sm">To improve our products, services, and website experience.</li>
              <li className="mb-sm">To meet legal, tax, and compliance obligations.</li>
            </ul>
          </div>

          <div className="card mb-lg">
            <h2>Sharing</h2>
            <p>
              We don't sell your personal information. We may share data with trusted service providers
              (e.g., payment processors, hosting, analytics) to operate our business. These providers are
              only allowed to use the information to perform services for us.
            </p>
          </div>

          <div className="card mb-lg">
            <h2>Cookies</h2>
            <p>
              We use cookies to keep your cart, remember preferences, and measure site performance. You can
              control cookies through your browser settings.
            </p>
          </div>

          <div className="card mb-lg">
            <h2>Data Retention</h2>
            <p>
              We retain order records and necessary account information for as long as required for
              business, legal, and tax purposes.
            </p>
          </div>

          <div className="card mb-lg">
            <h2>Your Choices</h2>
            <ul style={{paddingLeft: 'var(--space-lg)', color: 'var(--neutral-700)'}}>
              <li className="mb-sm">You can request access, correction, or deletion of your personal information.</li>
              <li className="mb-sm">You can opt out of non-essential communications.</li>
            </ul>
          </div>

          <div className="card" style={{backgroundColor: 'var(--neutral-50)'}}>
            <h2>Contact</h2>
            <p className="mb-md">
              Questions about this policy? We're here to help.
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