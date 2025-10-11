import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/lib/cartContext'
import { useState } from 'react'

interface Variation { sku: string; size: string; price: number }
interface ProductLike {
  id: string | number
  slug?: string
  title: string
  image: string
  details?: string
  keyword?: string
  variations?: Variation[]
}

export function ProductGrid({ products }: { products: ProductLike[] }) {
  const { addItem } = useCart()
  const [selected, setSelected] = useState<Record<string | number, string>>({})

  if (!products?.length) return <p style={{ textAlign: 'center' }}>No products available.</p>

  return (
    <div className="grid grid-3">
      {products.map(p => {
        const variations = p.variations || []
        const hasMany = variations.length > 1
        const autoSku = selected[p.id] || variations[0]?.sku
        return (
          <div key={p.id} className="product-card">
            <div style={{ position: 'relative' }}>
              <Image src={p.image} alt={p.title} width={300} height={200} style={{ width: '100%', height: '200px', objectFit: 'contain' }} />
              {p.keyword && (
                <span className="badge" style={{ position: 'absolute', top: 'var(--space-sm)', left: 'var(--space-sm)' }}>{p.keyword}</span>
              )}
            </div>
            <div className="product-card-content">
              <h3>{p.title}</h3>
              {p.details && <p>{p.details}</p>}
              <div className="mb-md">
                <Link href={`/products/${p.slug || p.id}`} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>View Details →</Link>
              </div>
              {variations.length > 0 && (
                <div className="mb-md">
                  {hasMany && (
                    <label htmlFor={`grid-size-${p.id}`} className="form-label">Choose size</label>
                  )}
                  {hasMany ? (
                    <select
                      id={`grid-size-${p.id}`}
                      value={autoSku || ''}
                      onChange={e => setSelected(s => ({ ...s, [p.id]: e.target.value }))}
                      className="form-input"
                    >
                      {variations.map(v => (
                        <option key={v.sku} value={v.sku}>{v.size} - ${v.price.toFixed(2)}</option>
                      ))}
                    </select>
                  ) : (
                    <div style={{ fontWeight: 600 }}>{variations[0].size} - ${variations[0].price.toFixed(2)}</div>
                  )}
                </div>
              )}
              <button
                onClick={() => {
                  if (!variations.length) return
                  const sku = autoSku
                  const variant = variations.find(v => v.sku === sku) || variations[0]
                  if (!variant) return
                  addItem({ id: String(p.id), title: p.title, image: p.image, sku: variant.sku, size: variant.size, price: variant.price, qty: 1 })
                }}
                disabled={!variations.length}
                className={variations.length ? 'btn btn-primary' : 'btn btn-secondary'}
                style={{ width: '100%' }}
              >
                {variations.length ? 'Add to Cart' : 'Unavailable'}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
