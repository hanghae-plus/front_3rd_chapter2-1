import {
  FLASH_SALE_INTERVAL,
  SUGGESTION_INTERVAL,
  FLASH_SALE_CHANCE,
  POINT_RATE,
  MIN_STOCK,
  DISCOUNT_RATE,
  MESSAGE,
  MIN_FOR_DISCOUNT,
  BULK_LIMIT,
} from '../constants'
import { CartStore } from '../stores'
import { HomePage, CartItem, CustomOption } from '../components/basic'

/**
 * @description 홈렌더링 함수
 * @returns {void}
 */
function renderHome() {
  const root = document.getElementById('app')
  root.innerHTML = HomePage()
}

/**
 * @description 이벤트리스너 설정 함수
 * @returns {void}
 */
function setupEventListeners() {
  document.getElementById('add-to-cart').addEventListener('click', handleAddToCart)
  document.getElementById('cart-items').addEventListener('click', handleCartAction)
}

/**
 * @description 재고정보 업데이트 함수
 * @returns {void}
 */
function updateSelOpts() {
  const itemSelectElement = document.getElementById('product-select')
  itemSelectElement.innerHTML = CartStore.products.map(CustomOption).join('')
}

/**
 * @description 장바구니 계산 함수
 * @returns {void}
 */
function calculateCart() {
  let totalBeforeDiscount = 0
  let itemCount = 0
  const cartElement = document.getElementById('cart-items').children

  CartStore.totalAmount = 0

  Array.from(cartElement).forEach((cart) => {
    const currentItem = CartStore.products.find(({ id }) => id === cart.id)
    const quantity = parseInt(cart.querySelector('span').textContent.split('x ')[1])
    const itemTotal = currentItem.price * quantity
    itemCount += quantity
    totalBeforeDiscount += itemTotal
    CartStore.totalAmount += itemTotal * (1 - getDiscountRate(currentItem.id, quantity))
  })

  const bulkDiscountRate = itemCount >= BULK_LIMIT ? DISCOUNT_RATE.p5 : 0

  if (bulkDiscountRate) {
    CartStore.totalAmount = Math.min(CartStore.totalAmount, totalBeforeDiscount * (1 - bulkDiscountRate))
  }

  const discountRate = (totalBeforeDiscount - CartStore.totalAmount) / totalBeforeDiscount

  updateCartTotal(discountRate)
  updateStockInfo()
  renderPoints()
}

/**
 * @description 할인율 계산 함수
 * @param {string} id - 상품 아이디
 * @param {number} quantity - 상품 수량
 * @returns {number} 할인율
 */
function getDiscountRate(id, quantity) {
  const isTuesday = new Date().getDay() === 2
  if (quantity < MIN_FOR_DISCOUNT) return 0
  if (isTuesday) return DISCOUNT_RATE.p1
  return DISCOUNT_RATE[id] || 0
}

/**
 * @description 장바구니 총액 업데이트 함수
 * @param {number} discountRate - 할인율
 * @returns {void}
 */
function updateCartTotal(discountRate) {
  const isTuesday = new Date().getDay() === 2
  const cartTotalElement = document.getElementById('cart-total')

  cartTotalElement.textContent = `총액: ${Math.round(CartStore.totalAmount)}원`

  if (discountRate || isTuesday) {
    const span = document.createElement('span')
    const isItemOverTen = discountRate >= DISCOUNT_RATE.p1

    span.className = 'text-green-500 ml-2'
    span.textContent = MESSAGE.DISCOUNT(isTuesday || isItemOverTen ? MIN_FOR_DISCOUNT.toFixed(1) : discountRate * 100)

    cartTotalElement.appendChild(span)
  }
}

/**
 * @description 재고정보 업데이트 함수
 * @returns {void}
 */
function updateStockInfo() {
  document.getElementById('stock-status').textContent = CartStore.products
    .filter(({ quantity }) => quantity < MIN_STOCK)
    .map(
      ({ name, quantity }) =>
        `${name}: ${quantity > 0 ? MESSAGE.STOCK_STATUS.LOW(quantity) : MESSAGE.STOCK_STATUS.EMPTY}`,
    )
    .join('\n')
}

/**
 * @description 포인트 렌더링 함수
 * @returns {void}
 */
function renderPoints() {
  CartStore.points += Math.floor(CartStore.totalAmount / POINT_RATE)
  const cartTotalElement = document.getElementById('cart-total')
  let pointTag = document.getElementById('loyalty-points')
  if (!pointTag) {
    pointTag = document.createElement('span')
    pointTag.id = 'loyalty-points'
    pointTag.className = 'text-blue-500 ml-2'
    cartTotalElement.appendChild(pointTag)
  }
  pointTag.textContent = `(포인트: ${CartStore.points})`
}

/**
 * @description 장바구니 추가 함수
 * @returns {void}
 */
function handleAddToCart() {
  const itemSelectElement = document.getElementById('product-select')
  const cartElement = document.getElementById('cart-items')
  const selectedItem = CartStore.products.find(({ id }) => id === itemSelectElement.value)
  if (selectedItem && selectedItem.quantity) {
    const item = document.getElementById(selectedItem.id)
    item ? updateExistingCartItem(item, selectedItem) : handleAddNewCart(cartElement, selectedItem)
    calculateCart()
    CartStore.selectedCartId = selectedItem.id
  }
}

