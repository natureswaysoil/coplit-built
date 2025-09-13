// pages/tiktok.tsx

import Image from 'next/image';
import Head from 'next/head';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type Product = {
  id: number;
  title: string;
  price: number;
  image_url: string;
  slug: string;
  // rating removed from DB, keeping optional fallback for future
  rating?: number;
};

async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
  .select('id, title, price, image_url, slug')
    .eq('active', true);

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data as Product[];
}

export default async function TikTokLanding() {
  const products = await getProducts();

  return (
    <div>
      <Head>
        <title>Nature's Way Soil – TikTok Special</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <header style={styles.header}>
        <Image
          src="/logo-with-tagline.png"
          alt="Nature's Way Soil Logo"
          width={150}
          height={150}
        />
        <h1>Welcome TikTok Gardeners! 🌱</h1>
        <p>Fix your lawn, grow vibrant plants, and protect your pets — all naturally.</p>
      </header>

      <div style={styles.productsSection}>
        {products.map((product) => (
          <div key={product.id} style={styles.product}>
            <Image
              src={product.image_url}
              alt={product.title}
              width={600}
              height={400}
              style={styles.productImg}
            />
            <h3>{product.title}</h3>
            <p><strong>${product.price.toFixed(2)}</strong></p>
            {product.rating !== undefined && (
              <div style={styles.rating}>
                {renderStars(product.rating)}
                <span style={styles.ratingText}>Rated {product.rating.toFixed(1)}/5 on Amazon</span>
              </div>
            )}
            <a
              href={`https://natureswaysoil.com/product/${product.slug}`}
              style={styles.shopLink}
            >
              Shop Now →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderStars(rating: number) {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  const stars = [];
  for (let i = 0; i < fullStars; i++) stars.push(<span key={'full' + i} style={styles.stars}>★</span>);
  if (halfStar) stars.push(<span key={'half'} style={styles.stars}>☆</span>);
  for (let i = 0; i < emptyStars; i++) stars.push(<span key={'empty' + i} style={styles.starsDisabled}>★</span>);

  return <>{stars}</>;
}

const styles: { [k: string]: React.CSSProperties } = {
  header: {
    backgroundColor: '#5e9441',
    color: 'white',
    padding: '30px 20px',
    textAlign: 'center' as const,
  },
  productsSection: {
    maxWidth: '640px',
    margin: '0 auto',
    padding: '20px 10px',
  },
  product: {
    background: 'white',
    margin: '20px auto',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  productImg: {
    borderRadius: '8px',
  },
  rating: {
    marginTop: '10px',
    display: 'flex',
    alignItems: 'center',
  },
  stars: {
    color: '#ffbf00',
    marginRight: '3px',
    fontSize: '1.2rem',
  },
  starsDisabled: {
    color: '#ccc',
    marginRight: '3px',
    fontSize: '1.2rem',
  },
  ratingText: {
    marginLeft: '8px',
    fontSize: '0.9rem',
    color: '#444',
  },
  shopLink: {
    display: 'inline-block',
    marginTop: '10px',
    color: '#1e6823',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};
