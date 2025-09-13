import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import { useProducts } from '@/lib/hooks/useProducts'

// Lightweight dashboard to monitor products, create new ones, and manage variations
export default function AdminDashboard() {
  const [search, setSearch] = useState('')
  const [includeInactive, setIncludeInactive] = useState(true)
  const { products, loading, error, refresh } = useProducts({ search, includeInactive, limit: 500 })
  const [adminToken, setAdminToken] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<any>({ title: '', slug: '', price: '', keyword: '', short_description: '', image_url: '', inventory: '', is_active: true })
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)

  // Variation form state
  const [varForm, setVarForm] = useState<any>({ size: '', price: '', sku: '', inventory: '' })
  const [varLoading, setVarLoading] = useState(false)
  const [varMessage, setVarMessage] = useState<string | null>(null)

  const metrics = useMemo(() => {
    const total = products.length
    let active = 0, inactive = 0, low = 0, variations = 0
    products.forEach(p => {
      if (p.available) active++; else inactive++
      if (p.inventory !== null && p.inventory !== undefined && p.inventory <= 5) low++
      if (p.variations) variations += p.variations.length
    })
    return { total, active, inactive, low, variations }
  }, [products])

  function updateForm(key: string, value: any) { setForm((f: any) => ({ ...f, [key]: value })) }
  function updateVarForm(key: string, value: any) { setVarForm((f: any) => ({ ...f, [key]: value })) }

  async function createProduct() {
    if (!adminToken) { setMessage('Set admin token'); return }
    if (!form.title) { setMessage('Title required'); return }
    setCreating(true); setMessage(null)
    try {
      const payload: any = { ...form }
      ;['price','inventory'].forEach(k => { if (payload[k] === '') delete payload[k]; else payload[k] = Number(payload[k]) })
      const res = await fetch('/api/products/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-ADMIN-TOKEN': adminToken },
        body: JSON.stringify(payload)
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Create failed')
      setMessage('Created product ' + json.product.id)
      setForm({ title: '', slug: '', price: '', keyword: '', short_description: '', image_url: '', inventory: '', is_active: true })
      refresh()
    } catch (e: any) {
      setMessage(e.message)
    } finally {
      setCreating(false)
    }
  }

  async function addVariation() {
    if (!selectedProduct) { setVarMessage('Select a product first'); return }
    if (!adminToken) { setVarMessage('Set admin token'); return }
    if (!varForm.size || !varForm.price || !varForm.sku) { setVarMessage('Size, price & sku required'); return }
    setVarLoading(true); setVarMessage(null)
    try {
      const payload: any = { product_id: selectedProduct.id, size: varForm.size, price: Number(varForm.price), sku: varForm.sku }
      if (varForm.inventory !== '') payload.inventory = Number(varForm.inventory)
      const res = await fetch('/api/products/variations/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-ADMIN-TOKEN': adminToken },
        body: JSON.stringify(payload)
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Variation create failed')
      setVarMessage('Variation added')
      setVarForm({ size: '', price: '', sku: '', inventory: '' })
      refresh()
    } catch (e: any) {
      setVarMessage(e.message)
    } finally { setVarLoading(false) }
  }

  return (
    <main style={{ maxWidth: 1280, margin: '0 auto', padding: '1.5rem' }}>
      <Head><title>Admin Dashboard</title></Head>
      <h1 style={{ fontSize: 30, fontWeight: 700, marginBottom: 8 }}>Admin Dashboard</h1>

      {/* Metrics */}
      <section style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
        {['total','active','inactive','low','variations'].map(k => (
          <div key={k} style={{ flex: '0 1 150px', background: '#f4f9f5', padding: '12px 14px', borderRadius: 10, border: '1px solid #e1eee4' }}>
            <div style={{ fontSize: 12, letterSpacing: 0.5, textTransform: 'uppercase', color: '#2c553a' }}>{k}</div>
            <div style={{ fontSize: 22, fontWeight: 600 }}>{(metrics as any)[k]}</div>
          </div>
        ))}
      </section>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        <input placeholder='Search' value={search} onChange={e=>setSearch(e.target.value)} style={input} />
        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type='checkbox' checked={includeInactive} onChange={e=>setIncludeInactive(e.target.checked)} /> Include inactive
        </label>
        <input placeholder='Admin token' value={adminToken} onChange={e=>setAdminToken(e.target.value)} style={input} />
  <button onClick={() => refresh()} style={button}>Refresh</button>
      </div>

      {message && <div style={{ marginBottom: 12, color: '#174F2E' }}>{message}</div>}
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error.message}</div>}

      {/* Product creation */}
      <details open style={{ marginBottom: 28 }}>
        <summary style={{ fontWeight: 600, cursor: 'pointer', marginBottom: 12 }}>Create Product</summary>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {['title','slug','price','keyword','short_description','image_url','inventory'].map(k => (
            <input key={k} placeholder={k.replace('_',' ')} value={form[k]} onChange={e=>updateForm(k, e.target.value)} style={input} />
          ))}
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type='checkbox' checked={form.is_active} onChange={e=>updateForm('is_active', e.target.checked)} /> Active
          </label>
          <button disabled={creating} onClick={createProduct} style={button}>{creating ? 'Creating…' : 'Create'}</button>
        </div>
      </details>

      {/* Products list */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 480 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f0f7f2' }}>
                <th style={th}>ID</th>
                <th style={th}>Title</th>
                <th style={th}>Price</th>
                <th style={th}>Inv</th>
                <th style={th}>Act</th>
                <th style={th}>Vars</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ cursor: 'pointer', background: selectedProduct?.id === p.id ? '#e2f3e7' : undefined }} onClick={()=>setSelectedProduct(p)}>
                  <td style={td}>{p.id}</td>
                  <td style={td}>{p.title}</td>
                  <td style={td}>{p.price !== undefined ? `$${p.price}` : ''}</td>
                  <td style={td}>{p.inventory ?? ''}</td>
                  <td style={td}>{p.available ? '✓' : ''}</td>
                  <td style={td}>{p.variations?.length || 0}</td>
                </tr>
              ))}
              {!loading && products.length === 0 && <tr><td style={td} colSpan={6}>No products</td></tr>}
            </tbody>
          </table>
        </div>

        {/* Variation + details panel */}
        <div style={{ flex: 1, minWidth: 420 }}>
          {selectedProduct ? (
            <div style={{ border: '1px solid #e1eee4', padding: 16, borderRadius: 10 }}>
              <h3 style={{ margin: '0 0 8px' }}>{selectedProduct.title}</h3>
              <p style={{ margin: '0 0 8px', fontSize: 12 }}>{selectedProduct.description}</p>
              <div style={{ fontSize: 12, marginBottom: 12 }}>Slug: {selectedProduct.slug}</div>
              <div style={{ fontSize: 12, marginBottom: 12 }}>Keyword: {selectedProduct.keyword || '-'}</div>
              <div style={{ fontSize: 12, marginBottom: 12 }}>Inventory: {selectedProduct.inventory ?? '—'}</div>
              <div style={{ fontSize: 12, marginBottom: 12 }}>Variations:</div>
              <ul style={{ margin: '0 0 12px', paddingLeft: 18 }}>
                {(selectedProduct.variations || []).map((v: any) => (
                  <li key={v.sku} style={{ fontSize: 12 }}>{v.size} - ${v.price.toFixed(2)} ({v.sku})</li>
                ))}
                {(!selectedProduct.variations || selectedProduct.variations.length === 0) && <li style={{ fontSize: 12, opacity: 0.6 }}>None</li>}
              </ul>
              <details>
                <summary style={{ fontWeight: 600, cursor: 'pointer', marginBottom: 8 }}>Add Variation</summary>
                {varMessage && <div style={{ marginBottom: 8, color: '#174F2E' }}>{varMessage}</div>}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                  {['size','price','sku','inventory'].map(k => (
                    <input key={k} placeholder={k} value={varForm[k]} onChange={e=>updateVarForm(k, e.target.value)} style={{ ...input, flex: '1 1 140px' }} />
                  ))}
                  <button disabled={varLoading} onClick={addVariation} style={button}>{varLoading ? 'Saving…' : 'Add'}</button>
                </div>
              </details>
            </div>
          ) : (
            <div style={{ padding: 20, fontSize: 13, color: '#555' }}>Select a product to manage variations.</div>
          )}
        </div>
      </div>
    </main>
  )
}

const th: React.CSSProperties = { textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid #ddd' }
const td: React.CSSProperties = { padding: '6px 8px', borderBottom: '1px solid #eee', verticalAlign: 'top' }
const input: React.CSSProperties = { padding: '6px 8px', border: '1px solid #ccc', borderRadius: 6 }
const button: React.CSSProperties = { padding: '6px 12px', background: '#174F2E', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }
