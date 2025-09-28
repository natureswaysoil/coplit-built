import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useProducts } from '@/lib/hooks/useProducts'

// Lightweight dashboard to monitor products, create new ones, and manage variations
export default function AdminDashboard() {
  const router = useRouter()
  
  // Global / shared state
  const [adminToken, setAdminToken] = useState('')
  const [activeTab, setActiveTab] = useState<'products' | 'alerts' | 'promos' | 'analytics'>('products')

  /* -------------------- PRODUCTS TAB STATE -------------------- */
  const [search, setSearch] = useState('')
  const [includeInactive, setIncludeInactive] = useState(true)
  const { products, loading, error, refresh } = useProducts({ search, includeInactive, limit: 500 })
  const [message, setMessage] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<any>({ title: '', slug: '', price: '', keyword: '', short_description: '', image_url: '', inventory: '', is_active: true })
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)
  const [varForm, setVarForm] = useState<any>({ size: '', price: '', sku: '', inventory: '' })
  const [varLoading, setVarLoading] = useState(false)
  const [varMessage, setVarMessage] = useState<string | null>(null)
  const [editingVarSku, setEditingVarSku] = useState<string | null>(null)
  const [varDraft, setVarDraft] = useState<any>({})
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editDraft, setEditDraft] = useState<any>({})
  const [showOnlyLow, setShowOnlyLow] = useState(false)
  const LOW_THRESHOLD = 5
  async function triggerRevalidate() {
    if (!adminToken) { setMessage('Set admin token'); return }
    try {
      const res = await fetch('/api/revalidate', { method: 'POST', headers: { 'X-ADMIN-TOKEN': adminToken } })
      if (res.ok) setMessage('Revalidation triggered')
      else {
        const j = await res.json(); setMessage(j.error || 'Failed to revalidate')
      }
    } catch (e: any) { setMessage(e.message) }
  }
  function exportCSV() {
    // Build flat rows for products and variations
    const rows: string[][] = []
    rows.push(['type','id','parent_id','title_or_code','slug','price_or_value','inventory','is_active','extra'])
    products.forEach(p => {
      rows.push(['product', String(p.id), '', p.title || '', p.slug || '', p.price != null ? String(p.price) : '', p.inventory != null ? String(p.inventory) : '', p.available ? '1':'0', ''])
      ;(p.variations||[]).forEach((v: any) => {
        rows.push(['variation', v.sku, String(p.id), v.size, '', v.price != null ? String(v.price) : '', v.inventory != null ? String(v.inventory) : '', '', ''])
      })
    })
    promos.forEach(pr => {
      rows.push(['promo', String(pr.id), '', pr.code, '', pr.type === 'amount' ? String(pr.amount_off ?? '') : String(pr.percent_off ?? ''), '', pr.is_active ? '1':'0', pr.type])
    })
    const csv = rows.map(r => r.map(f => '"' + f.replace(/"/g,'""') + '"').join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'export.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  /* -------------------- ALERTS TAB STATE -------------------- */
  interface AlertSub { id: number; email: string; product_id: number | null; threshold: number; is_active: boolean; created_at: string }
  const [alerts, setAlerts] = useState<AlertSub[]>([])
  const [alertsLoading, setAlertsLoading] = useState(false)
  const [alertsMessage, setAlertsMessage] = useState<string | null>(null)
  const [alertForm, setAlertForm] = useState<{ email: string; product_id: string; threshold: string }>({ email: '', product_id: '', threshold: '5' })

  /* -------------------- PROMOS TAB STATE -------------------- */
  interface Promo { id: number; code: string; description: string | null; type: string; amount_off: number | null; percent_off: number | null; max_redemptions: number | null; expires_at: string | null; is_active: boolean; created_at: string }
  const [promos, setPromos] = useState<Promo[]>([])
  const [promosLoading, setPromosLoading] = useState(false)
  const [promoMessage, setPromoMessage] = useState<string | null>(null)
  const [promoForm, setPromoForm] = useState<any>({ code: '', description: '', type: 'amount', amount_off: '', percent_off: '', max_redemptions: '', expires_at: '', is_active: true })
  const [editingPromoId, setEditingPromoId] = useState<number | null>(null)
  const [promoDraft, setPromoDraft] = useState<any>({})

  /* -------------------- ANALYTICS TAB STATE -------------------- */
  interface EventTypeRow { event_type: string; total: number; last_7d: number }
  interface TopProductRow { product_id: string; last_7d: number }
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [analyticsMessage, setAnalyticsMessage] = useState<string | null>(null)
  const [analytics, setAnalytics] = useState<{ total_events: number; last_7d_events: number; events_by_type: EventTypeRow[]; top_products: TopProductRow[] } | null>(null)

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
  function updateAlertForm(key: string, value: any) { setAlertForm(f => ({ ...f, [key]: value })) }
  function updatePromoForm(key: string, value: any) { setPromoForm((f: any) => ({ ...f, [key]: value })) }
  function updatePromoDraft(key: string, value: any) { setPromoDraft((d: any) => ({ ...d, [key]: value })) }

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

  function startVarEdit(v: any) {
    setEditingVarSku(v.sku)
    setVarDraft({ price: v.price, inventory: v.inventory ?? '' })
  }
  function cancelVarEdit() { setEditingVarSku(null); setVarDraft({}) }
  function updateVarDraft(key: string, value: any) { setVarDraft((d: any) => ({ ...d, [key]: value })) }
  async function saveVarEdit(sku: string) {
    if (!adminToken) { setVarMessage('Set admin token'); return }
    try {
      const payload: any = { sku }
      if (varDraft.price !== undefined) payload.price = Number(varDraft.price)
      if (varDraft.inventory !== '') payload.inventory = Number(varDraft.inventory); else payload.inventory = null
      const res = await fetch('/api/products/variations/update', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-ADMIN-TOKEN': adminToken }, body: JSON.stringify(payload) })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Update failed')
      setVarMessage('Saved variation')
      cancelVarEdit()
      refresh()
    } catch (e: any) { setVarMessage(e.message) }
  }
  async function deleteVariation(sku: string) {
    if (!adminToken) { setVarMessage('Set admin token'); return }
    if (!confirm('Delete variation?')) return
    const res = await fetch('/api/products/variations/delete', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-ADMIN-TOKEN': adminToken }, body: JSON.stringify({ sku }) })
    if (res.ok) {
      setVarMessage('Deleted variation')
      refresh()
    } else {
      const j = await res.json(); setVarMessage(j.error || 'Delete failed')
    }
  }

  /* -------------------- INLINE PRODUCT EDITING -------------------- */
  function startEdit(p: any) {
    setEditingId(p.id)
    setEditDraft({ title: p.title, price: p.price ?? '', inventory: p.inventory ?? '', is_active: p.available })
  }
  function updateDraft(key: string, value: any) { setEditDraft((d: any) => ({ ...d, [key]: value })) }
  function cancelEdit() { setEditingId(null); setEditDraft({}) }
  async function saveEdit(id: number) {
    if (!adminToken) { setMessage('Set admin token'); return }
    try {
      const payload: any = { id }
      if (editDraft.title !== undefined) payload.title = editDraft.title
      if (editDraft.price !== '') payload.price = Number(editDraft.price); else payload.price = null
      if (editDraft.inventory !== '') payload.inventory = Number(editDraft.inventory); else payload.inventory = null
      if (editDraft.is_active !== undefined) payload.is_active = !!editDraft.is_active
      const res = await fetch('/api/products/update', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-ADMIN-TOKEN': adminToken }, body: JSON.stringify(payload) })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Update failed')
      setMessage('Saved product ' + id)
      cancelEdit()
      refresh()
    } catch (e: any) { setMessage(e.message) }
  }

  /* -------------------- ALERT SUBSCRIPTIONS FUNCTIONS -------------------- */
  async function loadAlerts() {
    if (!adminToken) { setAlertsMessage('Set admin token'); return }
    setAlertsLoading(true); setAlertsMessage(null)
    try {
      const res = await fetch('/api/alerts/list', { headers: { 'X-ADMIN-TOKEN': adminToken } })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to load alerts')
      setAlerts(json.subscriptions || [])
    } catch (e: any) {
      setAlertsMessage(e.message)
    } finally { setAlertsLoading(false) }
  }

  async function createAlertSub() {
    if (!adminToken) { setAlertsMessage('Set admin token'); return }
    if (!alertForm.email) { setAlertsMessage('Email required'); return }
    setAlertsMessage(null)
    try {
      const payload: any = { email: alertForm.email }
      if (alertForm.product_id) payload.product_id = Number(alertForm.product_id)
      if (alertForm.threshold) payload.threshold = Number(alertForm.threshold)
      const res = await fetch('/api/alerts/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-ADMIN-TOKEN': adminToken }, body: JSON.stringify(payload) })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Create failed')
      setAlertsMessage('Subscription created')
      setAlertForm({ email: '', product_id: '', threshold: '5' })
      loadAlerts()
    } catch (e: any) { setAlertsMessage(e.message) }
  }

  async function toggleActive(id: number, is_active: boolean) {
    if (!adminToken) return
    const endpoint = is_active ? '/api/alerts/deactivate' : '/api/alerts/activate'
    await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-ADMIN-TOKEN': adminToken }, body: JSON.stringify({ id }) })
    loadAlerts()
  }

  /* -------------------- PROMO FUNCTIONS -------------------- */
  async function loadPromos() {
    if (!adminToken) { setPromoMessage('Set admin token'); return }
    setPromosLoading(true); setPromoMessage(null)
    try {
      const res = await fetch('/api/promo/admin/list', { headers: { 'X-ADMIN-TOKEN': adminToken } })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to load promos')
      setPromos(json.promos || [])
    } catch (e: any) { setPromoMessage(e.message) } finally { setPromosLoading(false) }
  }
  async function createPromo() {
    if (!adminToken) { setPromoMessage('Set admin token'); return }
    if (!promoForm.code) { setPromoMessage('Code required'); return }
    try {
      const payload: any = { code: promoForm.code, type: promoForm.type, description: promoForm.description || null, is_active: promoForm.is_active }
      if (promoForm.type === 'amount' && promoForm.amount_off !== '') payload.amount_off = Number(promoForm.amount_off)
      if (promoForm.type === 'percent' && promoForm.percent_off !== '') payload.percent_off = Number(promoForm.percent_off)
      if (promoForm.max_redemptions !== '') payload.max_redemptions = Number(promoForm.max_redemptions)
      if (promoForm.expires_at) payload.expires_at = new Date(promoForm.expires_at).toISOString()
      const res = await fetch('/api/promo/admin/create', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-ADMIN-TOKEN': adminToken }, body: JSON.stringify(payload) })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Create failed')
      setPromoMessage('Promo created')
      setPromoForm({ code: '', description: '', type: 'amount', amount_off: '', percent_off: '', max_redemptions: '', expires_at: '', is_active: true })
      loadPromos()
    } catch (e: any) { setPromoMessage(e.message) }
  }
  function startPromoEdit(p: Promo) {
    setEditingPromoId(p.id)
    setPromoDraft({ description: p.description || '', amount_off: p.amount_off ?? '', percent_off: p.percent_off ?? '', max_redemptions: p.max_redemptions ?? '', expires_at: p.expires_at ? p.expires_at.slice(0,10) : '', is_active: p.is_active })
  }
  function cancelPromoEdit() { setEditingPromoId(null); setPromoDraft({}) }
  async function savePromoEdit(id: number) {
    if (!adminToken) { setPromoMessage('Set admin token'); return }
    try {
      const payload: any = { id }
      ;['description','amount_off','percent_off','max_redemptions'].forEach(k => {
        const v = promoDraft[k]
        if (v === '' || v === undefined) return
        payload[k] = k.includes('off') || k === 'max_redemptions' ? Number(v) : v
      })
      if (promoDraft.expires_at) payload.expires_at = new Date(promoDraft.expires_at).toISOString(); else if (promoDraft.expires_at === '') payload.expires_at = null
      if (promoDraft.is_active !== undefined) payload.is_active = !!promoDraft.is_active
      const res = await fetch('/api/promo/admin/update', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-ADMIN-TOKEN': adminToken }, body: JSON.stringify(payload) })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Update failed')
      setPromoMessage('Saved promo ' + id)
      cancelPromoEdit(); loadPromos()
    } catch (e: any) { setPromoMessage(e.message) }
  }
  async function deletePromo(id: number) {
    if (!adminToken) return
    if (!confirm('Delete promo?')) return
    const res = await fetch('/api/promo/admin/delete', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-ADMIN-TOKEN': adminToken }, body: JSON.stringify({ id }) })
    if (res.ok) { setPromoMessage('Deleted'); loadPromos() } else { const j = await res.json(); setPromoMessage(j.error || 'Delete failed') }
  }
  useEffect(() => { if (activeTab === 'promos') loadPromos() }, [activeTab])
  async function loadAnalytics() {
    if (!adminToken) { setAnalyticsMessage('Set admin token'); return }
    setAnalyticsLoading(true); setAnalyticsMessage(null)
    try {
      const res = await fetch('/api/analytics/summary', { headers: { 'X-ADMIN-TOKEN': adminToken } })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to load analytics')
      setAnalytics(json)
    } catch (e: any) { setAnalyticsMessage(e.message) } finally { setAnalyticsLoading(false) }
  }
  useEffect(() => { if (activeTab === 'analytics') loadAnalytics() }, [activeTab])

  async function deleteAlert(id: number) {
    if (!adminToken) return
    if (!confirm('Delete subscription?')) return
    await fetch('/api/alerts/delete', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-ADMIN-TOKEN': adminToken }, body: JSON.stringify({ id }) })
    loadAlerts()
  }

  useEffect(() => {
    if (activeTab === 'alerts') loadAlerts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  // Admin logout function
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      document.cookie = 'admin-session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Force logout even if API fails
      document.cookie = 'admin-session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      router.push('/admin/login')
    }
  }

  return (
    <main style={{ maxWidth: 1380, margin: '0 auto', padding: '1.5rem' }}>
      <Head><title>Admin Dashboard - Nature's Way Soil</title></Head>
      
      {/* Header with logout */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 30, fontWeight: 700, margin: 0 }}>Admin Dashboard</h1>
        <button 
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            background: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 14
          }}
        >
          🔒 Logout
        </button>
      </div>

      {/* Security notice */}
      <div style={{
        background: '#dcfce7',
        border: '1px solid #16a34a',
        borderRadius: 8,
        padding: '12px 16px',
        marginBottom: 16,
        fontSize: 14,
        color: '#15803d'
      }}>
        <strong>🔒 Security Active:</strong> Admin panel is now protected with authentication. Session expires in 24 hours.
      </div>

      {/* Global controls */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <input placeholder='Admin token' value={adminToken} onChange={e=>setAdminToken(e.target.value)} style={input} />
        <div style={{ display: 'flex', gap: 4 }}>
          {[
            ['products','Products'],
            ['alerts','Alerts'],
            ['promos','Promos'],
            ['analytics','Analytics']
          ].map(([k,label]) => (
            <button key={k} onClick={()=>setActiveTab(k as any)} style={{ ...tabButton, background: activeTab===k ? '#174F2E' : '#e4efe8', color: activeTab===k ? 'white' : '#174F2E' }}>{label}</button>
          ))}
        </div>
      </div>

      {activeTab === 'products' && (
        <div>
          {/* Metrics */}
          <section style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
            {['total','active','inactive','low','variations'].map(k => (
              <div key={k} style={{ flex: '0 1 150px', background: '#f4f9f5', padding: '12px 14px', borderRadius: 10, border: '1px solid #e1eee4' }}>
                <div style={{ fontSize: 12, letterSpacing: 0.5, textTransform: 'uppercase', color: '#2c553a' }}>{k}</div>
                <div style={{ fontSize: 22, fontWeight: 600 }}>{(metrics as any)[k]}</div>
              </div>
            ))}
          </section>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
            <input placeholder='Search' value={search} onChange={e=>setSearch(e.target.value)} style={input} />
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input type='checkbox' checked={includeInactive} onChange={e=>setIncludeInactive(e.target.checked)} /> Include inactive
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input type='checkbox' checked={showOnlyLow} onChange={e=>setShowOnlyLow(e.target.checked)} /> Only low (≤ {LOW_THRESHOLD})
            </label>
            <button onClick={() => refresh()} style={button}>Refresh</button>
            <button onClick={triggerRevalidate} style={button}>Revalidate</button>
            <button onClick={exportCSV} style={button}>Export CSV</button>
          </div>
          {message && <div style={{ marginBottom: 12, color: '#174F2E' }}>{message}</div>}
          {error && <div style={{ color: 'red', marginBottom: 12 }}>{error.message}</div>}
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
                  {products.filter(p => !showOnlyLow || ((p.inventory ?? Infinity) <= LOW_THRESHOLD)).map(p => {
                    const isEditing = editingId === p.id
                    return (
                      <tr key={p.id} style={{ background: selectedProduct?.id === p.id ? '#e2f3e7' : ((p.inventory ?? Infinity) <= LOW_THRESHOLD ? '#fff4e5' : undefined) }}>
                        <td style={td} onClick={()=>setSelectedProduct(p)}>{p.id}</td>
                        <td style={td} onClick={()=>!isEditing && setSelectedProduct(p)}>
                          {isEditing ? <input value={editDraft.title} onChange={e=>updateDraft('title', e.target.value)} style={{ ...input, padding: '2px 4px', width: '100%' }} /> : p.title}
                        </td>
                        <td style={td} onClick={()=>!isEditing && setSelectedProduct(p)}>
                          {isEditing ? <input value={editDraft.price} onChange={e=>updateDraft('price', e.target.value)} style={{ ...input, padding: '2px 4px', width: 70 }} /> : (p.price !== undefined ? `$${p.price}` : '')}
                        </td>
                        <td style={td} onClick={()=>!isEditing && setSelectedProduct(p)}>
                          {isEditing ? <input value={editDraft.inventory} onChange={e=>updateDraft('inventory', e.target.value)} style={{ ...input, padding: '2px 4px', width: 60 }} /> : (p.inventory ?? '')}
                        </td>
                        <td style={td} onClick={()=>!isEditing && setSelectedProduct(p)}>
                          {isEditing ? <input type='checkbox' checked={!!editDraft.is_active} onChange={e=>updateDraft('is_active', e.target.checked)} /> : (p.available ? '✓' : '')}
                        </td>
                        <td style={td}>
                          {isEditing ? (
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button style={miniBtn} onClick={()=>saveEdit(p.id)}>Save</button>
                              <button style={miniBtnDanger} onClick={cancelEdit}>Cancel</button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button style={miniBtn} onClick={()=>startEdit(p)}>Edit</button>
                              <span>{p.variations?.length || 0}</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                  {!loading && products.length === 0 && <tr><td style={td} colSpan={6}>No products</td></tr>}
                </tbody>
              </table>
            </div>
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
                    {(selectedProduct.variations || []).map((v: any) => {
                      const isEditing = editingVarSku === v.sku
                      return (
                        <li key={v.sku} style={{ fontSize: 12, marginBottom: 4 }}>
                          <strong>{v.size}</strong>{' '}-{' '}
                          {isEditing ? (
                            <>
                              $<input value={varDraft.price} onChange={e=>updateVarDraft('price', e.target.value)} style={{ ...input, padding: '2px 4px', width: 60 }} />{' '}
                              Inv:<input value={varDraft.inventory} onChange={e=>updateVarDraft('inventory', e.target.value)} style={{ ...input, padding: '2px 4px', width: 50 }} />{' '}
                              <button style={miniBtn} onClick={()=>saveVarEdit(v.sku)}>Save</button>
                              <button style={miniBtnDanger} onClick={cancelVarEdit}>Cancel</button>
                            </>
                          ) : (
                            <>
                              ${v.price.toFixed(2)} (inv {v.inventory ?? '—'}) ({v.sku}){' '}
                              <button style={miniBtn} onClick={()=>startVarEdit(v)}>Edit</button>
                              <button style={miniBtnDanger} onClick={()=>deleteVariation(v.sku)}>Del</button>
                            </>
                          )}
                        </li>
                      )
                    })}
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
        </div>
      )}

      {activeTab === 'alerts' && (
        <div>
          <h2 style={{ fontSize: 20, margin: '8px 0 16px' }}>Inventory Alert Subscriptions</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
              <input placeholder='Email' value={alertForm.email} onChange={e=>updateAlertForm('email', e.target.value)} style={input} />
              <input placeholder='Product ID (optional)' value={alertForm.product_id} onChange={e=>updateAlertForm('product_id', e.target.value)} style={input} />
              <input placeholder='Threshold' value={alertForm.threshold} onChange={e=>updateAlertForm('threshold', e.target.value)} style={{ ...input, width: 90 }} />
              <button onClick={createAlertSub} style={button}>Subscribe</button>
              <button onClick={loadAlerts} style={button}>Reload</button>
            </div>
            {alertsMessage && <div style={{ color: '#174F2E', marginBottom: 12 }}>{alertsMessage}</div>}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f0f7f2' }}>
                  <th style={th}>ID</th>
                  <th style={th}>Email</th>
                  <th style={th}>Product</th>
                  <th style={th}>Threshold</th>
                  <th style={th}>Active</th>
                  <th style={th}>Created</th>
                  <th style={th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map(a => (
                  <tr key={a.id}>
                    <td style={td}>{a.id}</td>
                    <td style={td}>{a.email}</td>
                    <td style={td}>{a.product_id ?? 'Any'}</td>
                    <td style={td}>{a.threshold}</td>
                    <td style={td}>{a.is_active ? '✓' : ''}</td>
                    <td style={td}>{new Date(a.created_at).toLocaleDateString()}</td>
                    <td style={{ ...td, display: 'flex', gap: 6 }}>
                      <button style={miniBtn} onClick={()=>toggleActive(a.id, a.is_active)}>{a.is_active ? 'Deactivate' : 'Activate'}</button>
                      <button style={miniBtnDanger} onClick={()=>deleteAlert(a.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {!alertsLoading && alerts.length === 0 && <tr><td style={td} colSpan={7}>No subscriptions</td></tr>}
                {alertsLoading && <tr><td style={td} colSpan={7}>Loading…</td></tr>}
              </tbody>
            </table>
        </div>
      )}

      {activeTab === 'promos' && (
        <div style={{ padding: '12px 4px' }}>
          <h2 style={{ fontSize: 20, margin: '8px 0 12px' }}>Promotions</h2>
          <details open style={{ marginBottom: 20 }}>
            <summary style={{ fontWeight: 600, cursor: 'pointer', marginBottom: 8 }}>Create Promo</summary>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <input placeholder='Code' value={promoForm.code} onChange={e=>updatePromoForm('code', e.target.value)} style={input} />
              <select value={promoForm.type} onChange={e=>updatePromoForm('type', e.target.value)} style={input as any}>
                <option value='amount'>Amount off</option>
                <option value='percent'>Percent off</option>
              </select>
              {promoForm.type === 'amount' && <input placeholder='Amount off' value={promoForm.amount_off} onChange={e=>updatePromoForm('amount_off', e.target.value)} style={input} />}
              {promoForm.type === 'percent' && <input placeholder='Percent off' value={promoForm.percent_off} onChange={e=>updatePromoForm('percent_off', e.target.value)} style={input} />}
              <input placeholder='Description' value={promoForm.description} onChange={e=>updatePromoForm('description', e.target.value)} style={{ ...input, flex: '1 1 240px' }} />
              <input placeholder='Max redemptions' value={promoForm.max_redemptions} onChange={e=>updatePromoForm('max_redemptions', e.target.value)} style={input} />
              <input type='date' value={promoForm.expires_at} onChange={e=>updatePromoForm('expires_at', e.target.value)} style={input} />
              <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input type='checkbox' checked={promoForm.is_active} onChange={e=>updatePromoForm('is_active', e.target.checked)} /> Active
              </label>
              <button style={button} onClick={createPromo}>Create</button>
            </div>
          </details>
          {promoMessage && <div style={{ color: '#174F2E', marginBottom: 12 }}>{promoMessage}</div>}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f0f7f2' }}>
                <th style={th}>ID</th>
                <th style={th}>Code</th>
                <th style={th}>Type</th>
                <th style={th}>Value</th>
                <th style={th}>Active</th>
                <th style={th}>Expires</th>
                <th style={th}>Redemptions</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {promos.map(p => {
                const isEditing = editingPromoId === p.id
                return (
                  <tr key={p.id}>
                    <td style={td}>{p.id}</td>
                    <td style={td}>{p.code}</td>
                    <td style={td}>{p.type}</td>
                    <td style={td}>{p.type === 'amount' ? (p.amount_off ?? '') : (p.percent_off ?? '')}</td>
                    <td style={td}>{p.is_active ? '✓' : ''}</td>
                    <td style={td}>{p.expires_at ? p.expires_at.slice(0,10) : ''}</td>
                    <td style={td}>{p.max_redemptions ?? ''}</td>
                    <td style={td}>
                      {isEditing ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <input placeholder='Description' value={promoDraft.description} onChange={e=>updatePromoDraft('description', e.target.value)} style={{ ...input, padding: '2px 4px' }} />
                          {p.type === 'amount' && <input placeholder='Amount off' value={promoDraft.amount_off} onChange={e=>updatePromoDraft('amount_off', e.target.value)} style={{ ...input, padding: '2px 4px' }} />}
                          {p.type === 'percent' && <input placeholder='Percent off' value={promoDraft.percent_off} onChange={e=>updatePromoDraft('percent_off', e.target.value)} style={{ ...input, padding: '2px 4px' }} />}
                          <input placeholder='Max redemptions' value={promoDraft.max_redemptions} onChange={e=>updatePromoDraft('max_redemptions', e.target.value)} style={{ ...input, padding: '2px 4px' }} />
                          <input type='date' value={promoDraft.expires_at} onChange={e=>updatePromoDraft('expires_at', e.target.value)} style={{ ...input, padding: '2px 4px' }} />
                          <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
                            <input type='checkbox' checked={!!promoDraft.is_active} onChange={e=>updatePromoDraft('is_active', e.target.checked)} /> Active
                          </label>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button style={miniBtn} onClick={()=>savePromoEdit(p.id)}>Save</button>
                            <button style={miniBtnDanger} onClick={cancelPromoEdit}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          <button style={miniBtn} onClick={()=>startPromoEdit(p)}>Edit</button>
                          <button style={miniBtnDanger} onClick={()=>deletePromo(p.id)}>Del</button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
              {!promosLoading && promos.length === 0 && <tr><td style={td} colSpan={8}>No promos</td></tr>}
              {promosLoading && <tr><td style={td} colSpan={8}>Loading…</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div style={{ padding: '12px 4px' }}>
          <h2 style={{ fontSize: 20, margin: '8px 0 12px' }}>Analytics</h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
            <button style={button} onClick={loadAnalytics}>Reload</button>
          </div>
          {analyticsMessage && <div style={{ color: '#174F2E', marginBottom: 12 }}>{analyticsMessage}</div>}
          {analyticsLoading && <div style={{ marginBottom: 12 }}>Loading…</div>}
          {analytics && (
            <div>
              <section style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
                <div style={kpiBox}>Total Events<div style={kpiNumber}>{analytics.total_events}</div></div>
                <div style={kpiBox}>Last 7d Events<div style={kpiNumber}>{analytics.last_7d_events}</div></div>
              </section>
              <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 380px' }}>
                  <h3 style={subHeader}>Events by Type</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead><tr style={{ background: '#f0f7f2' }}><th style={th}>Type</th><th style={th}>Total</th><th style={th}>Last 7d</th><th style={th}>% 7d</th></tr></thead>
                    <tbody>
                      {analytics.events_by_type.map(r => {
                        const pct = analytics.total_events ? ((r.last_7d / analytics.total_events) * 100).toFixed(1) : '0'
                        return <tr key={r.event_type}><td style={td}>{r.event_type}</td><td style={td}>{r.total}</td><td style={td}>{r.last_7d}</td><td style={td}>{pct}%</td></tr>
                      })}
                      {analytics.events_by_type.length === 0 && <tr><td style={td} colSpan={4}>None</td></tr>}
                    </tbody>
                  </table>
                </div>
                <div style={{ flex: '1 1 320px' }}>
                  <h3 style={subHeader}>Top Products (7d)</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead><tr style={{ background: '#f0f7f2' }}><th style={th}>Product ID</th><th style={th}>Events</th></tr></thead>
                    <tbody>
                      {analytics.top_products.map(r => <tr key={r.product_id}><td style={td}>{r.product_id}</td><td style={td}>{r.last_7d}</td></tr>)}
                      {analytics.top_products.length === 0 && <tr><td style={td} colSpan={2}>None</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  )
}

const th: React.CSSProperties = { textAlign: 'left', padding: '7px 10px', borderBottom: '1px solid #cfe1d6', fontSize: 11, letterSpacing: 0.5, textTransform: 'uppercase', color: '#14512d', background: '#e8f3ec' }
const td: React.CSSProperties = { padding: '6px 10px', borderBottom: '1px solid #edf3ef', verticalAlign: 'top', fontSize: 13 }
const input: React.CSSProperties = { padding: '6px 8px', border: '1px solid #b7c7bd', borderRadius: 6, background: '#fff' }
const button: React.CSSProperties = { padding: '6px 12px', background: '#174F2E', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }
const tabButton: React.CSSProperties = { padding: '6px 14px', borderRadius: 18, border: '1px solid #174F2E33', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: '#e4efe8', transition: 'background .15s' }
const miniBtn: React.CSSProperties = { padding: '4px 8px', fontSize: 11, background: '#174F2E', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', lineHeight: 1.1 }
const miniBtnDanger: React.CSSProperties = { ...miniBtn, background: '#b0192e' }
const kpiBox: React.CSSProperties = { background: '#f4f9f5', padding: '14px 16px', borderRadius: 12, border: '1px solid #d5e6da', fontSize: 12, fontWeight: 600, flex: '0 1 180px', color: '#174F2E', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }
const kpiNumber: React.CSSProperties = { fontSize: 26, fontWeight: 700, marginTop: 4, color: '#0d3620' }
const subHeader: React.CSSProperties = { margin: '4px 0 8px', fontSize: 14, fontWeight: 600, letterSpacing: 0.5, color: '#174F2E', textTransform: 'uppercase' }
