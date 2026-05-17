
export interface StoredImage {
  id: string
  filename: string
  data: string
  mimeType: string
  size: number
  uploadedAt: string
}

const imageStorage: Map<string, StoredImage> = new Map()

export function storeImage(
  filename: string,
  data: string,
  mimeType: string,
  size: number
): StoredImage {
  const id = `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  const image: StoredImage = {
    id,
    filename,
    data,
    mimeType,
    size,
    uploadedAt: new Date().toISOString(),
  }

  imageStorage.set(id, image)
  return image
}

export function getImageById(id: string): StoredImage | undefined {
  return imageStorage.get(id)
}

export function getAllImages(): StoredImage[] {
  return Array.from(imageStorage.values())
}

export function deleteImage(id: string): boolean {
  return imageStorage.delete(id)
}

export function getImageDataUrl(id: string): string | null {
  const image = imageStorage.get(id)
  if (!image) return null
  return `data:${image.mimeType};base64,${image.data}`
}

export function clearAllImages(): void {
  imageStorage.clear()
}
