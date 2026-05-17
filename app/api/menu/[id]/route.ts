import { NextRequest, NextResponse } from 'next/server'
import { deleteMenuItem } from '@/lib/db'
import { ApiResponse } from '@/lib/types'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id: idStr } = await params
    const id = parseInt(idStr)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID' },
        { status: 400 }
      )
    }

    const success = deleteMenuItem(id)

    if (success) {
      const response: ApiResponse<null> = {
        success: true,
      }
      return NextResponse.json(response)
    } else {
      return NextResponse.json(
        { success: false, error: 'Menu item not found' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Failed to delete menu item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete menu item' },
      { status: 500 }
    )
  }
}
