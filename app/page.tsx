'use client'

import { useEffect, useState } from 'react'
import Menu from './components/Menu'
import Cart from './components/Cart'
import Checkout, { CheckoutFormData } from './components/Checkout'
import OrderTracking from './components/OrderTracking'
import { MenuItem, CartItem, Order } from '@/lib/types'

type AppScreen = 'menu' | 'checkout' | 'confirmation'

export default function Home() {
  const [screen, setScreen] = useState<AppScreen>('menu')
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMenuItems()
  }, [])

  const fetchMenuItems = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/menu')
      const data = await response.json()

      if (data.success) {
        setMenuItems(data.data)
      } else {
        setError('Failed to fetch menu items')
      }
    } catch (err) {
      setError('Error fetching menu items')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id)

      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      }

      return [
        ...prevCart,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
        },
      ]
    })
  }

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(id)
      return
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  const handleRemoveFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      setError('Cart is empty')
      return
    }
    setScreen('checkout')
  }

  const handleSubmitOrder = async (formData: CheckoutFormData) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart,
          customerName: formData.customerName,
          address: formData.address,
          phone: formData.phone,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setCurrentOrder(data.data)
        setCart([])
        setScreen('confirmation')
      } else {
        setError(data.error || 'Failed to place order')
      }
    } catch (err) {
      setError('Error placing order')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleNewOrder = () => {
    setCart([])
    setCurrentOrder(null)
    setScreen('menu')
    setError(null)
  }

  const renderScreen = () => {
    switch (screen) {
      case 'menu':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">Loading menu...</p>
                </div>
              ) : (
                <Menu items={menuItems} onAddToCart={handleAddToCart} />
              )}
            </div>
            <div>
              <Cart
                items={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveFromCart}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        )

      case 'checkout':
        return (
          <div className="max-w-2xl mx-auto">
            <Checkout
              items={cart}
              onSubmit={handleSubmitOrder}
              isLoading={loading}
              onBack={() => setScreen('menu')}
            />
          </div>
        )

      case 'confirmation':
        return (
          <div className="max-w-2xl mx-auto">
            {currentOrder && (
              <OrderTracking order={currentOrder} onNewOrder={handleNewOrder} />
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <main className="min-h-screen bg-gray-100">

      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-orange-600">FoodHub</h1>
            <p className="text-gray-600">Order delicious food, delivered to your door</p>
          </div>
          <a
            href="/images"
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors font-medium"
          >
            Admin Panel
          </a>
        </div>
      </header>

      {error && (
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm font-medium text-red-800">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-700 text-sm font-medium mt-2"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {renderScreen()}
      </div>
    </main>
  )
}
