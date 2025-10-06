
import Head from 'next/head';
import Image from 'next/image';

export default function About() {
  return (
    <>
      <Head>
        <title>About Us | Nature's Way Soil</title>
        <meta name="description" content="Learn about Nature's Way Soil - a family-run farm dedicated to restoring soil health naturally through biology, not chemistry." />
      </Head>
      
      <main className="p-xl">
        <div className="container">
          <div className="text-center mb-xl">
            <h1>About Nature's Way Soil</h1>
            <p style={{fontSize: '1.2rem', color: 'var(--neutral-600)', maxWidth: '700px', margin: '0 auto'}}>
              A family-run farm dedicated to restoring soil health naturally
            </p>
          </div>

          <div className="grid grid-2 mb-xl" style={{alignItems: 'center', gap: 'var(--space-2xl)'}}>
            <div>
              <h2>Our Story</h2>
              <p className="mb-md">
                At Nature's Way Soil, our mission is simple: to bring life back to the soil, naturally. 
                We're a family-run farm that saw firsthand the damage years of synthetic fertilizers had done to the land.
              </p>
              <p className="mb-md">
                The soil was tired, lifeless, and unable to sustain the healthy crops and pastures we needed. 
                Instead of following the same path, we set out to restore the earth the way nature intended—through biology, not chemistry.
              </p>
              <p>
                Every bottle and bag of Nature's Way Soil carries this commitment: to restore the balance between people, plants, and the planet.
              </p>
            </div>
            <div className="text-center">
              <Image
                src="/screenshots/logo-with-tagline.png"
                alt="Nature's Way Soil Logo"
                width={400}
                height={200}
                style={{maxWidth: '100%', height: 'auto', borderRadius: '1rem'}}
              />
            </div>
          </div>

          <div className="grid grid-2 mb-xl" style={{gap: 'var(--space-xl)'}}>
            <div className="card">
              <h3>Our Promise</h3>
              <ul style={{listStyle: 'none', padding: 0}}>
                <li className="mb-sm"><strong>Safe & Natural</strong> – Every product we make is safe for children, pets, and pollinators</li>
                <li className="mb-sm"><strong>Microbe-Rich Formulas</strong> – We use beneficial microbes, worm castings, biochar, and natural extracts</li>
                <li className="mb-sm"><strong>Sustainable Farming</strong> – From duckweed to compost teas, our ingredients recycle nutrients and heal the land</li>
                <li className="mb-sm"><strong>Results You Can See</strong> – Greener lawns, healthier pastures, stronger roots, and thriving gardens</li>
              </ul>
            </div>
            <div className="card">
              <h3>Why We Do It</h3>
              <p className="mb-md">
                Soil isn't just dirt—it's a living ecosystem. By nurturing the microbes and natural processes in the ground, 
                we create healthier plants, stronger food systems, and a cleaner environment for future generations.
              </p>
              <p>
                Our approach focuses on restoring the natural balance that synthetic chemicals have disrupted, 
                creating sustainable solutions that benefit both farmers and the environment.
              </p>
            </div>
          </div>

          <div className="text-center card" style={{backgroundColor: 'var(--neutral-50)'}}>
            <h2>Our Commitment to Quality</h2>
            <p style={{fontSize: '1.1rem', color: 'var(--neutral-600)', maxWidth: '800px', margin: '0 auto'}}>
              We believe in transparency and quality. Every product is carefully formulated and tested to ensure it meets our high standards 
              for effectiveness and safety. When you choose Nature's Way Soil, you're choosing products that work in harmony with nature.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
