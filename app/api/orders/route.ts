import { NextRequest, NextResponse } from 'next/server'
import { createOrder } from '@/lib/db'
import { validateData, orderSchema } from '@/lib/validation'
import { ApiResponse, CartItem, Order, OrderStatus } from '@/lib/types'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()

    const { value, error } = validateData(body, orderSchema)

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

    const totalPrice = value.items.reduce(
      (sum: number, item: CartItem) => sum + item.price * item.quantity,
      0
    )

    const order = createOrder({
      items: value.items,
      customerName: value.customerName,
      address: value.address,
      phone: value.phone,
      status: OrderStatus.ORDER_RECEIVED,
      totalPrice,
    })

    const response: ApiResponse<Order> = {
      success: true,
      data: order,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create order',
      },
      { status: 500 }
    )
  }
}
