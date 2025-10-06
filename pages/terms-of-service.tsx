import Head from 'next/head'
import Link from 'next/link'

export default function TermsOfService() {
  return (
    <>
      <Head>
        <title>Terms of Service | Nature's Way Soil</title>
        <meta name="description" content="Terms and conditions for using Nature's Way Soil products and services." />
      </Head>
      
      <main className="p-xl">
        <div className="container" style={{maxWidth: '900px'}}>
          <div className="mb-xl">
            <h1>Terms of Service</h1>
            <p style={{color: 'var(--neutral-600)'}}>Last updated: October 5, 2025</p>
          </div>

          <div className="card mb-lg">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using Nature's Way Soil website and purchasing our products, you accept and agree 
              to be bound by these terms and conditions. If you do not agree to these terms, please do not use 
              our website or purchase our products.
            </p>
          </div>

          <div className="card mb-lg">
            <h2>2. Products and Services</h2>
            <p>Nature's Way Soil provides:</p>
            <ul style={{paddingLeft: 'var(--space-lg)', color: 'var(--neutral-700)'}}>
              <li className="mb-sm">Organic fertilizers and soil amendments</li>
              <li className="mb-sm">Educational content about soil health and sustainable gardening</li>
              <li className="mb-sm">Customer support and product guidance</li>
            </ul>
          </div>

          <div className="card mb-lg">
            <h2>3. Product Use and Safety</h2>
            <p>
              Our products are formulated for agricultural and horticultural use. While our products are made 
              with natural ingredients, users should:
            </p>
            <ul style={{paddingLeft: 'var(--space-lg)', color: 'var(--neutral-700)'}}>
              <li className="mb-sm">Follow all application instructions provided</li>
              <li className="mb-sm">Store products safely away from children and pets</li>
              <li className="mb-sm">Use appropriate protective equipment when handling concentrated products</li>
              <li className="mb-sm">Consult product labels for specific safety information</li>
            </ul>
          </div>

          <div className="card mb-lg">
            <h2>4. Orders and Payment</h2>
            <p>
              All orders are subject to acceptance and product availability. We reserve the right to refuse 
              or cancel any order. Payment must be received before products are shipped. Prices are subject 
              to change without notice.
            </p>
          </div>

          <div className="card mb-lg">
            <h2>5. Shipping and Delivery</h2>
            <p>
              We ship to addresses within the United States. Shipping times are estimates and not guaranteed. 
              Risk of loss passes to the customer upon delivery to the carrier. We are not responsible for 
              delays caused by shipping carriers or circumstances beyond our control.
            </p>
          </div>

          <div className="card mb-lg">
            <h2>6. Returns and Refunds</h2>
            <p>
              Please refer to our <Link href="/refund-policy" style={{color: 'var(--primary)'}}>Refund Policy</Link> for 
              detailed information about returns, refunds, and product guarantees.
            </p>
          </div>

          <div className="card mb-lg">
            <h2>7. Limitation of Liability</h2>
            <p>
              Nature's Way Soil products are sold for their intended agricultural and horticultural purposes. 
              We make no warranties or guarantees regarding specific results. Our liability is limited to the 
              purchase price of the product. We are not liable for indirect, incidental, or consequential damages.
            </p>
          </div>

          <div className="card mb-lg">
            <h2>8. Intellectual Property</h2>
            <p>
              All content on this website, including text, images, logos, and product formulations, is the 
              property of Nature's Way Soil and protected by copyright and trademark laws. Unauthorized use 
              is prohibited.
            </p>
          </div>

          <div className="card mb-lg">
            <h2>9. Privacy</h2>
            <p>
              Your use of our website is also governed by our <Link href="/privacy-policy" style={{color: 'var(--primary)'}}>Privacy Policy</Link>. 
              Please review it to understand how we collect and use your information.
            </p>
          </div>

          <div className="card mb-lg">
            <h2>10. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective immediately 
              upon posting to the website. Your continued use of the website after changes constitutes 
              acceptance of the modified terms.
            </p>
          </div>

          <div className="card mb-lg">
            <h2>11. Governing Law</h2>
            <p>
              These terms are governed by the laws of the United States and the state in which Nature's Way 
              Soil operates, without regard to conflict of law provisions.
            </p>
          </div>

          <div className="card" style={{backgroundColor: 'var(--neutral-50)'}}>
            <h2>Contact Information</h2>
            <p className="mb-md">
              If you have questions about these Terms of Service, please contact us.
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
