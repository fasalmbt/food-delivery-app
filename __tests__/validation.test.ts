import { validateData, orderSchema, orderStatusSchema } from '@/lib/validation'
import { OrderStatus } from '@/lib/types'

describe('Validation', () => {
  describe('orderSchema', () => {
    it('should validate a valid order', () => {
      const validOrder = {
        items: [
          {
            id: 1,
            name: 'Pizza',
            price: 12.99,
            quantity: 2,
          },
        ],
        customerName: 'John Doe',
        address: '123 Main St, New York, NY 10001',
        phone: '5551234567',
      }

      const { error } = validateData(validOrder, orderSchema)
      expect(error).toBeUndefined()
    })

    it('should reject order with no items', () => {
      const invalidOrder = {
        items: [],
        customerName: 'John Doe',
        address: '123 Main St',
        phone: '5551234567',
      }

      const { error } = validateData(invalidOrder, orderSchema)
      expect(error).toBeDefined()
    })

    it('should reject order with invalid phone', () => {
      const invalidOrder = {
        items: [
          {
            id: 1,
            name: 'Pizza',
            price: 12.99,
            quantity: 1,
          },
        ],
        customerName: 'John Doe',
        address: '123 Main St',
        phone: 'invalid',
      }

      const { error } = validateData(invalidOrder, orderSchema)
      expect(error).toBeDefined()
    })

    it('should reject order with short name', () => {
      const invalidOrder = {
        items: [
          {
            id: 1,
            name: 'Pizza',
            price: 12.99,
            quantity: 1,
          },
        ],
        customerName: 'J',
        address: '123 Main St',
        phone: '5551234567',
      }

      const { error } = validateData(invalidOrder, orderSchema)
      expect(error).toBeDefined()
    })

    it('should reject order with short address', () => {
      const invalidOrder = {
        items: [
          {
            id: 1,
            name: 'Pizza',
            price: 12.99,
            quantity: 1,
          },
        ],
        customerName: 'John Doe',
        address: '123',
        phone: '5551234567',
      }

      const { error } = validateData(invalidOrder, orderSchema)
      expect(error).toBeDefined()
    })
  })

  describe('orderStatusSchema', () => {
    it('should validate valid statuses', () => {
      const validStatuses = [
        'Order Received',
        'Preparing',
        'Out for Delivery',
        'Delivered',
      ]

      validStatuses.forEach((status) => {
        const { error } = validateData({ status }, orderStatusSchema)
        expect(error).toBeUndefined()
      })
    })

    it('should reject invalid status', () => {
      const { error } = validateData({ status: 'Invalid Status' }, orderStatusSchema)
      expect(error).toBeDefined()
    })
  })
})
