// pages/tiktok-static.tsx
import Image from 'next/image';
import Head from 'next/head';

export default function TikTokLanding() {
  return (
    <div>
      <Head>
        <title>Nature's Way Soil – TikTok Special</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <header style={styles.header}>
        <Image src="/logo-with-tagline.png" alt="Nature's Way Soil Logo" width={150} height={150} />
        <h1>Welcome TikTok Gardeners! </h1>
        <p>Fix your lawn, grow vibrant plants, and protect your pets — all naturally.</p>
        <div style={styles.ctaButtons}>
          <a href="#lawn" style={styles.ctaButton}>Fix My Lawn</a>
          <a href="#pets" style={styles.ctaButton}>Pet-Safe Solutions</a>
          <a href="#tomatoes" style={styles.ctaButton}>Grow Healthier Tomatoes</a>
        </div>
      </header>

      <div style={styles.videoEmbed}>
        <iframe
          src="https://www.youtube.com/embed/VIDEO_ID"
          title="TikTok Highlight Video"
          frameBorder="0"
          allowFullScreen
          style={styles.iframe}
        ></iframe>
      </div>

      <section id="lawn" style={styles.product}>
        <Image src="https://natureswaysoil.com/wp-content/uploads/2023/10/hayfert.jpg" alt="Hay and Pasture Fertilizer" width={600} height={400} style={styles.productImg} />
        <h3>Hay & Pasture Lawn Fertilizer</h3>
        <p>Organic, horse-safe, and promotes lush, green pastures.</p>
        <p><strong>$39.99</strong> – 1 Gallon</p>
        <a href="https://natureswaysoil.com/product/horse-safe-lawn-fertilizer/">Shop Now →</a>
      </section>

      <section id="pets" style={styles.product}>
        <Image src="https://natureswaysoil.com/wp-content/uploads/2023/10/dogpee.jpg" alt="Dog Urine Neutralizer" width={600} height={400} style={styles.productImg} />
        <h3>Dog Urine Neutralizer & Lawn Repair</h3>
        <p>Pet-safe spray that reverses yellow spots and neutralizes odors.</p>
        <p><strong>$29.99</strong> – 32 oz</p>
        <a href="https://natureswaysoil.com/product/dog-urine-neutralizer/">Shop Now →</a>
      </section>

      <section id="tomatoes" style={styles.product}>
        <Image src="https://natureswaysoil.com/wp-content/uploads/2023/10/tomatofert.jpg" alt="Tomato Fertilizer" width={600} height={400} style={styles.productImg} />
        <h3>Organic Tomato Fertilizer</h3>
        <p>Includes Vitamin B-1 and Aloe Vera to boost root strength and yield.</p>
        <p><strong>$29.99</strong> – 32 oz</p>
        <a href="https://natureswaysoil.com/product/organic-tomato-fertilizer/">Shop Now →</a>
      </section>

      <section style={styles.emailForm}>
        <h3>Want 10% Off + Free Garden Tips?</h3>
        <form action="https://your-supabase-endpoint.com/subscribe" method="POST">
          <input type="text" name="name" placeholder="First Name" required style={styles.input} /><br />
          <input type="email" name="email" placeholder="Email Address" required style={styles.input} /><br />
          <button type="submit" style={styles.button}>Subscribe</button>
        </form>
      </section>

      <footer style={styles.footer}>
        As seen on TikTok | Nature’s Way Soil © 2025 | Organic • Safe • Proven
      </footer>
    </div>
  );
}

const styles = {
  header: {
    backgroundColor: '#5e9441',
    color: 'white',
    padding: '30px 20px',
    textAlign: 'center' as const,
  },
  ctaButtons: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    justifyContent: 'center' as const,
    marginTop: '20px',
    gap: '10px',
  },
  ctaButton: {
    backgroundColor: '#1e6823',
    color: 'white',
    padding: '15px 20px',
    borderRadius: '8px',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    flex: 1,
    textDecoration: 'none' as const,
  },
  videoEmbed: {
    textAlign: 'center' as const,
    margin: '30px auto',
    maxWidth: '600px',
  },
  iframe: {
    width: '100%',
    height: '340px',
    borderRadius: '10px',
  },
  product: {
    background: 'white',
    margin: '20px auto',
    padding: '20px',
    borderRadius: '10px',
    maxWidth: '600px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  productImg: {
    borderRadius: '8px',
  },
  emailForm: {
    background: 'white',
    margin: '30px auto',
    padding: '20px',
    maxWidth: '600px',
    textAlign: 'center' as const,
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  input: {
    padding: '10px',
    width: '80%',
    maxWidth: '300px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    background: '#5e9441',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  footer: {
    textAlign: 'center' as const,
    padding: '20px',
    fontSize: '0.85rem',
    color: '#777',
  },
};
