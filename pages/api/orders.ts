import { promises as fs } from 'fs'
import path from 'path'
import type { NextApiRequest, NextApiResponse } from 'next'

const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json')

// Read orders from file
async function readOrders(): Promise<any[]> {
  try {
    const data = await fs.readFile(ORDERS_FILE, 'utf8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const orders = await readOrders()

    // Sort by creation date (newest first)
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return res.status(200).json({
      orders,
      total: orders.length,
      message: 'Orders retrieved successfully'
    })

  } catch (error: any) {
    console.error('Orders retrieval error:', error)
    return res.status(500).json({
      error: 'Failed to retrieve orders',
      details: error?.message || String(error)
    })
  }
}
