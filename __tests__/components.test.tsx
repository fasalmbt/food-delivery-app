import { render, screen, fireEvent } from '@testing-library/react'
import Menu from '../app/components/Menu'
import Cart from '../app/components/Cart'
import '@testing-library/jest-dom'

const mockItems = [
  { id: 1, name: 'Pizza', description: 'Cheesy', price: 10, image: '/p.jpg' },
  { id: 2, name: 'Burger', description: 'Juicy', price: 5, image: '/b.jpg' }
]

const mockCartItems = [
  { id: 1, name: 'Pizza', price: 10, quantity: 2 }
]

describe('UI Components', () => {
  describe('Menu Component', () => {
    test('renders menu items correctly', () => {
      render(<Menu items={mockItems} onAddToCart={jest.fn()} />)
      expect(screen.getByText('Pizza')).toBeInTheDocument()
      expect(screen.getByText('Burger')).toBeInTheDocument()
      expect(screen.getByText('Cheesy')).toBeInTheDocument()
    })

    test('calls onAddToCart when button is clicked', () => {
      const onAddToCart = jest.fn()
      render(<Menu items={mockItems} onAddToCart={onAddToCart} />)
      const buttons = screen.getAllByText('Add to Cart')
      fireEvent.click(buttons[0])
      expect(onAddToCart).toHaveBeenCalledWith(mockItems[0])
    })
  })

  describe('Cart Component', () => {
    test('renders cart items and total', () => {
      render(
        <Cart
          items={mockCartItems}
          onUpdateQuantity={jest.fn()}
          onRemoveItem={jest.fn()}
          onCheckout={jest.fn()}
        />
      )
      expect(screen.getByText('Pizza')).toBeInTheDocument()
      const priceElements = screen.getAllByText('₹20.00')
      expect(priceElements.length).toBeGreaterThanOrEqual(1)
    })

    test('shows empty message when cart is empty', () => {
      render(
        <Cart
          items={[]}
          onUpdateQuantity={jest.fn()}
          onRemoveItem={jest.fn()}
          onCheckout={jest.fn()}
        />
      )
      expect(screen.getByText(/cart is empty/i)).toBeInTheDocument()
    })
  })
})
