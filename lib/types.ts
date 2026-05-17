
export interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  image: string
}

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

export enum OrderStatus {
  ORDER_RECEIVED = 'Order Received',
  PREPARING = 'Preparing',
  OUT_FOR_DELIVERY = 'Out for Delivery',
  DELIVERED = 'Delivered',
}

export interface Order {
  id: string
  items: CartItem[]
  customerName: string
  address: string
  phone: string
  status: OrderStatus
  totalPrice: number
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
