import { useState } from 'react'
import Head from 'next/head'
import { useProducts } from '@/lib/hooks/useProducts'

export default function AdminProductsPage() {
  const [search, setSearch] = useState('')
  const [includeInactive, setIncludeInactive] = useState(false)
  const { products, loading, error, refresh } = useProducts({ search, includeInactive, limit: 100 })
  const [token, setToken] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function updateInventory(id: string, inventory: number, is_active?: boolean) {
    if (!token) { setMessage('Set admin token first'); return }
    setUpdating(id)
    setMessage(null)
    try {
      const res = await fetch('/api/products/update-inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-ADMIN-TOKEN': token },
        body: JSON.stringify({ id, inventory, is_active })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Update failed')
      setMessage('Updated ' + id)
      refresh()
    } catch (e: any) {
      setMessage(e.message)
    } finally {
      setUpdating(null)
    }
  }

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '1.5rem' }}>
      <Head><title>Admin Products</title></Head>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 16 }}>Admin Products</h1>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <input
          placeholder="Search title or keyword"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: 6, minWidth: 240 }}
        />
        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="checkbox" checked={includeInactive} onChange={e => setIncludeInactive(e.target.checked)} /> Include inactive
        </label>
        <input
          placeholder="Admin token"
            value={token}
          onChange={e => setToken(e.target.value)}
          style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: 6, minWidth: 240 }}
        />
        <button onClick={() => refresh()} style={{ padding: '0.55rem 1rem', background: '#174F2E', color: 'white', border: 'none', borderRadius: 6 }}>Refresh</button>
      </div>
      {message && <div style={{ marginBottom: 12, color: '#174F2E' }}>{message}</div>}
      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'red' }}>{error.message}</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ background: '#f0f7f2' }}>
            <th style={th}>ID</th>
            <th style={th}>Title</th>
            <th style={th}>Keyword</th>
            <th style={th}>Price</th>
            <th style={th}>Inventory</th>
            <th style={th}>Active</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <ProductRow key={p.id} p={p as any} updating={updating === p.id} onUpdate={updateInventory} />
          ))}
        </tbody>
      </table>
    </main>
  )
}

const th: React.CSSProperties = { textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid #ddd' }
const td: React.CSSProperties = { padding: '6px 8px', borderBottom: '1px solid #eee', verticalAlign: 'top' }

function ProductRow({ p, updating, onUpdate }: { p: any; updating: boolean; onUpdate: (id: string, inv: number, act?: boolean) => void }) {
  const [inv, setInv] = useState(p.inventory ?? '')
  const [active, setActive] = useState(p.available)
  return (
    <tr>
      <td style={td}>{p.id}</td>
      <td style={td}>{p.title}</td>
      <td style={td}>{p.keyword || ''}</td>
      <td style={td}>{p.price !== undefined ? `$${p.price}` : ''}</td>
      <td style={td}>
        <input
          value={inv}
          onChange={e => setInv(e.target.value)}
          style={{ width: 70, padding: 4 }}
          disabled={updating}
        />
      </td>
      <td style={td}>
        <input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} disabled={updating} />
      </td>
      <td style={td}>
        <button
          onClick={() => onUpdate(p.id, inv === '' ? 0 : Number(inv), active)}
          disabled={updating}
          style={{ padding: '4px 10px', background: '#174F2E', color: 'white', border: 'none', borderRadius: 4 }}
        >
          {updating ? 'Saving...' : 'Save'}
        </button>
      </td>
    </tr>
  )
}