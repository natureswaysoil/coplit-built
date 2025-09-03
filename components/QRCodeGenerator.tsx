// components/QRCodeGenerator.tsx
import { useEffect, useState } from 'react';

interface QRCodeProps {
  url: string;
  size?: number;
  logoUrl?: string;
}

export default function QRCodeGenerator({ url, size = 200, logoUrl }: QRCodeProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    // Generate QR code using QR Server API (free service)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&format=png&margin=10`;
    setQrCodeUrl(qrUrl);
  }, [url, size]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }}>
      {qrCodeUrl && (
        <>
          <img 
            src={qrCodeUrl} 
            alt={`QR Code for ${url}`}
            style={{ 
              width: size, 
              height: size,
              borderRadius: '8px'
            }}
          />
          <p style={{ 
            marginTop: '10px', 
            fontSize: '14px', 
            color: '#174F2E',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            Scan to visit<br />
            Nature's Way Soil
          </p>
          {logoUrl && (
            <img 
              src={logoUrl} 
              alt="Logo"
              style={{ 
                width: '60px', 
                height: '30px',
                marginTop: '8px',
                objectFit: 'contain'
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
