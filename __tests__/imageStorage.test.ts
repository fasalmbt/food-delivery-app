import {
    storeImage,
    getImageById,
    getAllImages,
    deleteImage,
    getImageDataUrl,
    clearAllImages,
} from '@/lib/imageStorage'

describe('Image Storage', () => {
    beforeEach(() => {
        clearAllImages()
    })

    describe('Store and Retrieve Images', () => {
        it('should store an image', () => {
            const base64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAUA'
            const image = storeImage('test.jpg', base64Data, 'image/jpeg', 1024)

            expect(image).toBeDefined()
            expect(image.id).toBeDefined()
            expect(image.filename).toBe('test.jpg')
            expect(image.data).toBe(base64Data)
            expect(image.mimeType).toBe('image/jpeg')
            expect(image.size).toBe(1024)
        })

        it('should retrieve image by ID', () => {
            const base64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAUA'
            const stored = storeImage('food.png', base64Data, 'image/png', 2048)

            const retrieved = getImageById(stored.id)
            expect(retrieved).toBeDefined()
            expect(retrieved?.id).toBe(stored.id)
            expect(retrieved?.filename).toBe('food.png')
        })

        it('should return undefined for non-existent image', () => {
            const image = getImageById('non-existent-id')
            expect(image).toBeUndefined()
        })
    })

    describe('Get All Images', () => {
        it('should return empty array when no images', () => {
            const images = getAllImages()
            expect(images).toEqual([])
        })

        it('should return all stored images', () => {
            storeImage('img1.jpg', 'data1', 'image/jpeg', 1024)
            storeImage('img2.png', 'data2', 'image/png', 2048)
            storeImage('img3.gif', 'data3', 'image/gif', 3072)

            const images = getAllImages()
            expect(images).toHaveLength(3)
            expect(images.map((img) => img.filename)).toEqual(['img1.jpg', 'img2.png', 'img3.gif'])
        })
    })

    describe('Delete Image', () => {
        it('should delete an image', () => {
            const stored = storeImage('delete-me.jpg', 'data', 'image/jpeg', 1024)
            const deleted = deleteImage(stored.id)

            expect(deleted).toBe(true)
            expect(getImageById(stored.id)).toBeUndefined()
        })

        it('should return false when deleting non-existent image', () => {
            const deleted = deleteImage('non-existent-id')
            expect(deleted).toBe(false)
        })
    })

    describe('Data URL Generation', () => {
        it('should generate data URL for image', () => {
            const base64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAUA'
            const stored = storeImage('test.jpg', base64Data, 'image/jpeg', 1024)

            const dataUrl = getImageDataUrl(stored.id)
            expect(dataUrl).toBe(`data:image/jpeg;base64,${base64Data}`)
        })

        it('should return null for non-existent image', () => {
            const dataUrl = getImageDataUrl('non-existent-id')
            expect(dataUrl).toBeNull()
        })
    })

    describe('Clear All Images', () => {
        it('should clear all stored images', () => {
            storeImage('img1.jpg', 'data1', 'image/jpeg', 1024)
            storeImage('img2.png', 'data2', 'image/png', 2048)

            expect(getAllImages()).toHaveLength(2)

            clearAllImages()

            expect(getAllImages()).toHaveLength(0)
        })
    })

    describe('Image Metadata', () => {
        it('should include correct uploadedAt timestamp', () => {
            const before = new Date()
            const image = storeImage('test.jpg', 'data', 'image/jpeg', 1024)
            const after = new Date()

            const uploadedAt = new Date(image.uploadedAt)
            expect(uploadedAt.getTime()).toBeGreaterThanOrEqual(before.getTime())
            expect(uploadedAt.getTime()).toBeLessThanOrEqual(after.getTime())
        })
    })
})
