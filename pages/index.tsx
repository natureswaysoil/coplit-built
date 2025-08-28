import Image from 'next/image';
import { useState } from 'react';

const products = [
  {
    id: '1',
    title: "Nature's Way Soil Liquid Humic & Fulvic Acid with Organic Kelp Concentrate Natural Soil Conditioner Plant Growth Stimulator",
    image: '/screenshots/Screenshot 2025-08-21 102112  humic details.png',
    details: 'Revive tired soil with a carbon-rich blend of humic and fulvic acids plus organic kelp. Enhances nutrient uptake, stimulates microbial activity, and boosts overall plant vigor.',
    variations: [
      { size: '2.5 Gallon', price: 69.99, sku: 'NWS-HUM-FUL-KELP-25GAL' }
    ]
  },
  {
    id: '2',
    title: "Nature's Way Soil Organic Hydroponic Fertilizer Concentrate Made Fresh Weekly",
    image: '/screenshots/Screenshot 2025-08-21 102258 hydrophonic.png',
    details: 'This organic concentrate yields up to 512 gallons of nutrient solution providing balanced nutrition for hydroponic or aquaponic setups. Safe and pet-friendly, it supports rapid growth without harsh chemicals.',
    variations: [
      { size: '32 oz', price: 25.98, sku: 'NWS-HYDROP-32OZ' }
    ]
  },
  {
    id: '3',
    title: "Nature's Way Soil Liquid Biochar with Kelp Humic & Fulvic Acid",
    image: '/screenshots/Screenshot 2025-08-21 102544 seaweed.png',
    details: 'A premium soil conditioner combining activated biochar, kelp, and humic/fulvic acids to supercharge microbial life and nutrient retention. Ideal for gardens and lawns seeking better water holding and long-term fertility.',
    variations: [
      { size: '1 Gallon', price: 89.95, sku: 'NWS-BIOCHAR-1GAL' }
    ]
  },
  {
    id: '4',
    title: "Nature's Way Soil Organic Tomato Liquid Fertilizer",
    image: '/screenshots/Screenshot 2025-08-21 102710  hay details.png',
    details: 'Made fresh weekly with Vitamin B-1 and aloe vera, this concentrate encourages stronger roots, healthier transplants, and prevents blossom end rot. Tailored nutrients help produce abundant, tasty tomatoes.',
    variations: [
      { size: '32 Ounce', price: 29.99, sku: 'NWS-TOMATO-32' }
    ]
  },
  {
    id: '5',
    title: "Nature's Way Soil Hay Pasture & Lawn Fertilizer",
    image: '/screenshots/Screenshot 2025-08-21 102853 compost details.png',
    details: 'A pet-safe microbial nitrogen blend that naturally feeds grass, turf, and forage. Supports sustained growth, greener lawns, and improved soil structure.',
    variations: [
      { size: '2.5 Gallons', price: 99.99, sku: 'NWS-HAY-PASTURE-25GAL' }
    ]
  },
  {
    id: '6',
    title: "Nature's Way Soil Enhanced Living Compost",
    image: '/screenshots/Screenshot 2025-08-21 103208  bone meal details.png',
    details: 'Features fermented duckweed extract, 20% worm castings, 20% activated biochar, and 60% weed-free compost. A powerful amendment that enriches soil biology and stimulates root development.',
    variations: [
      { size: 'Bag', price: 29.98, sku: 'NWS-LIVING-COMPOST' }
    ]
  },
  {
    id: '7',
    title: "Nature's Way Soil Liquid Bone Meal Fertilizer",
    image: '/screenshots/Screenshot 2025-08-21 103738 32 ounce kelp detais.png',
    details: 'Fast-absorbing liquid bone meal delivering 25% hydrolyzed bone meal, 5% calcium, and 10% phosphorus (P₂O₅). Promotes healthy roots and strong flowering for vegetables, trees, and shrubs.',
    variations: [
      { size: '1 Gallon', price: 39.99, sku: 'NWS-BONEMEAL-1GAL' }
    ]
  }
];

export default function Home() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  return (
    <div style={{ background: '#174F2E', color: 'white', padding: '1rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1200, margin: '0 auto', padding: '1rem' }}>
        <div style={{ maxWidth: 600 }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Nature's Way Soil</h1>
          <p style={{ fontSize: '1rem', margin: '1rem 0' }}>
            At Nature’s Way Soil, our mission is simple: to bring life back to the soil, naturally.<br /><br />
            We’re a family-run farm that saw firsthand the damage years of synthetic fertilizers had done to the land. The soil was tired, lifeless, and unable to sustain the healthy crops and pastures we needed. Instead of following the same path, we set out to restore the earth the way nature intended—through biology, not chemistry.<br /><br />
            <b>Our Promise</b><br />
            Safe & Natural – Every product we make is safe for children, pets, and pollinators.<br />
            Microbe-Rich Formulas – We use beneficial microbes, worm castings, biochar, and natural extracts to restore soil health.<br />
            Sustainable Farming – From duckweed to compost teas, our ingredients are chosen to recycle nutrients and heal the land.<br />
            Results You Can See – Greener lawns, healthier pastures, stronger roots, and thriving gardens—without synthetic chemicals.<br /><br />
            <b>Why We Do It</b><br />
            Soil isn’t just dirt—it’s a living ecosystem. By nurturing the microbes and natural processes in the ground, we create healthier plants, stronger food systems, and a cleaner environment for future generations.<br /><br />
            Every bottle and bag of Nature’s Way Soil® carries this commitment: to restore the balance between people, plants, and the planet.
          </p>
        </div>
        <div style={{ minWidth: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Image src="/logo.png" alt="Nature's Way Soil Logo" width={120} height={120} style={{ borderRadius: 16, background: 'white', objectFit: 'contain' }} />
        </div>
      </div>
      <div style={{ background: '#F6FFF7', color: '#174F2E', padding: '2rem 0', borderRadius: '0 0 16px 16px' }}>
        <h2 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '2rem', marginBottom: '2rem' }}>Featured Products</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          {products.map(p => (
            <div key={p.id} style={{ background: 'white', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: '1.5rem', minWidth: 220, maxWidth: 320, textAlign: 'center' }}>
              <Image src={p.image} alt={p.title} width={180} height={180} style={{ objectFit: 'contain', borderRadius: 8, marginBottom: '1rem', background: '#f6fff7' }} />
              <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{p.title}</h3>
              <p style={{ fontSize: '1rem', marginBottom: '1rem' }}>{p.details}</p>
              {p.variations.map(variation => (
                <div key={variation.sku} style={{ marginBottom: '1rem', border: '1px solid #eee', borderRadius: 6, padding: '0.5rem' }}>
                  <span style={{ fontWeight: 'bold' }}>{variation.size}</span> - ${variation.price.toFixed(2)} <br />
                  <span style={{ fontSize: '0.9rem', color: '#555' }}>SKU: {variation.sku}</span>
                  <button onClick={() => addToCart({ ...p, ...variation })} style={{ background: '#174F2E', color: 'white', border: 'none', borderRadius: 6, padding: '0.5rem 1.2rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem' }}>
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}