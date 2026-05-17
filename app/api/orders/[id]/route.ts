import { NextRequest, NextResponse } from 'next/server'
import { getOrderById, updateOrderStatus } from '@/lib/db'
import { validateData, orderStatusSchema } from '@/lib/validation'
import { ApiResponse, Order, OrderStatus } from '@/lib/types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params
    const order = getOrderById(id)

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: 'Order not found',
        },
        { status: 404 }
      )
    }

    const response: ApiResponse<Order> = {
      success: true,
      data: order,
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch order',
      },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params
    const body = await request.json()

    const { value, error } = validateData(body, orderStatusSchema)

    if (error) {
      const errorMessages = error.details.map((d) => d.message).join(', ')
      return NextResponse.json(
        {
          success: false,
          error: `Validation failed: ${errorMessages}`,
        },
        { status: 400 }
      )
    }

    const updatedOrder = updateOrderStatus(id, value.status as OrderStatus)

    if (!updatedOrder) {
      return NextResponse.json(
        {
          success: false,
          error: 'Order not found',
        },
        { status: 404 }
      )
    }

    const response: ApiResponse<Order> = {
      success: true,
      data: updatedOrder,
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update order',
      },
      { status: 500 }
    )
  }
}
