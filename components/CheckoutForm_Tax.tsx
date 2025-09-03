"use client";
import { FormEvent, useState } from "react";
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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setError(null);

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
      redirect: "if_required",
    });

    setSubmitting(false);

    if (error) {
      setError(error.message || "Payment failed");
      return;
    }
    onPaid?.(intentId);
    window.location.href = `/success?pi=${intentId}`;
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || !elements || submitting || items.length === 0}
        style={{ padding: "0.6rem 1.2rem", fontWeight: 700 }}
      >
        {submitting ? "Processing…" : "Pay now"}
      </button>
      {error && <div style={{ color: "crimson" }}>{error}</div>}
    </form>
  );
}