/**
 * @description 기존 장바구니 업데이트 함수
 * @param {HTMLElement} item - 장바구니 아이템
 * @param {object} product - 상품 정보
 * @returns {void}
 */
function updateExistingCartItem(item, product) {
  const newQuantity = parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1
  if (product.quantity) {
    const content = `${product.name} - ${product.price}원 x ${newQuantity}`
    item.querySelector('span').textContent = content
    product.quantity -= 1
  } else {
    alert(MESSAGE.STOCK_STATUS.INSUFFICIENT)
  }
}

/**
 * @description 새로운 장바구니 아이템 추가 함수
 * @param {HTMLElement} cartElement - 장바구니 엘리먼트
 * @param {object} product - 상품 정보
 * @returns {void}
 */
function handleAddNewCart(cartElement, product) {
  const newItem = document.createElement('div')
  newItem.id = product.id
  newItem.className = 'flex justify-between items-center mb-2'
  newItem.innerHTML = CartItem(product)
  cartElement.appendChild(newItem)
  product.quantity--
}

/**
 * @description 장바구니 액션 핸들러 함수
 * @param {Event} event - 이벤트
 * @returns {void}
 */
function handleCartAction({ target }) {
  const { productId, change } = target.dataset
  const cart = document.getElementById(productId)
  const product = CartStore.products.find(({ id }) => id === productId)
  const handler = change ? handleQuantityChange : handleRemoveCart
  handler(cart, product, parseInt(change))
}

/**
 * @description 현재 수량 가져오기 함수
 * @param {HTMLElement} cart - 장바구니 엘리먼트
 * @returns {number} 현재 수량
 */
function getCurrentQuantity(cart) {
  return parseInt(cart.querySelector('span').textContent.split('x ')[1])
}

/**
 * @description 수량 변경 핸들러 함수
 * @param {HTMLElement} cart - 장바구니 엘리먼트
 * @param {object} product - 상품 정보
 * @param {number} change - 변경 수량
 * @returns {void}
 */
function handleQuantityChange(cart, product, change) {
  const currentQuantity = getCurrentQuantity(cart)
  const newQuantity = currentQuantity + change
  const availableStock = product.quantity + currentQuantity

  if (newQuantity && newQuantity <= availableStock) {
    handleUpdateCart(cart, newQuantity)
    product.quantity -= change
    calculateCart()
    return
  }

  if (!newQuantity) {
    handleRemoveCart(cart, product)
    calculateCart()
    return
  }

  alert(MESSAGE.STOCK_STATUS.INSUFFICIENT)
}

/**
 * @description 장바구니 업데이트 함수
 * @param {HTMLElement} cart - 장바구니 엘리먼트
 * @param {number} quantity - 수량
 * @returns {void}
 */
function handleUpdateCart(cart, quantity) {
  const itemText = cart.querySelector('span').textContent.split('x ')[0]
  cart.querySelector('span').textContent = `${itemText}x ${quantity}`
}

/**
 * @description 장바구니 삭제 함수
 * @param {HTMLElement} cart - 장바구니 엘리먼트
 * @param {object} product - 상품 정보
 * @returns {void}
 */
function handleRemoveCart(cart, product) {
  const remQty = parseInt(cart.querySelector('span').textContent.split('x ')[1])
  product.quantity += remQty
  cart.remove()
}

/**
 * @description 프로모션 설정 함수
 * @returns {void}
 */
function handleSetupPromotion() {
  setTimeout(() => {
    setInterval(runFlashSale, FLASH_SALE_INTERVAL)
  }, Math.random() * 10000)

  setTimeout(() => {
    setInterval(runSuggestion, SUGGESTION_INTERVAL)
  }, Math.random() * 20000)
}

/**
 * @description 플래시세일 실행 함수
 * @returns {void}
 */
function runFlashSale() {
  const luckyItem = CartStore.products[Math.floor(Math.random() * CartStore.products.length)]
  if (Math.random() < FLASH_SALE_CHANCE && luckyItem.quantity) {
    luckyItem.price = Math.round(luckyItem.price * 0.8)
    alert(MESSAGE.PROMOTION.FLASH_SALE(luckyItem.name))
    updateSelOpts()
  }
}

/**
 * @description 추천 실행 함수
 * @returns {void}
 */
function runSuggestion() {
  if (CartStore.selectedCartId) {
    const suggest = CartStore.products.find(({ id, quantity }) => id !== CartStore.selectedCartId && quantity)
    if (suggest) {
      alert(MESSAGE.PROMOTION.SUGGESTION(suggest.name))
      suggest.price = Math.round(suggest.price * 0.95)
      updateSelOpts()
    }
  }
}

/**
 * @description 메인 함수
 * @returns {void}
 */
function main() {
  renderHome()
  setupEventListeners()
  updateSelOpts()
  calculateCart()
  handleSetupPromotion()
}

main()
