'use client'

import { CartItem } from '@/lib/types'
import { useState } from 'react'

interface CheckoutProps {
  items: CartItem[]
  onSubmit: (data: CheckoutFormData) => void
  isLoading?: boolean
  onBack: () => void
}

export interface CheckoutFormData {
  customerName: string
  address: string
  phone: string
}

export default function Checkout({
  items,
  onSubmit,
  isLoading = false,
  onBack,
}: CheckoutProps) {
  const [formData, setFormData] = useState<CheckoutFormData>({
    customerName: '',
    address: '',
    phone: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.customerName || formData.customerName.length < 2) {
      newErrors.customerName = 'Name must be at least 2 characters'
    }

    if (!formData.address || formData.address.length < 5) {
      newErrors.address = 'Address must be at least 5 characters'
    }

    const phoneRegex = /^[0-9]{10}$/
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Phone must be a 10-digit number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Delivery Details</h2>

      <div className="bg-gray-50 rounded-md p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
        <div className="space-y-2 mb-3">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm text-gray-600">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t pt-3 flex justify-between font-bold text-gray-900">
          <span>Total:</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-gray-900 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.customerName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="John Doe"
          />
          {errors.customerName && (
            <p className="text-red-600 text-sm mt-1">{errors.customerName}</p>
          )}
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-900 mb-1">
            Delivery Address
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 placeholder-gray-500 ${
              errors.address ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Kochi, Kerala, India"
          />
          {errors.address && (
            <p className="text-red-600 text-sm mt-1">{errors.address}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-1">
            Phone Number (10 digits)
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            inputMode="numeric"
            maxLength={10}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 placeholder-gray-500 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="9876543210"
          />
          {errors.phone && (
            <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Back to Cart
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50 font-semibold"
          >
            {isLoading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  )
}
