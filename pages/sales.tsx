import { useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Sales() {
  useEffect(() => {
    // Redirect to contact with sales department selected after a short delay
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.location.href = '/contact?dept=sales'
      }
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <>
      <Head>
        <title>Sales Inquiries | Nature's Way Soil</title>
        <meta name="description" content="Contact our sales team for bulk orders, wholesale pricing, and custom solutions." />
      </Head>
      
      <main className="p-xl">
        <div className="container text-center" style={{maxWidth: '600px'}}>
          <div className="card">
            <h1>Sales Inquiries</h1>
            <p className="mb-lg">
              Looking for bulk orders, wholesale pricing, or custom solutions? 
              Our sales team is here to help you find the right products for your needs.
            </p>
            <p className="mb-lg">
              Redirecting you to our contact form...
            </p>
            <Link href="/contact?dept=sales" className="btn btn-primary">
              Contact Sales Team
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
