cat > pages/video-scripts.tsx << 'EOF'
import { useState } from 'react';

export default function SimpleScriptGenerator() {
  const [products, setProducts] = useState([]);
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/load-products');
      
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to load products');
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      setProducts(data.products);
      setLoading(false);
    } catch (err) {
      setError('Failed to load products. Make sure the API route exists.');
      setLoading(false);
    }
  };

  const generateEducationalHook = (category) => {
    const hooks = {
      Compost: "Did you know healthy soil has more living organisms than people on Earth?",
      Fertilizer: "Your lawn's roots can grow over 6 miles in just one square yard!",
      Amendment: "Soil pH affects nutrient availability by up to 90%!",
      General: "Soil health is the foundation of all plant success!",
    };
    return hooks[category] || hooks.General;
  };

  const generateScript = (product) => {
    const hook = generateEducationalHook(product.category);
    
    return {
      productId: product.id,
      productName: product.name,
      hook,
      script: `[SCENE 1 - HOOK - 3 seconds]
VISUAL: Close-up of soil with visible organisms
TEXT OVERLAY: "${hook}"
NARRATION: ${hook}

[SCENE 2 - EDUCATION INTRO - 12 seconds]
VISUAL: Microscopic view of bacteria and fungi
TEXT OVERLAY: "The Hidden World Below"
NARRATION: Let me show you what's happening beneath your ${product.useCase}. The soil food web is an incredible ecosystem where billions of organisms work together.

[SCENE 3 - KEY BENEFIT 1 - 10 seconds]
VISUAL: Animation of roots extending underground
TEXT OVERLAY: "Fungi Extend Roots 100x"
NARRATION: Bacteria break down organic matter. Fungi extend root systems by up to 100 times, accessing water and minerals plants can't reach alone.

[SCENE 4 - KEY BENEFIT 2 - 10 seconds]
VISUAL: Healthy plant roots in rich soil
TEXT OVERLAY: "Self-Sustaining Nutrition"
NARRATION: Protozoa and nematodes cycle nutrients. When balanced, plants become naturally disease-resistant and water infiltration improves dramatically.

[SCENE 5 - PROBLEM - 10 seconds]
VISUAL: Split screen - synthetic vs organic
TEXT OVERLAY: "Synthetic = Short Term Fix"
NARRATION: Traditional synthetic fertilizers bypass this system entirely. They feed plants directly but starve the microbial community.

[SCENE 6 - PRODUCT SOLUTION - 10 seconds]
VISUAL: ${product.name} product shot with soil
TEXT OVERLAY: "${product.name}"
NARRATION: This is why we developed ${product.name}. It ${product.benefits}, working with nature's design.

[SCENE 7 - CALL TO ACTION - 5 seconds]
VISUAL: Logo with website URL
TEXT OVERLAY: "Learn More → NaturesWaySoil.com"
NARRATION: Real soil health builds thriving underground ecosystems.`,
      waveSpeedScenes: [
        { scene: 1, duration: '3s', hook: hook, visuals: 'Close-up soil', textOverlay: hook },
        { scene: 2, duration: '12s', title: 'Hidden World', visuals: 'Microscopic organisms', textOverlay: 'The Soil Food Web' },
        { scene: 3, duration: '10s', title: 'Fungi Power', visuals: 'Root extension', textOverlay: 'Fungi Extend Roots 100x' },
        { scene: 4, duration: '10s', title: 'Natural Benefits', visuals: 'Healthy plants', textOverlay: 'Self-Sustaining Nutrition' },
        { scene: 5, duration: '10s', title: 'The Problem', visuals: 'Split screen', textOverlay: 'Synthetic = Short Term' },
        { scene: 6, duration: '10s', title: 'Solution', visuals: `${product.name}`, textOverlay: product.name, productShot: true },
        { scene: 7, duration: '5s', title: 'CTA', visuals: 'Logo + URL', textOverlay: 'NaturesWaySoil.com' }
      ]
    };
  };

  const generateAllScripts = () => {
    setLoading(true);
    setTimeout(() => {
      const generated = products.map(generateScript);
      setScripts(generated);
      setLoading(false);
    }, 1000);
  };

  const copyScript = (text) => {
    navigator.clipboard.writeText(text);
    alert('Script copied! Ready for WaveSpeed.');
  };

  const exportAll = () => {
    const allScripts = scripts.map(s => 
      `=== ${s.productName} ===\n\n${s.script}\n\n\n`
    ).join('');
    
    const blob = new Blob([allScripts], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `natureswaysoil-scripts-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 32, fontFamily: 'system-ui' }}>
      <h1 style={{ marginBottom: 8 }}>Nature&apos;s Way Soil - Video Script Generator</h1>
      <p style={{ color: '#666', marginBottom: 32 }}>
        Generate WaveSpeed-ready scripts from your Google Sheet
      </p>

      <div style={{ 
        background: '#f9fafb', 
        padding: 24, 
        borderRadius: 8, 
        marginBottom: 32,
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{ marginTop: 0 }}>Step 1: Load Products from Google Sheet</h3>
        
        {error && (
          <div style={{ 
            background: '#fef2f2', 
            border: '1px solid #fca5a5',
            color: '#991b1b',
            padding: 12,
            borderRadius: 6,
            marginBottom: 16,
            fontSize: 14
          }}>
            {error}
          </div>
        )}

        <button
          onClick={loadProducts}
          disabled={loading}
          style={{
            padding: '12px 24px',
            background: loading ? '#9ca3af' : '#2b6f3f',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            fontSize: 16,
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: 16
          }}
        >
          {loading ? 'Loading Products...' : 'Load Products from Sheet'}
        </button>

        {products.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <p style={{ fontSize: 14, color: '#059669', fontWeight: 600 }}>
              ✓ Loaded {products.length} products
            </p>
            <div style={{ marginTop: 12, maxHeight: 200, overflowY: 'auto', fontSize: 13 }}>
              {products.map((p, i) => (
                <div key={i} style={{ padding: 8, borderBottom: '1px solid #e5e7eb' }}>
                  <strong>{p.name}</strong> - {p.category}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {products.length > 0 && scripts.length === 0 && (
        <div style={{ 
          background: '#f9fafb', 
          padding: 24, 
          borderRadius: 8, 
          marginBottom: 32,
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ marginTop: 0 }}>Step 2: Generate Video Scripts</h3>
          <p style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>
            Create educational scripts (80% education, 20% product) for all {products.length} products
          </p>
          
          <button
            onClick={generateAllScripts}
            style={{
              padding: '12px 24px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Generate All Scripts
          </button>
        </div>
      )}

      {scripts.length > 0 && (
        <>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 24 
          }}>
            <h2 style={{ margin: 0 }}>Generated Scripts ({scripts.length})</h2>
            <button
              onClick={exportAll}
              style={{
                padding: '8px 16px',
                background: '#059669',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              📥 Export All Scripts
            </button>
          </div>

          <div style={{ display: 'grid', gap: 24 }}>
            {scripts.map((script) => (
              <div 
                key={script.productId}
                style={{ 
                  background: 'white', 
                  border: '2px solid #e5e7eb',
                  borderRadius: 8,
                  overflow: 'hidden'
                }}
              >
                <div style={{ 
                  background: '#2b6f3f',
                  color: 'white',
                  padding: 16, 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <h3 style={{ margin: 0 }}>{script.productName}</h3>
                  <button
                    onClick={() => copyScript(script.script)}
                    style={{
                      padding: '8px 16px',
                      background: 'white',
                      color: '#2b6f3f',
                      border: 'none',
                      borderRadius: 4,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    📋 Copy for WaveSpeed
                  </button>
                </div>

                <div style={{ padding: 16 }}>
                  <div style={{ 
                    background: '#fffbeb',
                    border: '1px solid #fcd34d',
                    borderRadius: 6,
                    padding: 12,
                    marginBottom: 16
                  }}>
                    <strong>🎣 Hook:</strong> {script.hook}
                  </div>

                  <pre style={{ 
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace',
                    fontSize: 13,
                    lineHeight: 1.6,
                    background: '#f9fafb',
                    padding: 16,
                    borderRadius: 6,
                    overflow: 'auto',
                    maxHeight: 400
                  }}>
                    {script.script}
                  </pre>

                  <details style={{ marginTop: 16 }}>
                    <summary style={{ 
                      cursor: 'pointer', 
                      fontWeight: 600,
                      padding: 12,
                      background: '#eff6ff',
                      borderRadius: 6
                    }}>
                      📹 WaveSpeed Scene Breakdown
                    </summary>
                    <div style={{ marginTop: 12 }}>
                      {script.waveSpeedScenes.map((scene, i) => (
                        <div key={i} style={{ 
                          marginBottom: 12,
                          padding: 12,
                          background: scene.productShot ? '#f0fdf4' : '#f9fafb',
                          borderRadius: 6,
                          border: scene.productShot ? '2px solid #22c55e' : '1px solid #e5e7eb'
                        }}>
                          <div style={{ 
                            fontWeight: 700,
                            marginBottom: 6,
                            display: 'flex',
                            justifyContent: 'space-between'
                          }}>
                            <span>Scene {scene.scene}: {scene.title}</span>
                            <span style={{ 
                              fontSize: 12,
                              background: '#dbeafe',
                              padding: '2px 8px',
                              borderRadius: 12
                            }}>
                              {scene.duration}
                            </span>
                          </div>
                          <div style={{ fontSize: 13, color: '#374151', marginTop: 4 }}>
                            🎬 {scene.visuals}
                          </div>
                          <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
                            📝 &quot;{scene.textOverlay}&quot;
                          </div>
                          {scene.productShot && (
                            <div style={{ 
                              marginTop: 8,
                              fontSize: 12,
                              fontWeight: 600,
                              color: '#059669'
                            }}>
                              ⭐ PRODUCT FEATURE SCENE - Upload your product photo here
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {products.length === 0 && !loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: 64, 
          color: '#9ca3af',
          background: '#f9fafb',
          borderRadius: 8,
          border: '2px dashed #d1d5db'
        }}>
          <p style={{ fontSize: 20, marginBottom: 8 }}>👆 Click &quot;Load Products&quot; to get started</p>
          <p style={{ fontSize: 14 }}>This will read your Google Sheet and prepare scripts for WaveSpeed</p>
        </div>
      )}
    </div>
  );
}
EOF
