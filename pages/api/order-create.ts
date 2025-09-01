import { promises as fs } from 'fs'
import path from 'path'
import type { NextApiRequest, NextApiResponse } from 'next'

const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json')
const CUSTOMERS_FILE = path.join(process.cwd(), 'data', 'customers.json')

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Generate order number
function generateOrderNumber(): string {
  const now = new Date()
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
  const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '')
  return `ORD-${dateStr}-${timeStr}`
}

// Read orders from file
async function readOrders(): Promise<any[]> {
  try {
    const data = await fs.readFile(ORDERS_FILE, 'utf8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

// Write orders to file
async function writeOrders(orders: any[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2))
}

// Read customers from file
async function readCustomers(): Promise<any[]> {
  try {
    const data = await fs.readFile(CUSTOMERS_FILE, 'utf8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

// Write customers to file
async function writeCustomers(customers: any[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(CUSTOMERS_FILE, JSON.stringify(customers, null, 2))
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
  const { customer, items, subtotal, tax, total, paymentIntentId } = req.body || {}

    if (!customer || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Missing required fields: customer and items' })
    }

    // Read existing data
    const customers = await readCustomers()
    const orders = await readOrders()

    // Find or create customer
    let existingCustomer = customers.find(c => c.email === customer.email)
    if (!existingCustomer) {
      existingCustomer = {
        id: `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        createdAt: new Date().toISOString()
      }
      customers.push(existingCustomer)
      await writeCustomers(customers)
    }

    // Generate order number
    const orderNumber = generateOrderNumber()

    // Create order
  const order = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderNumber,
      customerId: existingCustomer.id,
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address1: customer.address1,
        address2: customer.address2,
        city: customer.city,
        state: customer.state,
        zip: customer.zip,
        county: customer.county
      },
      items: items.map((item: any) => ({
        sku: item.sku,
        title: item.title,
        size: item.size,
        qty: item.qty,
        price: item.price,
        total: item.price * item.qty
      })),
      subtotal: subtotal || 0,
      tax: tax || 0,
  total: total || 0,
  status: paymentIntentId ? 'paid' : 'confirmed',
  payment: paymentIntentId ? { paymentIntentId } : undefined,
      createdAt: new Date().toISOString()
    }

    // Save order
    orders.push(order)
    await writeOrders(orders)

    console.log('Order created successfully:', orderNumber)

    return res.status(200).json({
      orderId: orderNumber,
      message: 'Order created successfully',
      order: order
    })

  } catch (error: any) {
    console.error('Order creation error:', error)
    return res.status(500).json({
      error: 'Failed to create order',
      details: error?.message || String(error)
    })
  }
}
