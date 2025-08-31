// components/CheckoutForm_Tax.tsx
import { FormEvent, useState } from "react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useCart } from "../cart/CartContext";
import PromoField from "./PromoField";

export default function CheckoutForm_Tax() {
  const stripe = useStripe();
  const elements = useElements();
  const { items } = useCart();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [customer, setCustomer] = useState({ name: "", email: "" });
  const [address, setAddress] = useState({ line1: "", city: "", state: "", postal_code: "", country: "US" });
  const [promoCode, setPromoCode] = useState("");
  const [promoValid, setPromoValid] = useState(false);
  const [breakdown, setBreakdown] = useState<{ subtotal: number; discount: number; tax: number; total: number } | null>(null);

  const createPI = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch("/api/create-payment-intent-with-tax", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, customer, address, promoCode: promoValid ? promoCode : undefined }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Failed to create payment");
      setClientSecret(data.clientSecret);
      setBreakdown(data.breakdown);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    const { error: submitErr } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: typeof window !== "undefined" ? window.location.origin + "/success" : undefined,
        receipt_email: customer.email,
        shipping: { name: customer.name, address },
      },
      redirect: "if_required",
    });
    if (submitErr) setError(submitErr.message || "Payment failed");
    else setSuccess("Payment succeeded!");
    setLoading(false);
  };

  return (
    <div className="max-w-3xl space-y-3">
      <h2 className="text-xl font-semibold">Contact & Shipping</h2>
      <div className="grid grid-cols-2 gap-3">
        <input className="border p-2 col-span-2" placeholder="Full name" value={customer.name} onChange={e=>setCustomer({...customer,name:e.target.value})}/>
        <input className="border p-2 col-span-2" placeholder="Email" type="email" value={customer.email} onChange={e=>setCustomer({...customer,email:e.target.value})}/>
        <input className="border p-2 col-span-2" placeholder="Address line 1" value={address.line1} onChange={e=>setAddress({...address,line1:e.target.value})}/>
        <input className="border p-2" placeholder="City" value={address.city} onChange={e=>setAddress({...address,city:e.target.value})}/>
        <input className="border p-2" placeholder="State" value={address.state} onChange={e=>setAddress({...address,state:e.target.value})}/>
        <input className="border p-2" placeholder="ZIP" value={address.postal_code} onChange={e=>setAddress({...address,postal_code:e.target.value})}/>
      </div>

      <PromoField value={promoCode} onChange={setPromoCode} onValidChange={(v)=> setPromoValid(v)} />

      <button className="bg-black text-white px-4 py-2 rounded" onClick={createPI} disabled={loading || !customer.email || !address.line1 || !address.city || !address.state || !address.postal_code}>
        {loading ? "Calculating…" : "Review total & pay"}
      </button>

      {breakdown && (
        <div className="text-sm mt-2">
          <div>Subtotal: ${(breakdown.subtotal/100).toFixed(2)}</div>
          <div>Discount: -${(breakdown.discount/100).toFixed(2)}</div>
          <div>Tax: ${(breakdown.tax/100).toFixed(2)}</div>
          <div className="font-semibold">Total: ${(breakdown.total/100).toFixed(2)}</div>
        </div>
      )}

      {clientSecret ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <PaymentElement />
          <button className="bg-green-600 text-white px-4 py-2 rounded" disabled={loading || !stripe || !elements}>
            {loading ? "Processing…" : "Pay now"}
          </button>
        </form>
      ) : (
        <p className="text-sm text-gray-600">We’ll compute tax and load PaymentElement after validating your promo.</p>
      )}

      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
    </div>
  );
}
