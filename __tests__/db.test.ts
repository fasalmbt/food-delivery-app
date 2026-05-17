import {
  getMenuItems,
  getMenuItemById,
  addMenuItem,
  clearAllMenuItems,
  createOrder,
  getOrderById,
  updateOrderStatus,
  clearAllOrders,
} from '@/lib/db'
import { OrderStatus } from '@/lib/types'

describe('Database Operations', () => {
  beforeEach(() => {
    clearAllMenuItems()
    clearAllOrders()

    addMenuItem({
      name: 'Margherita Pizza',
      description: 'Classic pizza',
      price: 12.99,
      image: '/pizza.jpg'
    })
  })

  describe('Menu Items', () => {
    it('should return all menu items', () => {
      const items = getMenuItems()
      expect(items).toBeDefined()
      expect(items.length).toBeGreaterThan(0)
    })

    it('should return correct menu item by id', () => {
      const item = getMenuItemById(1)
      expect(item).toBeDefined()
      expect(item?.id).toBe(1)
      expect(item?.name).toBeDefined()
      expect(item?.price).toBeGreaterThan(0)
    })

    it('should return undefined for non-existent item', () => {
      const item = getMenuItemById(999)
      expect(item).toBeUndefined()
    })
  })

  describe('Order Operations', () => {
    it('should create an order', () => {
      const order = createOrder({
        items: [{ id: 1, name: 'Pizza', price: 12.99, quantity: 1 }],
        customerName: 'John Doe',
        address: '123 Main St',
        phone: '5551234567',
        status: OrderStatus.ORDER_RECEIVED,
        totalPrice: 12.99,
      })

      expect(order).toBeDefined()
      expect(order.id).toBeDefined()
      expect(order.customerName).toBe('John Doe')
      expect(order.status).toBe(OrderStatus.ORDER_RECEIVED)
      expect(order.createdAt).toBeDefined()
    })

    it('should retrieve created order by id', () => {
      const createdOrder = createOrder({
        items: [{ id: 1, name: 'Pizza', price: 12.99, quantity: 1 }],
        customerName: 'Jane Doe',
        address: '456 Oak Ave',
        phone: '5559876543',
        status: OrderStatus.ORDER_RECEIVED,
        totalPrice: 12.99,
      })

      const retrievedOrder = getOrderById(createdOrder.id)
      expect(retrievedOrder).toBeDefined()
      expect(retrievedOrder?.id).toBe(createdOrder.id)
      expect(retrievedOrder?.customerName).toBe('Jane Doe')
    })

    it('should return undefined for non-existent order', () => {
      const order = getOrderById('NON-EXISTENT')
      expect(order).toBeUndefined()
    })

    it('should update order status', async () => {
      const createdOrder = createOrder({
        items: [{ id: 1, name: 'Pizza', price: 12.99, quantity: 1 }],
        customerName: 'John Doe',
        address: '123 Main St',
        phone: '5551234567',
        status: OrderStatus.ORDER_RECEIVED,
        totalPrice: 12.99,
      })

      await new Promise(resolve => setTimeout(resolve, 1))

      const updated = updateOrderStatus(createdOrder.id, OrderStatus.PREPARING)
      expect(updated).toBeDefined()
      expect(updated?.status).toBe(OrderStatus.PREPARING)
      expect(updated?.updatedAt).not.toBe(createdOrder.updatedAt)
    })

    it('should return undefined when updating non-existent order', () => {
      const updated = updateOrderStatus('NON-EXISTENT', OrderStatus.PREPARING)
      expect(updated).toBeUndefined()
    })
  })
})
