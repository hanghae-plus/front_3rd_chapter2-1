import { describe } from 'vitest'
import { vi } from 'vitest'
import { useCart } from '../hooks/useCart'
import { useProducts } from '../hooks/useProducts'
import Cart from '../component/Cart'

vi.mock('./useCart', () => ({
  useCart: vi.fn(),
}))

vi.mock('./useProducts', () => ({
  __esModule: true,
  default: vi.fn(),
}))

describe('advanced React Test', () => {
  describe.each([
    { type: 'origin', Component: Cart },
    { type: 'advanced', Component: Cart },
  ])('$type 장바구니 시나리오 테스트', ({ Component }) => {
    let mockUseCart, mockUseProducts

    beforeAll(() => {
      mockUseCart = {
        cartItem: [],
        addCart: fn(),
        updateCart: vi.fn(),
        removeCart: vi.fn(),
        cartTotal: 0,
        discountRate: 0,
        bonusPts: 0,
      }
      mockUseProducts = {
        products: [
          { id: 'p1', name: '상품1', price: 10000, stock: 50 },
          { id: 'p2', name: '상품2', price: 20000, stock: 30 },
          { id: 'p3', name: '상품3', price: 30000, stock: 20 },
          { id: 'p4', name: '상품4', price: 15000, stock: 0 },
          { id: 'p5', name: '상품5', price: 25000, stock: 10 },
        ],
        updateProductStock: vi.fn(),
      }
      useCart.mockReturnValue(mockUseCart)
      useProducts.mockReturnValue(mockUseProducts)
    })
    beforeEach(() => {
      vi.useFakeTimers()
      vi.spyOn(window, 'alert').mockImplementation(() => {})
    })
    afterEach(() => {
      vi.restoreAllMocks()
    })
    it('초기 상태: 상품 목록이 올바르게 그려졌는지 확인', () => {
      render(
        <ProductSelect
          products={mockUseProducts.products}
          onAddToCart={mockUseCart.addToCart}
        />,
      )
      const select = screen.getByRole('combobox')
      expect(select).toBeDefined()
      expect(select.children.length).toBe(5)

      // 첫 번째 상품 확인
      expect(select.children[0].value).toBe('p1')
      expect(select.children[0].textContent).toBe('상품1 - 10000원')
      expect(select.children[0].disabled).toBe(false)

      // 마지막 상품 확인
      expect(select.children[4].value).toBe('p5')
      expect(select.children[4].textContent).toBe('상품5 - 25000원')
      expect(select.children[4].disabled).toBe(false)

      // 재고 없는 상품 확인 (상품4)
      expect(select.children[3].value).toBe('p4')
      expect(select.children[3].textContent).toBe('상품4 - 15000원')
      expect(select.children[3].disabled).toBe(true)
    })
  })
})
