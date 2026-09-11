import fs from 'node:fs'
import path from 'node:path'
import type { OrderRecord } from './orders'

const CACHE_FILE = path.resolve(process.cwd(), '.orders-local.json')

export function getLocalOrders(): OrderRecord[] {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const content = fs.readFileSync(CACHE_FILE, 'utf-8')
      const parsed = JSON.parse(content)
      return Array.isArray(parsed) ? parsed : []
    }
  } catch (err) {
    console.warn('Could not read local orders cache:', err)
  }
  return []
}

export function saveLocalOrder(order: OrderRecord) {
  try {
    const orders = getLocalOrders()
    const updated = [order, ...orders.filter((o) => o.id !== order.id)]
    fs.writeFileSync(CACHE_FILE, JSON.stringify(updated, null, 2), 'utf-8')
  } catch (err) {
    console.warn('Could not write local orders cache:', err)
  }
}

export function updateLocalOrderStatus(id: string, status: OrderRecord['status']) {
  try {
    const orders = getLocalOrders()
    const updated = orders.map((o) => (o.id === id ? { ...o, status } : o))
    fs.writeFileSync(CACHE_FILE, JSON.stringify(updated, null, 2), 'utf-8')
  } catch (err) {
    console.warn('Could not update local orders cache:', err)
  }
}
