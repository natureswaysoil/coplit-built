import { useEffect, useState } from 'react'

type Health = { ok: boolean; hasSecret: boolean; hasPublishable: boolean }

export default function Smoke() {
	const [health, setHealth] = useState<Health | null>(null)
	const [orderResult, setOrderResult] = useState<any>(null)
	const [orders, setOrders] = useState<any[]>([])
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		let mounted = true
		;(async () => {
			try {
				const h = await fetch('/api/health').then(r => r.json())
				if (!mounted) return
				setHealth(h)

				const resp = await fetch('/api/order-create', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						customer: {
							name: 'Smoke Test',
							email: 'smoke@example.com',
							phone: '555-000-0000',
							address1: '1 Test Way',
							city: 'Raleigh',
							state: 'NC',
							zip: '27601',
							county: 'Wake'
						},
						items: [
							{ sku: 'TEST-001', title: 'Smoke Test Item', size: '1 Gallon', qty: 1, price: 10.0 }
						],
						subtotal: 10.0,
						tax: 0.48,
						total: 10.48
					})
				})
				const jr = await resp.json().catch(() => ({}))
				if (!mounted) return
				setOrderResult({ ok: resp.ok, status: resp.status, body: jr })

				const ords = await fetch('/api/orders').then(r => r.json()).catch(() => ({ orders: [] }))
				if (!mounted) return
				const list = Array.isArray(ords) ? ords : (Array.isArray((ords as any).orders) ? (ords as any).orders : [])
				setOrders(list.slice(-5).reverse())
			} catch (e: any) {
				if (!mounted) return
				setError(e?.message || 'Smoke test failed')
			}
		})()
		return () => { mounted = false }
	}, [])

	return (
		<div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
			<h1>Smoke Test</h1>
			<p>This page checks that the app and core APIs are working locally.</p>

			<section style={{ marginTop: 20 }}>
				<h2>Health</h2>
				{health ? (
					<pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 6 }}>{JSON.stringify(health, null, 2)}</pre>
				) : (
					<p>Loading health…</p>
				)}
			</section>

			<section style={{ marginTop: 20 }}>
				<h2>Create Test Order</h2>
				{orderResult ? (
					<pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 6 }}>{JSON.stringify(orderResult, null, 2)}</pre>
				) : (
					<p>Creating test order…</p>
				)}
			</section>

			<section style={{ marginTop: 20 }}>
				<h2>Recent Orders (last 5)</h2>
				<pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 6 }}>{JSON.stringify(orders, null, 2)}</pre>
			</section>

			{error && (
				<section style={{ marginTop: 20, color: 'crimson' }}>
					<h2>Error</h2>
					<pre style={{ background: '#fff0f0', padding: 12, border: '1px solid #f3c0c0', borderRadius: 6 }}>{error}</pre>
				</section>
			)}
		</div>
	)
}

