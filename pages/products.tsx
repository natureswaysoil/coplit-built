import Image from 'next/image';
import { useState } from 'react';

const products = [
  {
    id: '1',
    name: "Nature's Way Soil Liquid Humic & Fulvic Acid with Organic Kelp Concentrate Natural Soil Conditioner Plant Growth Stimulator 2.5 Gallon",
    image: '/screenshots/Screenshot 2025-08-21 102112  humic details.png',
    price: 69.99,
    details: 'Revive tired soil with a carbon-rich blend of humic and fulvic acids plus organic kelp. Enhances nutrient uptake stimulates microbial activity and boosts overall plant vigor.',
    sku: 'NWS-HUM-FUL-KELP-25GAL'
  },
  {
    id: '2',
    name: "Nature's Way Soil Organic Hydroponic Fertilizer Concentrate Made Fresh Weekly 32 oz",
    image: '/screenshots/Screenshot 2025-08-21 102258 hydrophonic.png',
    price: 25.98,
    details: 'This organic concentrate yields up to 512 gallons of nutrient solution providing balanced nutrition for hydroponic or aquaponic setups. Safe and pet-friendly it supports rapid growth without harsh chemicals.',
    sku: 'NWS-HYDROP-32OZ'
  },
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
export default function Products() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Products</h1>
      <input placeholder="Search products..." style={{ marginBottom: 16, width: '100%' }} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
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
    </main>
  );
}