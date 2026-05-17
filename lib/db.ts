import { MenuItem, Order, OrderStatus } from './types'

let menuItems: MenuItem[] = []
let nextMenuId = 1

export function getMenuItems(): MenuItem[] {
  return menuItems
}

export function getMenuItemById(id: number): MenuItem | undefined {
  return menuItems.find((item) => item.id === id)
}

export function addMenuItem(item: Omit<MenuItem, 'id'>): MenuItem {
  const newItem: MenuItem = {
    ...item,
    id: nextMenuId++,
  }
  menuItems.push(newItem)
  return newItem
}

export function updateMenuItem(id: number, updates: Partial<Omit<MenuItem, 'id'>>): MenuItem | undefined {
  const item = menuItems.find((m) => m.id === id)
  if (!item) return undefined

  const updated = { ...item, ...updates }
  const index = menuItems.findIndex((m) => m.id === id)
  menuItems[index] = updated
  return updated
}

export function deleteMenuItem(id: number): boolean {
  const index = menuItems.findIndex((m) => m.id === id)
  if (index === -1) return false
  menuItems.splice(index, 1)
  return true
}

export function clearAllMenuItems(): void {
  menuItems = []
  nextMenuId = 1
}

const orders: Map<string, Order> = new Map()

export function createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order {
  const id = `ORD-${Date.now()}`
  const newOrder: Order = {
    ...order,
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  orders.set(id, newOrder)
  return newOrder
}

export function getOrderById(id: string): Order | undefined {
  return orders.get(id)
}

export function updateOrderStatus(id: string, status: OrderStatus): Order | undefined {
  const order = orders.get(id)
  if (!order) return undefined

  const updatedOrder: Order = {
    ...order,
    status,
    updatedAt: new Date().toISOString(),
  }
  orders.set(id, updatedOrder)
  return updatedOrder
}

export function getAllOrders(): Order[] {
  return Array.from(orders.values())
}

export function clearAllOrders(): void {
  orders.clear()
}
