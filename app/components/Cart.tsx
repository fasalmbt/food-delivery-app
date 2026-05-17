'use client'

import { CartItem } from '@/lib/types'

interface CartProps {
  items: CartItem[]
  onUpdateQuantity: (id: number, quantity: number) => void
  onRemoveItem: (id: number) => void
  onCheckout: () => void
}

export default function Cart({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartProps) {
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Shopping Cart</h2>
        <p className="text-gray-600">Your cart is empty. Add items from the menu!</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h2>

      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b pb-4"
          >
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{item.name}</h3>
              <p className="text-sm text-gray-600">
                ₹{item.price.toFixed(2)} each
              </p>
            </div>

            <div className="flex items-center gap-3">

              <div className="flex items-center border rounded-md">
                <button
                  onClick={() =>
                    onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
                  }
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                >
                  −
                </button>
                <span className="px-4 py-2 text-gray-900 font-medium">
                  {item.quantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              <span className="text-lg font-semibold text-gray-900 w-20 text-right">
                ₹{(item.price * item.quantity).toFixed(2)}
              </span>

              <button
                onClick={() => onRemoveItem(item.id)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-6">
          <span className="text-xl font-bold text-gray-900">Total:</span>
          <span className="text-3xl font-bold text-orange-600">
            ₹{totalPrice.toFixed(2)}
          </span>
        </div>

        <button
          onClick={onCheckout}
          disabled={items.length === 0}
          className="w-full px-6 py-3 bg-orange-600 text-white text-lg font-semibold rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  )
}
