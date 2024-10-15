// Constants
const FLASH_SALE_INTERVAL = 30000
const SUGGESTION_INTERVAL = 60000
const FLASH_SALE_CHANCE = 0.3
const POINT_RATE = 1000
const MIN_STOCK = 5
const DISCOUNT_RATE = { p1: 0.1, p2: 0.15, p3: 0.2, p4: 0.05, p5: 0.25 }

// State management
const createStore = (initialState) => {
  let state = initialState
  const listeners = new Set()

  const getState = () => state

  const setState = (newState) => {
    state = { ...state, ...newState }
    listeners.forEach((listener) => listener(state))
  }

  const subscribe = (listener) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  return { getState, setState, subscribe }
}

const store = createStore({
  products: [
    { id: 'p1', name: '상품1', value: 10000, quantity: 50 },
    { id: 'p2', name: '상품2', value: 20000, quantity: 30 },
    { id: 'p3', name: '상품3', value: 30000, quantity: 20 },
    { id: 'p4', name: '상품4', value: 15000, quantity: 0 },
    { id: 'p5', name: '상품5', value: 25000, quantity: 10 },
  ],
  lastSelectedProduct: null,
  accumulatedPoints: 0,
  totalAmount: 0,
  itemCount: 0,
  cart: {},
})

// UI Components
const renderHTML = () => {
  const root = document.getElementById('app')
  root.innerHTML = `
  <div class="bg-gray-100 p-8">
      <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 class="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items"></div>
        <div id="cart-total" class="text-xl font-bold my-4"></div>
        <select id="product-select" class="border rounded p-2 mr-2"></select>
        <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
        <div id="stock-status" class="text-sm text-gray-500 mt-2"></div>
      </div>
    </div>
  `
}

const updateProductSelect = () => {
  const { products } = store.getState()
  const productSelectElement = document.getElementById('product-select')
  const currentSelectedId = productSelectElement.value

  productSelectElement.innerHTML = products
    .map(
      ({ id, quantity, name, value }) =>
        `<option value="${id}" ${quantity === 0 ? 'disabled' : ''} ${id === currentSelectedId ? 'selected' : ''}>${name} - ${value}원</option>`,
    )
    .join('')
}
const updateCartItems = () => {
  const { cart, products } = store.getState()
  const cartItemsElement = document.getElementById('cart-items')
  cartItemsElement.innerHTML = Object.entries(cart)
    .map(([id, quantity]) => {
      const product = products.find((p) => p.id === id)
      return `
        <div id="${id}" class="flex justify-between items-center mb-2">
          <span>${product.name} - ${product.value}원 x ${quantity}</span>
          <div>
            <button 
              class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
              data-product-id="${id}" 
              data-change="-1"
            >-</button>
            <button 
              class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
              data-product-id="${id}" 
              data-change="1"
            >+</button>
            <button 
              class="remove-item bg-red-500 text-white px-2 py-1 rounded" 
              data-product-id="${id}"
            >삭제</button>
          </div>
        </div>
      `
    })
    .join('')
}

const getDiscountText = () => {
  const { itemCount } = store.getState()
  const today = new Date().getDay()
  if (itemCount >= 10 || today === 2) {
    return ' (10.0% 할인 적용)'
  }
  return ''
}

const updateCartTotal = () => {
  const { totalAmount, bonusPoints } = store.getState()
  const cartTotalElement = document.getElementById('cart-total')
  const discountText = getDiscountText()
  cartTotalElement.innerHTML = `총액: ${Math.round(totalAmount)}원${discountText}<span id="loyalty-points" class="text-blue-500 ml-2">(포인트: ${bonusPoints})</span>`
}

const updateStockStatus = () => {
  const { products } = store.getState()
  const stockStatusElement = document.getElementById('stock-status')
  stockStatusElement.textContent = products
    .filter(({ quantity }) => quantity < MIN_STOCK)
    .map(({ name, quantity }) => `${name}: ${quantity > 0 ? `재고 부족 (${quantity}개 남음)` : '품절'}`)
    .join('\n')
}

const getDiscountRate = (productId, quantity) => {
  if (quantity < 10) return 0
  return DISCOUNT_RATE[productId] || 0
}

