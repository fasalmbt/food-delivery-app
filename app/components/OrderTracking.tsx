'use client'

import { Order, OrderStatus } from '@/lib/types'
import { useEffect, useState } from 'react'

interface OrderTrackingProps {
  order: Order
  onNewOrder: () => void
}

export default function OrderTracking({ order, onNewOrder }: OrderTrackingProps) {
  const [currentStatus, setCurrentStatus] = useState(order.status)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [showDeliveryModal, setShowDeliveryModal] = useState(false)

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      setCurrentStatus((prev) => {
        const statuses = [
          OrderStatus.ORDER_RECEIVED,
          OrderStatus.PREPARING,
          OrderStatus.OUT_FOR_DELIVERY,
          OrderStatus.DELIVERED,
        ]
        const currentIndex = statuses.indexOf(prev)
        if (currentIndex < statuses.length - 1) {
          const nextStatus = statuses[currentIndex + 1]
          if (nextStatus === OrderStatus.DELIVERED) {
            setShowDeliveryModal(true)
          }
          return nextStatus
        }
        return prev
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [autoRefresh])

  const statuses = [
    OrderStatus.ORDER_RECEIVED,
    OrderStatus.PREPARING,
    OrderStatus.OUT_FOR_DELIVERY,
    OrderStatus.DELIVERED,
  ]

  const currentStatusIndex = statuses.indexOf(currentStatus)

  return (
    <div className="relative">

      {showDeliveryModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-500">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-500 border-4 border-orange-50">

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-8 text-center relative overflow-hidden">

              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-white blur-xl" />
                <div className="absolute bottom-4 right-4 w-16 h-16 rounded-full bg-white blur-xl" />
              </div>

              <div className="relative z-10">
                <div className="bg-white/20 p-4 rounded-full w-24 h-24 mx-auto mb-4 backdrop-blur-md flex items-center justify-center border-2 border-white/30 animate-bounce">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-3xl font-black text-white mb-2 tracking-tight">Food Delivered!</h3>
                <p className="text-orange-50 font-bold opacity-90 uppercase tracking-widest text-xs">Hope you enjoy your meal</p>
              </div>
            </div>

            <div className="p-8 text-center">
              <div className="mb-6 space-y-2">
                <p className="text-gray-900 font-black text-xl">Order #{order.id.split('-')[1]}</p>
                <p className="text-gray-500 text-sm font-medium">Your delicious food has arrived at your doorstep.</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 mb-8 flex items-center justify-between border border-gray-100">
                <div className="text-left">
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-wider">Total Amount</p>
                  <p className="text-2xl font-black text-orange-600">₹{order.totalPrice.toFixed(2)}</p>
                </div>
                <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowDeliveryModal(false)
                  onNewOrder()
                }}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-gray-800 shadow-xl shadow-gray-200 transition-all active:scale-95"
              >
                Awesome, Done!
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-orange-600 p-8 text-white">
          <h2 className="text-3xl font-black tracking-tight mb-2">Track Order</h2>
          <div className="flex items-center gap-2 opacity-80 text-sm font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Live Status • ID: {order.id}
          </div>
        </div>

        <div className="p-8">

          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Customer</p>
              <p className="font-bold text-gray-900 truncate">{order.customerName}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Phone</p>
              <p className="font-bold text-gray-900 truncate">{order.phone}</p>
            </div>
          </div>

          <div className="space-y-12 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100 mb-12">
            {statuses.map((status, index) => {
              const isActive = index <= currentStatusIndex
              const isCurrent = index === currentStatusIndex

              return (
                <div key={status} className="relative pl-12">

                  <div
                    className={`absolute left-0 top-1 w-8 h-8 rounded-full border-4 border-white shadow-md z-10 flex items-center justify-center transition-all duration-500 ${
                      isActive ? 'bg-orange-600 scale-110' : 'bg-gray-300'
                    }`}
                  >
                    {isActive && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>

                  <div>
                    <h3 className={`font-black uppercase tracking-wider text-sm transition-colors duration-500 ${
                      isActive ? 'text-gray-900' : 'text-gray-300'
                    }`}>
                      {status}
                    </h3>
                    {isCurrent && (
                      <p className="text-orange-600 text-xs font-bold animate-pulse mt-1">Processing...</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="border-2 border-dashed border-gray-100 rounded-3xl p-6 mb-10 bg-gray-50/30">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Your Order</h4>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="font-bold text-gray-700">{item.name} <span className="text-gray-400 ml-1">× {item.quantity}</span></span>
                  <span className="font-black text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs font-black text-gray-900 uppercase">Paid Total</span>
                <span className="text-xl font-black text-orange-600">₹{order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mb-10 p-4 bg-orange-50 rounded-2xl border border-orange-100">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-black text-orange-600 uppercase tracking-wider">Simulation Mode</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-orange-500 transition-colors after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4 shadow-inner" />
              </div>
            </label>
          </div>

          <button
            onClick={onNewOrder}
            className="w-full py-4 text-gray-400 font-black uppercase tracking-widest text-xs hover:text-gray-600 transition-colors"
          >
            Cancel Order (Demo)
          </button>
        </div>
      </div>
    </div>
  )
}
