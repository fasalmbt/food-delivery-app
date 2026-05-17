import { NextRequest, NextResponse } from 'next/server'
import { storeImage, getAllImages } from '@/lib/imageStorage'
import { ApiResponse } from '@/lib/types'

interface ImageMetadata {
  id: string
  url: string
  filename: string
  size: number
  mimeType: string
  uploadedAt: string
}

export async function GET(): Promise<NextResponse<ApiResponse<ImageMetadata[]>>> {
  try {
    const images = getAllImages()
    const response: ApiResponse<ImageMetadata[]> = {
      success: true,
      data: images.map((img) => ({
        id: img.id,
        url: `/api/images/${img.id}`,
        filename: img.filename,
        size: img.size,
        mimeType: img.mimeType,
        uploadedAt: img.uploadedAt,
      })),
    }
    return NextResponse.json(response)
  } catch (error) {
    console.error('Failed to fetch images:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch images' } as ApiResponse<ImageMetadata[]>,
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<ImageMetadata>>> {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: 'No file provided',
        } as ApiResponse<ImageMetadata>,
        { status: 400 }
      )
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        {
          success: false,
          error: 'File must be an image',
        } as ApiResponse<ImageMetadata>,
        { status: 400 }
      )
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: 'File size must be less than 5MB',
        } as ApiResponse<ImageMetadata>,
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')

    const storedImage = storeImage(file.name, base64, file.type, file.size)

    const response: ApiResponse<ImageMetadata> = {
      success: true,
      data: {
        id: storedImage.id,
        url: `/api/images/${storedImage.id}`,
        filename: storedImage.filename,
        size: storedImage.size,
        mimeType: storedImage.mimeType,
        uploadedAt: storedImage.uploadedAt,
      },
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to upload image',
      } as ApiResponse<ImageMetadata>,
      { status: 500 }
    )
  }
}
