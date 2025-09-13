import { useRouter } from 'next/router';
import { getProductBySlug, getAllProductSlugs } from '@/lib/api';
import Head from 'next/head';
import { Product } from '@/types/Product';

interface ProductPageProps {
  product: Product;
}

export default function ProductPage({ product }: ProductPageProps) {
  const router = useRouter();
  if (router.isFallback) return <div>Loading...</div>;

  return (
    <>
      <Head>
        <title>{product.title}</title>
        <meta name="description" content={product.short_description || product.details || product.title} />
      </Head>

      <main style={{ padding: 20 }}>
        <h1>{product.title}</h1>
        <img src={product.image_url || (product as any).image || '/screenshots/logo-with-tagline.png'} alt={product.title} width={500} />
        <p>{product.details || product.short_description || 'No description provided.'}</p>
        {product.price !== undefined && <p><strong>Price: ${product.price}</strong></p>}
        <button>Add to Cart</button>
      </main>
    </>
  );
}

export async function getStaticPaths() {
  const slugs = await getAllProductSlugs();
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: true,
  };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  return {
    props: { product },
    revalidate: 60,
  };
}

