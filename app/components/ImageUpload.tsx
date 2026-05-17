'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import Image from 'next/image'

interface UploadedImage {
  id: string
  filename: string
  size: number
  mimeType: string
  uploadedAt: string
  url: string
}

export default function ImageUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [loadingImages, setLoadingImages] = useState(false)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]

    if (!selectedFile) return

    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select a valid image file')
      return
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    setFile(selectedFile)
    setError(null)

    const reader = new FileReader()
    reader.onload = (event) => {
      setPreview(event.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!file) {
      setError('Please select a file')
      return
    }

    try {
      setUploading(true)
      setError(null)
      setSuccess(null)

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/images', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || 'Failed to upload image')
        return
      }

      setSuccess('Image uploaded successfully!')
      setFile(null)
      setPreview(null)

      const form = e.target as HTMLFormElement
      form.reset()

      await loadImages()
    } catch (err) {
      setError('Error uploading image')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const loadImages = async () => {
    try {
      setLoadingImages(true)
      const response = await fetch('/api/images')
      const data = await response.json()

      if (data.success) {
        setUploadedImages(data.data)
      }
    } catch (err) {
      console.error('Failed to load images:', err)
    } finally {
      setLoadingImages(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
      const response = await fetch(`/api/images/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Image deleted successfully')
        await loadImages()
      } else {
        setError(data.error || 'Failed to delete image')
      }
    } catch (err) {
      setError('Error deleting image')
      console.error(err)
    }
  }

  const [menuForm, setMenuForm] = useState<{
    imageId: string | null
    name: string
    description: string
    price: string
  }>({
    imageId: null,
    name: '',
    description: '',
    price: '',
  })

  const handleCreateMenuItem = async (e: FormEvent) => {
    e.preventDefault()
    if (!menuForm.imageId) return

    try {
      setUploading(true)
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: menuForm.name,
          description: menuForm.description,
          price: parseFloat(menuForm.price),
          image: `/api/images/${menuForm.imageId}`,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setSuccess('Menu item created successfully!')
        setMenuForm({ imageId: null, name: '', description: '', price: '' })

      } else {
        setError(data.error || 'Failed to create menu item')
      }
    } catch (err) {
      setError('Error creating menu item')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-8">

      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
          <span className="bg-orange-100 text-orange-600 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </span>
          Upload Food Images
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="relative group">
            <label
              htmlFor="file-input"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              Select Image File
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-orange-50 hover:border-orange-300 transition-all duration-300 group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-3 text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                  <p className="mb-2 text-sm text-gray-500 group-hover:text-gray-700 font-medium">
                    {file ? file.name : <span className="font-bold text-orange-600">Click to upload</span>}
                  </p>
                  <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
                </div>
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          {preview && (
            <div className="animate-in zoom-in-95 duration-300">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Selected Preview</p>
              <div className="relative w-full h-64 bg-gray-100 rounded-xl overflow-hidden border-4 border-white shadow-md">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-md animate-in slide-in-from-left-2 duration-300">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                <p className="text-red-700 text-sm font-bold">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-md animate-in slide-in-from-left-2 duration-300">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                <p className="text-green-700 text-sm font-bold">{success}</p>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={!file || uploading}
              className="flex-1 px-8 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all shadow-lg hover:shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed font-black uppercase tracking-wider text-sm active:scale-[0.98]"
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Uploading...
                </span>
              ) : 'Upload Image'}
            </button>

            <button
              type="button"
              onClick={loadImages}
              disabled={loadingImages}
              className="px-6 py-3 bg-white text-gray-700 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-bold text-sm active:scale-[0.98]"
            >
              {loadingImages ? '...' : 'Refresh'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Image Asset Library</h2>
            <p className="text-sm text-gray-500 font-medium">Manage your food photography and menu entries</p>
          </div>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-black uppercase tracking-widest">
            {uploadedImages.length} Assets
          </span>
        </div>

        {uploadedImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gray-50 p-6 rounded-full mb-4">
              <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <p className="text-gray-400 font-bold">Your library is currently empty</p>
            <p className="text-sm text-gray-400">Upload your first food image to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {uploadedImages.map((img) => (
              <div key={img.id} className="group flex flex-col border-2 border-gray-100 rounded-2xl overflow-hidden bg-white hover:border-orange-200 hover:shadow-xl hover:shadow-orange-100/50 transition-all duration-300">

                <div className="relative w-full h-56 bg-gray-50 overflow-hidden">
                  <Image
                    src={img.url}
                    alt={img.filename}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={() => handleDelete(img.id)}
                      className="p-2.5 bg-white/90 backdrop-blur-sm text-red-600 rounded-xl shadow-lg hover:bg-red-600 hover:text-white transition-all duration-200 active:scale-90"
                      title="Delete Image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="mb-4">
                    <p className="font-black text-gray-900 truncate">{img.filename}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {(img.size / 1024).toFixed(1)} KB • {new Date(img.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="mt-auto">
                    {menuForm.imageId === img.id ? (
                      <form onSubmit={handleCreateMenuItem} className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 space-y-4">
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider font-black text-orange-600 mb-1.5">Dish Name</label>
                            <input
                              type="text"
                              placeholder="e.g. Signature Truffle Fries"
                              value={menuForm.name}
                              onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                              className="w-full px-4 py-2.5 text-sm border-2 border-orange-100 rounded-xl text-gray-900 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all placeholder:text-gray-300 font-bold"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider font-black text-orange-600 mb-1.5">Description</label>
                            <textarea
                              placeholder="Describe the flavors, ingredients..."
                              value={menuForm.description}
                              onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                              className="w-full px-4 py-2.5 text-sm border-2 border-orange-100 rounded-xl text-gray-900 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none h-24 resize-none transition-all placeholder:text-gray-300 font-bold"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider font-black text-orange-600 mb-1.5">Price</label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 font-black">₹</span>
                              <input
                                type="number"
                                placeholder="0.00"
                                step="0.01"
                                value={menuForm.price}
                                onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })}
                                className="w-full pl-8 pr-4 py-2.5 text-sm border-2 border-orange-100 rounded-xl text-gray-900 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-black"
                                required
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <button
                              type="submit"
                              className="flex-1 px-4 py-3 bg-orange-600 text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all active:scale-95"
                            >
                              Add Entry
                            </button>
                            <button
                              type="button"
                              onClick={() => setMenuForm({ ...menuForm, imageId: null })}
                              className="px-4 py-3 bg-white text-gray-500 text-xs font-black uppercase tracking-wider rounded-xl border-2 border-gray-100 hover:bg-gray-50 transition-all active:scale-95"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </form>
                    ) : (
                      <button
                        onClick={() => setMenuForm({ ...menuForm, imageId: img.id })}
                        className="w-full py-3.5 bg-orange-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-700 shadow-md hover:shadow-orange-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Menu Item
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
