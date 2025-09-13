
// pages/products/[slug].tsx
import { useRouter } from 'next/router';
import { getProductBySlug, getAllProductSlugs } from '../../lib/api';
import Head from 'next/head';

export default function ProductPage({ product }) {
  const router = useRouter();
  if (router.isFallback) return <div>Loading...</div>;

  return (
    <>
      <Head>
        <title>{product.seo_title}</title>
        <meta name="description" content={product.seo_description} />
      </Head>

      <main style={{ padding: 20 }}>
        <h1>{product.title}</h1>
        <img src={product.image_url} alt={product.title} width={500} />
        <p>{product.full_description}</p>
        <p><strong>Price: ${product.price}</strong></p>
        <p>Tags: {product.tags}</p>
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

export async function getStaticProps({ params }) {
  const product = await getProductBySlug(params.slug);
  return {
    props: { product },
    revalidate: 60,
  };
}
