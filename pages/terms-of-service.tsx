import Head from 'next/head'
import Link from 'next/link'

export default function TermsOfService() {
  return (
    <>
      <Head>
        <title>Terms of Service - Nature's Way Soil</title>
        <meta name="description" content="Terms of Service for Nature's Way Soil" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
            <p className="text-gray-600 mb-8">Last Updated: October 7, 2025</p>

            <div className="prose prose-green max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
                <p className="text-gray-700 mb-4">
                  By accessing and using Nature's Way Soil website and services, you agree to be bound by these Terms of Service. 
                  If you do not agree to these terms, please do not use our services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Products and Services</h2>
                <p className="text-gray-700 mb-4">
                  Nature's Way Soil provides premium organic soil amendments and related gardening products. We strive to ensure 
                  all product descriptions and information are accurate, but we do not warrant that product descriptions or other 
                  content is error-free, complete, or current.
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>All products are subject to availability</li>
                  <li>Prices are subject to change without notice</li>
                  <li>We reserve the right to limit quantities</li>
                  <li>Product images are for illustration purposes and may vary from actual products</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Orders and Payment</h2>
                <p className="text-gray-700 mb-4">
                  When you place an order, you agree to provide accurate and complete information. We accept various payment 
                  methods as indicated on our website.
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>All orders are subject to acceptance and availability</li>
                  <li>We reserve the right to refuse or cancel any order</li>
                  <li>Payment must be received before order processing</li>
                  <li>You are responsible for any applicable taxes</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Shipping and Delivery</h2>
                <p className="text-gray-700 mb-4">
                  We ship to addresses within the United States. Shipping times and costs vary based on location and product weight.
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Free shipping on orders over $50</li>
                  <li>Delivery times are estimates and not guaranteed</li>
                  <li>Risk of loss passes to you upon delivery to the carrier</li>
                  <li>You are responsible for providing accurate shipping information</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Returns and Refunds</h2>
                <p className="text-gray-700 mb-4">
                  We offer a 30-day money-back guarantee on all products. If you are not satisfied with your purchase, 
                  you may return it within 30 days of delivery for a full refund.
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Products must be in original condition and packaging</li>
                  <li>Return shipping costs are the responsibility of the customer unless the product is defective</li>
                  <li>Refunds will be processed within 5-7 business days of receiving the return</li>
                  <li>Original shipping charges are non-refundable</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Product Use and Safety</h2>
                <p className="text-gray-700 mb-4">
                  Our products are intended for gardening and agricultural use. Always follow product instructions and safety guidelines.
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Keep products out of reach of children and pets</li>
                  <li>Follow all application instructions carefully</li>
                  <li>Store products in a cool, dry place</li>
                  <li>Dispose of products according to local regulations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
                <p className="text-gray-700 mb-4">
                  All content on this website, including text, graphics, logos, images, and software, is the property of 
                  Nature's Way Soil and is protected by copyright and trademark laws.
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>You may not reproduce, distribute, or modify any content without written permission</li>
                  <li>Product names and logos are trademarks of Nature's Way Soil</li>
                  <li>Unauthorized use may result in legal action</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
                <p className="text-gray-700 mb-4">
                  Nature's Way Soil shall not be liable for any indirect, incidental, special, consequential, or punitive damages 
                  resulting from your use of our products or services.
                </p>
                <p className="text-gray-700 mb-4">
                  Our total liability shall not exceed the amount paid by you for the product or service in question.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Privacy</h2>
                <p className="text-gray-700 mb-4">
                  Your use of our website is also governed by our{' '}
                  <Link href="/privacy-policy" className="text-green-600 hover:text-green-700 underline">
                    Privacy Policy
                  </Link>
                  . Please review our Privacy Policy to understand our practices.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to Terms</h2>
                <p className="text-gray-700 mb-4">
                  We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately 
                  upon posting to the website. Your continued use of our services after changes are posted constitutes 
                  acceptance of the modified terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
                <p className="text-gray-700 mb-4">
                  These Terms of Service shall be governed by and construed in accordance with the laws of the United States, 
                  without regard to its conflict of law provisions.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Information</h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-gray-700"><strong>Nature's Way Soil</strong></p>
                  <p className="text-gray-700">Email: support@natureswaysoil.com</p>
                  <p className="text-gray-700">Phone: 1-800-SOIL-WAY</p>
                  <p className="text-gray-700">
                    Or visit our{' '}
                    <Link href="/contact" className="text-green-600 hover:text-green-700 underline">
                      Contact Page
                    </Link>
                  </p>
                </div>
              </section>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/"
                  className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-center"
                >
                  Return to Home
                </Link>
                <Link 
                  href="/privacy-policy"
                  className="inline-block px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors text-center"
                >
                  View Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
