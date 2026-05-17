'use client'

import { MenuItem } from '@/lib/types'
import Image from 'next/image'

interface MenuProps {
  items: MenuItem[]
  onAddToCart?: (item: MenuItem) => void
  onDelete?: (id: number) => void
}

export default function Menu({ items, onAddToCart, onDelete }: MenuProps) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
          {onDelete ? 'Manage Menu Items' : 'Our Menu'}
        </h2>

        {items.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">No menu items found. Add some in the Admin section!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border"
              >

                <div className="relative w-full h-48 bg-gray-200">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    priority={false}
                  />
                  {onDelete && (
                    <button
                      onClick={() => onDelete(item.id)}
                      className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full shadow hover:bg-red-700 transition-colors"
                      title="Delete Item"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 h-12 overflow-hidden text-ellipsis">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-orange-600">
                      ₹{item.price.toFixed(2)}
                    </span>
                    {onAddToCart && (
                      <button
                        onClick={() => onAddToCart(item)}
                        className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors font-medium"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
