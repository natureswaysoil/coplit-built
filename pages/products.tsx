import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';

const fakeProducts = [
  { id: '1', name: 'Product A', price: 10 },
  { id: '2', name: 'Product B', price: 20 }
];

export default function Products() {
  const handleCheckout = async (id: string) => {
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
    window.location.href = 'https://buy.stripe.com/test_4gwcOq5Fj1Dk6nW288';
  };

  return (
    <main>
      <h1>Products</h1>
      <input placeholder="Search products..." style={{ marginBottom: 16, width: '100%' }} />
      <ul>
        {fakeProducts.map(p => (
          <li key={p.id} style={{ margin: '1rem 0' }}>
            <Link href={`/products/${p.id}`}>{p.name}</Link> - ${p.price}
            <button onClick={() => handleCheckout(p.id)}>Buy Now</button>
          </li>
        ))}
      </ul>
    </main>
  );
}