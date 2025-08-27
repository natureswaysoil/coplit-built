import { useRouter } from 'next/router';

const fakeProducts = [
  { id: '1', name: 'Product A', price: 10, description: 'A wonderful item.' },
  { id: '2', name: 'Product B', price: 20, description: 'An even better item.' }
];

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const product = fakeProducts.find(p => p.id === id);

  if (!product) return <main><p>Product not found.</p></main>;
  return (
    <main>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <strong>${product.price}</strong>
    </main>
  );
}
