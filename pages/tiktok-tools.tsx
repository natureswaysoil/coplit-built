// pages/tiktok-tools.tsx
import { useState } from 'react';
import QRCodeGenerator from '../components/QRCodeGenerator';

export default function TikTokTools() {
  const [selectedSize, setSelectedSize] = useState(300);
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com';

  const downloadQRCode = async () => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${selectedSize}x${selectedSize}&data=${encodeURIComponent(siteUrl)}&format=png&margin=10`;
    
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `natures-way-soil-qr-${selectedSize}x${selectedSize}.png`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download QR code:', error);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #174F2E 0%, #22c55e 100%)',
      color: 'white',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          TikTok Marketing Tools
        </h1>
        
        <div style={{ 
          background: 'white', 
          color: '#174F2E', 
          padding: '2rem', 
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <h2 style={{ marginTop: 0 }}>TikTok Strategy Tips</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
              <strong>Bio Link Strategy:</strong><br />
              Put your website link in your TikTok bio and tell viewers "Link in bio!"
            </div>
            <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
              <strong>QR Code Strategy:</strong><br />
              Display QR codes in your videos for easy scanning
            </div>
            <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
              <strong>Call-to-Action Ideas:</strong><br />
              "Scan for organic fertilizers!" • "Link in bio for free shipping!" • "Visit for garden tips!"
            </div>
          </div>
        </div>

        <div style={{ 
          background: 'white', 
          color: '#174F2E', 
          padding: '2rem', 
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h2 style={{ marginTop: 0 }}>QR Code Generator</h2>
          <p>Generate QR codes to display in your TikTok videos!</p>
          
          <div style={{ margin: '2rem 0' }}>
            <label style={{ display: 'block', marginBottom: '1rem' }}>
              <strong>QR Code Size:</strong>
              <select 
                value={selectedSize} 
                onChange={(e) => setSelectedSize(Number(e.target.value))}
                style={{ 
                  marginLeft: '1rem', 
                  padding: '0.5rem', 
                  fontSize: '16px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              >
                <option value={200}>Small (200x200)</option>
                <option value={300}>Medium (300x300)</option>
                <option value={500}>Large (500x500)</option>
                <option value={800}>Extra Large (800x800)</option>
              </select>
            </label>
          </div>

          <div style={{ margin: '2rem 0' }}>
            <QRCodeGenerator 
              url={siteUrl} 
              size={selectedSize}
              logoUrl="/screenshots/logo-with-tagline.png"
            />
          </div>

          <button
            onClick={downloadQRCode}
            style={{
              backgroundColor: '#174F2E',
              color: 'white',
              padding: '1rem 2rem',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginTop: '1rem'
            }}
          >
            Download QR Code
          </button>

          <div style={{ 
            marginTop: '2rem', 
            padding: '1rem', 
            background: '#e7f3ff', 
            borderRadius: '8px',
            fontSize: '14px'
          }}>
            <strong>How to Use:</strong><br />
            1. Download the QR code<br />
            2. Add it to your TikTok video (corner or end screen)<br />
            3. Say "Scan to shop!" or "QR code for organic fertilizers!"<br />
            4. Viewers scan and visit your site instantly!
          </div>
        </div>

        <div style={{ 
          background: 'white', 
          color: '#174F2E', 
          padding: '2rem', 
          borderRadius: '12px',
          marginTop: '2rem'
        }}>
          <h3>TikTok Content Ideas</h3>
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
              <strong> Before/After</strong><br />
              Show lawn transformations using your products
            </div>
            <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
              <strong>Pet-Safe Tips</strong><br />
              Demonstrate your pet-safe fertilizers
            </div>
            <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
              <strong>Science Explained</strong><br />
              Show how organic vs synthetic works
            </div>
            <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
              <strong> Quick Tips</strong><br />
              "3 signs your soil needs help"
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <a 
            href="/" 
            style={{ 
              color: 'white', 
              textDecoration: 'none', 
              fontSize: '18px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '1rem 2rem',
              borderRadius: '8px',
              display: 'inline-block'
            }}
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