const runFlashSale = () => {
  const { products } = store.getState()
  const luckyItem = products[Math.floor(Math.random() * products.length)]
  if (Math.random() < FLASH_SALE_CHANCE && luckyItem.quantity > 0) {
    const updatedProducts = products.map((p) =>
      p.id === luckyItem.id ? { ...p, value: Math.round(p.value * 0.8) } : p,
    )
    store.setState({ products: updatedProducts })
    alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`)
  }
}

const calculateCart = () => {
  const { products, cart, accumulatedPoints } = store.getState()
  let totalAmount = 0
  let itemCount = 0

  Object.entries(cart).forEach(([productId, quantity]) => {
    const product = products.find((p) => p.id === productId)
    const itemTotal = product.value * quantity
    const discountRate = getDiscountRate(productId, quantity)

    totalAmount += itemTotal * (1 - discountRate)
    itemCount += quantity
  })

  // 대량 구매 할인 적용
  const bulkDiscountRate = itemCount >= 10 ? 0.1 : 0
  if (bulkDiscountRate > 0) {
    totalAmount *= 1 - bulkDiscountRate
  }

  // 화요일 할인 적용
  const today = new Date().getDay()
  if (today === 3) {
    // 2 is Tuesday
    totalAmount *= 0.9
  }

  store.setState({ totalAmount, itemCount, bonusPoints: accumulatedPoints })
}

const getPoint = (totalItems) => {
  const { products, accumulatedPoints } = store.getState()
  const productSelectElement = document.getElementById('product-select')
  const selectedProductId = productSelectElement.value
  const selectedProduct = products.find((p) => p.id === selectedProductId)
  const isTuesday = new Date().getDay() === 3
  const discountRate = isTuesday ? 0.1 : getDiscountRate(selectedProductId, totalItems)
  console.log(totalItems)
  console.log(selectedProduct.value / POINT_RATE)
  console.log(discountRate)
  console.log(totalItems * ((selectedProduct.value / POINT_RATE) * (1 - discountRate)))
  return accumulatedPoints + totalItems * ((selectedProduct.value / POINT_RATE) * (1 - discountRate))
}

const handleAddToCart = () => {
  const productSelectElement = document.getElementById('product-select')
  const selectedProductId = productSelectElement.value
  const { products, cart } = store.getState()
  const selectedProduct = products.find((p) => p.id === selectedProductId)

  if (!selectedProduct || selectedProduct.quantity <= 0) {
    alert('재고가 부족합니다.')
    return
  }

  const updatedCart = { ...cart }
  const newQuantity = (updatedCart[selectedProductId] || 0) + 1
  updatedCart[selectedProductId] = newQuantity
  const updatedProducts = products.map((p) => (p.id === selectedProductId ? { ...p, quantity: p.quantity - 1 } : p))

  // 전체 아이템 수 계산
  const totalItems = Object.values(updatedCart).reduce((sum, quantity) => sum + quantity, 0)

  const newPoints = getPoint(totalItems)

  store.setState({
    products: updatedProducts,
    cart: updatedCart,
    lastSelectedProduct: selectedProductId,
    accumulatedPoints: newPoints,
  })

  calculateCart()
  updateProductSelect() // 상품 목록 업데이트
}

const handleQuantityChange = (productId, change) => {
  const productSelectElement = document.getElementById('product-select')
  const selectedProductId = productSelectElement.value
  const { products, cart } = store.getState()
  const updatedCart = { ...cart }
  const updatedProducts = [...products]
  const product = updatedProducts.find((p) => p.id === productId)

  if ((change > 0 && product.quantity > 0) || (change < 0 && updatedCart[productId] > 0)) {
    updatedCart[productId] = (updatedCart[productId] || 0) + change
    product.quantity -= change

    const totalItems = Object.values(updatedCart).reduce((sum, quantity) => sum + quantity, 0)

    const newPoints = getPoint(totalItems)
    if (updatedCart[productId] === 0) {
      delete updatedCart[productId]
    }

    store.setState({
      products: updatedProducts,
      cart: updatedCart,
      accumulatedPoints: newPoints,
    })
    calculateCart()
  } else {
    alert('재고가 부족합니다.')
  }
}

const handleRemoveFromCart = (productId) => {
  const { products, cart, accumulatedPoints } = store.getState()
  const updatedCart = { ...cart }
  const updatedProducts = products.map((p) =>
    p.id === productId ? { ...p, quantity: p.quantity + (cart[productId] || 0) } : p,
  )

  delete updatedCart[productId]

  // 포인트는 그대로 유지
  store.setState({
    products: updatedProducts,
    cart: updatedCart,
    accumulatedPoints: accumulatedPoints, // 포인트 유지
  })
  calculateCart()
}

const handleCartAction = (event) => {
  const { productId, change } = event.target.dataset
  if (change) {
    handleQuantityChange(productId, parseInt(change))
  } else if (event.target.classList.contains('remove-item')) {
    handleRemoveFromCart(productId)
  }
}

const runSuggestion = () => {
  const { products, lastSelectedProduct } = store.getState()
  if (lastSelectedProduct) {
    const suggest = products.find((item) => item.id !== lastSelectedProduct && item.quantity > 0)
    if (suggest) {
      const updatedProducts = products.map((p) =>
        p.id === suggest.id ? { ...p, value: Math.round(p.value * 0.95) } : p,
      )
      store.setState({ products: updatedProducts })
      alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`)
    }
  }
}

// Promotions
const setupPromotions = () => {
  setTimeout(() => {
    setInterval(runFlashSale, FLASH_SALE_INTERVAL)
  }, Math.random() * 10000)

  setTimeout(() => {
    setInterval(runSuggestion, SUGGESTION_INTERVAL)
  }, Math.random() * 20000)
}

const setupEventListeners = () => {
  document.getElementById('add-to-cart').addEventListener('click', handleAddToCart)
  document.getElementById('cart-items').addEventListener('click', handleCartAction)
}

// Main
const main = () => {
  renderHTML()
  setupEventListeners()
  store.subscribe(() => {
    updateProductSelect()
    updateCartItems()
    updateCartTotal()
    updateStockStatus()
  })
  updateProductSelect() // 초기 상태 렌더링
  updateStockStatus() // 초기 재고 상태 표시
  setupPromotions()
}

main()
