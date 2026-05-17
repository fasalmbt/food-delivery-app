import { NextRequest, NextResponse } from 'next/server'
import { getMenuItems, addMenuItem } from '@/lib/db'
import { ApiResponse, MenuItem } from '@/lib/types'

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const items = getMenuItems()
    const response: ApiResponse<MenuItem[]> = {
      success: true,
      data: items,
    }
    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch menu items',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { name, description, price, image } = body

    if (!name || !description || !price || !image) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const newItem = addMenuItem({
      name,
      description,
      price: Number(price),
      image,
    })

    const response: ApiResponse<MenuItem> = {
      success: true,
      data: newItem,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Failed to create menu item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create menu item' },
      { status: 500 }
    )
  }
}
