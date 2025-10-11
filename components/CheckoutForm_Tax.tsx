"use client";
import { FormEvent, useState } from "react";
import { PaymentElement, LinkAuthenticationElement, useElements, useStripe } from "@stripe/react-stripe-js";
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
  const [linkEmail, setLinkEmail] = useState<string | undefined>(undefined);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setError(null);

  // IMPORTANT: Shipping information is set here during payment confirmation
    // using the publishable key. The backend does NOT set shipping when creating
    // the PaymentIntent to avoid Stripe's security restriction that prevents
    // updating shipping info set with a secret key using a publishable key.
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
    receipt_email: linkEmail || email,
        payment_method_data: {
          billing_details: {
      name,
      email: linkEmail || email,
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
        // Shipping info is set here with publishable key (safe and correct approach)
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
      redirect: "always", // Always redirect for better customer experience
    });

    setSubmitting(false);

    if (error) {
      setError(error.message || "Payment failed");
      return;
    }
    // If no redirect happens, call success callback
    onPaid?.(intentId);
  }

  // Verify payment link for customers who want to check status
  const verifyPaymentLink = `https://dashboard.stripe.com/payments/${intentId}`;

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
      {/* Link email capture for one-tap checkout */}
      <LinkAuthenticationElement
        onChange={(e: any) => {
          try {
            setLinkEmail(e?.value?.email || undefined)
          } catch {}
        }}
      />
      {/* Keep PaymentElement options minimal and valid to avoid render issues */}
      <PaymentElement 
        options={{ 
          layout: "tabs",
          // Only include supported method identifiers here. Wallets like Apple Pay/Google Pay
          // are surfaced automatically via Card/Payment Request Button when eligible.
          // paymentMethodOrder: ["link", "card"]
        }} 
      />
      
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
        disabled={!stripe || !elements || submitting || items.length === 0}
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
