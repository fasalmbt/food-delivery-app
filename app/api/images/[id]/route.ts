import { NextRequest, NextResponse } from 'next/server'
import { getImageById } from '@/lib/imageStorage'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params
    const image = getImageById(id)

    if (!image) {
      return NextResponse.json(
        {
          success: false,
          error: 'Image not found',
        },
        { status: 404 }
      )
    }

    const buffer = Buffer.from(image.data, 'base64')

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': image.mimeType,
        'Content-Length': image.size.toString(),
        'Cache-Control': 'public, max-age=31536000',
      },
    })
  } catch (error) {
    console.error('Image fetch error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch image',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params
    const { deleteImage } = await import('@/lib/imageStorage')

    const deleted = deleteImage(id)

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: 'Image not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { message: 'Image deleted successfully' },
    })
  } catch (error) {
    console.error('Image deletion error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete image',
      },
      { status: 500 }
    )
  }
}
