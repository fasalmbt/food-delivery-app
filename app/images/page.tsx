'use client'

import { useState } from 'react'
import ImageUpload from '../components/ImageUpload'
import Menu from '../components/Menu'
import { MenuItem } from '@/lib/types'
import { useEffect } from 'react'

export default function ImagesPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(false)

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
      }
    } catch (err) {
      console.error('Failed to fetch menu:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMenuItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return

    try {
      const response = await fetch(`/api/menu/${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.success) {
        fetchMenuItems()
      }
    } catch (err) {
      console.error('Failed to delete menu item:', err)
    }
  }

  return (
    <main className="min-h-screen bg-[#fafafa]">

      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Control <span className="text-orange-600">Center</span>
            </h1>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Menu & Asset Management</p>
          </div>
          <div className="flex gap-4">
            <a
              href="/"
              className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-black uppercase tracking-wider hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 active:scale-95"
            >
              Back to Shop
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        <div className="mb-12 flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 w-fit">
          <a
            href="/"
            className="px-8 py-3 text-sm font-black uppercase tracking-wider text-gray-400 hover:text-gray-900 transition-all rounded-xl"
          >
            Storefront
          </a>
          <a
            href="/images"
            className="px-8 py-3 text-sm font-black uppercase tracking-wider bg-orange-600 text-white rounded-xl shadow-lg shadow-orange-100"
          >
            Management
          </a>
        </div>

        <ImageUpload />

        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Current Menu
            </h3>
            <button
              onClick={fetchMenuItems}
              className="px-4 py-2 bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 text-sm font-medium transition-colors"
            >
              Refresh Menu
            </button>
          </div>

          <p className="text-gray-600 mb-6">
            Manage your active menu items here. You can add new items by uploading images above and clicking "Add to Menu".
          </p>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading menu...</p>
            </div>
          ) : (
            <Menu items={menuItems} onDelete={handleDeleteMenuItem} />
          )}
        </div>
      </div>
    </main>
  )
}
