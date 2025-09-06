"use client";
import { FormEvent, useEffect, useState } from "react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useCart } from "../lib/cartContext";

type Address = {
  address1?: string
  address2?: string
  city?: string
  state?: string
  zip?: string
  phone?: string
}

type Props = {
  intentId: string; // from /api/create-payment-intent
  email: string;
  name: string;
  onPaid?: (piId: string) => void; // optional callback after success
  address?: Address;
};

export default function CheckoutForm_Tax({ intentId, email, name, onPaid, address }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const { items } = useCart();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentElementReady, setPaymentElementReady] = useState(false);

  // Debug logging
  console.log('DEBUG: CheckoutForm_Tax render', { stripe: !!stripe, elements: !!elements, intentId });

  // Fallback: set ready after a short delay if onReady doesn't fire
  useEffect(() => {
    console.log('DEBUG: useEffect for paymentElementReady', { stripe: !!stripe, elements: !!elements });
    if (stripe && elements) {
      const timer = setTimeout(() => {
        console.log('DEBUG: Fallback timer fired, setting paymentElementReady');
        setPaymentElementReady(true);
      }, 2000); // 2 second fallback
      return () => clearTimeout(timer);
    }
  }, [stripe, elements]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    
    console.log('DEBUG: handleSubmit called', { stripe: !!stripe, elements: !!elements, paymentElementReady });
    
    if (!stripe || !elements) {
      setError("Stripe not initialized");
      return;
    }

    // Check if PaymentElement is mounted
    if (!paymentElementReady) {
      setError("Payment form is not ready. Please wait a moment and try again.");
      return;
    }

    // Additional check for mounted elements
    const paymentElement = elements.getElement('payment');
    console.log('DEBUG: PaymentElement check', { paymentElement: !!paymentElement });
    
    if (!paymentElement) {
      setError("Payment form elements are not properly loaded. Please refresh the page and try again.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      console.log("Starting payment confirmation...");

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          receipt_email: email,
          payment_method_data: {
            billing_details: {
              name,
              email,
              phone: address?.phone,
              address: address?.address1 || address?.address2 || address?.city || address?.state || address?.zip ? {
                line1: address?.address1,
                line2: address?.address2,
                city: address?.city,
                state: address?.state,
                postal_code: address?.zip,
                country: 'US',
              } : undefined,
            },
          },
          shipping: address?.address1 ? {
            name,
            phone: address?.phone,
            address: {
              line1: address?.address1,
              line2: address?.address2,
              city: address?.city,
              state: address?.state,
              postal_code: address?.zip,
              country: 'US',
            },
          } : undefined,
          return_url: `${window.location.origin}/success?pi=${intentId}`,
        },
        redirect: "if_required", // Only redirect if required, handle success/failure in code
      });

      console.log("Payment confirmation result:", error ? "Error" : "Success");

      // Handle the result immediately
      if (error) {
        console.error("Payment error:", error);
        setError(error.message || "Payment failed");
        setSubmitting(false);
        return;
      }

      // If no error and no redirect needed, payment succeeded
      console.log("Payment successful, calling onPaid callback");
      setSubmitting(false);
      onPaid?.(intentId);
    } catch (err: any) {
      console.error("Unexpected payment error:", err);
      setError(err?.message || "An unexpected error occurred");
      setSubmitting(false);
    }
  }

  // Verify payment link for customers who want to check status
  const verifyPaymentLink = `https://dashboard.stripe.com/payments/${intentId}`;

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
      <PaymentElement 
        options={{
          layout: 'tabs',
          paymentMethodOrder: ['card', 'link'],
          defaultValues: {
            billingDetails: {
              name,
              email,
            }
          }
        }}
        onReady={() => { setPaymentElementReady(true); console.log('DEBUG: PaymentElement onReady fired') }}
      />
      
      {/* Loading indicator for PaymentElement */}
      {(!stripe || !elements || !paymentElementReady) && (
        <div style={{ 
          background: '#fff3cd', 
          color: '#856404',
          padding: '8px 12px', 
          borderRadius: '4px',
          fontSize: '14px',
          border: '1px solid #ffeaa7'
        }}>
          🔄 Preparing secure payment form...
        </div>
      )}
      
      {/* Payment verification info */}
      <div style={{ 
        background: '#f8f9fa', 
        padding: '12px', 
        borderRadius: '6px', 
        fontSize: '14px',
        border: '1px solid #e9ecef'
      }}>
        <div style={{ fontWeight: 600, marginBottom: '4px' }}>Payment Security</div>
        <div>Your payment is secured by Stripe. After payment, you'll receive a confirmation email.</div>
        <div style={{ marginTop: '8px' }}>
          <a 
            href={`/verify-payment?pi=${intentId}`}
            style={{ color: '#0066cc', textDecoration: 'none' }}
            target="_blank"
            rel="noopener noreferrer"
          >
            → Verify Payment Status
          </a>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || !elements || !paymentElementReady || submitting || items.length === 0}
        style={{ 
          padding: "0.8rem 1.5rem", 
          fontWeight: 700, 
          fontSize: '16px',
          background: submitting ? '#6c757d' : '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: submitting ? 'not-allowed' : 'pointer'
        }}
      >
        {submitting ? "Processing Payment..." : `Pay Now - Complete Transaction`}
      </button>
      
      {error && (
        <div style={{ 
          color: "crimson", 
          background: '#ffeaea', 
          padding: '12px', 
          borderRadius: '6px',
          border: '1px solid #ffcccc'
        }}>
          <strong>Payment Error:</strong> {error}
          <div style={{ marginTop: '8px', fontSize: '14px' }}>
            <a 
              href={`/verify-payment?pi=${intentId}`}
              style={{ color: '#0066cc', textDecoration: 'none' }}
            >
              Check payment status here →
            </a>
          </div>
        </div>
      )}
    </form>
  );
}
