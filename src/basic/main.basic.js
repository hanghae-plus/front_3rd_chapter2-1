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
import { state } from '../stores'
import { HomePage, CartItem, CustomOption } from '../components/basic'

function renderHome() {
  const root = document.getElementById('app')
  root.innerHTML = HomePage()
}

function setupEventListeners() {
  document.getElementById('add-to-cart').addEventListener('click', handleAddToCart)
  document.getElementById('cart-items').addEventListener('click', handleCartAction)
}

function updateSelOpts() {
  const itemSelectElement = document.getElementById('product-select')
  itemSelectElement.innerHTML = state.products.map(CustomOption).join('')
}

function calculateCart() {
  let totalBeforeDiscount = 0
  const cartElement = document.getElementById('cart-items').children

  state.totalAmount = 0
  state.itemCount = 0

  Array.from(cartElement).forEach((cart) => {
    const currentItem = state.products.find(({ id }) => id === cart.id)
    const quantity = parseInt(cart.querySelector('span').textContent.split('x ')[1])
    const itemTotal = currentItem.value * quantity
    state.itemCount += quantity
    totalBeforeDiscount += itemTotal
    state.totalAmount += itemTotal * (1 - getDiscountRate(currentItem.id, quantity))
  })

  const bulkDiscountRate = state.itemCount >= BULK_LIMIT ? DISCOUNT_RATE.p5 : 0

  if (bulkDiscountRate) {
    state.totalAmount = Math.min(state.totalAmount, totalBeforeDiscount * (1 - bulkDiscountRate))
  }

  const finalDiscountRate = (totalBeforeDiscount - state.totalAmount) / totalBeforeDiscount

  updateCartTotal(finalDiscountRate)
  updateStockInfo()
  renderBonusPoints()
}

function getDiscountRate(productId, quantity) {
  const isTuesday = new Date().getDay() === 2
  if (quantity < MIN_FOR_DISCOUNT) return 0
  if (isTuesday) return DISCOUNT_RATE.p1
  return DISCOUNT_RATE[productId] || 0
}

function updateCartTotal(discountRate) {
  const isTuesday = new Date().getDay() === 2
  const cartTotalElement = document.getElementById('cart-total')

  cartTotalElement.textContent = `총액: ${Math.round(state.totalAmount)}원`

  if (discountRate || isTuesday) {
    const span = document.createElement('span')
    const isItemOverTen = discountRate >= DISCOUNT_RATE.p1

    span.className = 'text-green-500 ml-2'
    span.textContent = MESSAGE.DISCOUNT(isTuesday || isItemOverTen ? MIN_FOR_DISCOUNT.toFixed(1) : discountRate * 100)

    cartTotalElement.appendChild(span)
  }
}

function updateStockInfo() {
  document.getElementById('stock-status').textContent = state.products
    .filter(({ quantity }) => quantity < MIN_STOCK)
    .map(
      ({ name, quantity }) =>
        `${name}: ${quantity > 0 ? MESSAGE.STOCK_STATUS.LOW(quantity) : MESSAGE.STOCK_STATUS.EMPTY}`,
    )
    .join('\n')
}

function renderBonusPoints() {
  state.bonusPoints += Math.floor(state.totalAmount / POINT_RATE)
  const cartTotalElement = document.getElementById('cart-total')
  let pointTag = document.getElementById('loyalty-points')
  if (!pointTag) {
    pointTag = document.createElement('span')
    pointTag.id = 'loyalty-points'
    pointTag.className = 'text-blue-500 ml-2'
    cartTotalElement.appendChild(pointTag)
  }
  pointTag.textContent = `(포인트: ${state.bonusPoints})`
}

function handleAddToCart() {
  const itemSelectElement = document.getElementById('product-select')
  const cartElement = document.getElementById('cart-items')
  const selectedItem = state.products.find(({ id }) => id === itemSelectElement.value)
  if (selectedItem && selectedItem.quantity) {
    const item = document.getElementById(selectedItem.id)
    item ? updateExistingCartItem(item, selectedItem) : addNewCartItem(cartElement, selectedItem)
    calculateCart()
    state.lastSelectedItemId = selectedItem.id
  }
}

function updateExistingCartItem(item, product) {
  const newQuantity = parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1
  if (product.quantity) {
    const content = `${product.name} - ${product.value}원 x ${newQuantity}`
    item.querySelector('span').textContent = content
    product.quantity -= 1
  } else {
    alert(MESSAGE.STOCK_STATUS.INSUFFICIENT)
  }
}

function addNewCartItem(cartElement, product) {
  const newItem = document.createElement('div')
  newItem.id = product.id
  newItem.className = 'flex justify-between items-center mb-2'
  newItem.innerHTML = CartItem(product)
  cartElement.appendChild(newItem)
  product.quantity--
}

function handleCartAction({ target }) {
  const { productId, change } = target.dataset
  const cart = document.getElementById(productId)
  const product = state.products.find(({ id }) => id === productId)
  const handler = change ? handleQuantityChange : handleRemoveCart
  handler(cart, product, parseInt(change))
}

function getCurrentQuantity(cart) {
  return parseInt(cart.querySelector('span').textContent.split('x ')[1])
}

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

function handleUpdateCart(cart, quantity) {
  const itemText = cart.querySelector('span').textContent.split('x ')[0]
  cart.querySelector('span').textContent = `${itemText}x ${quantity}`
}

function handleRemoveCart(cart, product) {
  const remQty = parseInt(cart.querySelector('span').textContent.split('x ')[1])
  product.quantity += remQty
  cart.remove()
}

function setupPromotions() {
  setTimeout(() => {
    setInterval(runFlashSale, FLASH_SALE_INTERVAL)
  }, Math.random() * 10000)

  setTimeout(() => {
    setInterval(runSuggestion, SUGGESTION_INTERVAL)
  }, Math.random() * 20000)
}

function runFlashSale() {
  const luckyItem = state.products[Math.floor(Math.random() * state.products.length)]
  if (Math.random() < FLASH_SALE_CHANCE && luckyItem.quantity) {
    luckyItem.value = Math.round(luckyItem.value * 0.8)
    alert(MESSAGE.PROMOTION.FLASH_SALE(luckyItem.name))
    updateSelOpts()
  }
}

function runSuggestion() {
  if (state.lastSelectedItemId) {
    const suggest = state.products.find(({ id, quantity }) => id !== state.lastSelectedItemId && quantity)
    if (suggest) {
      alert(MESSAGE.PROMOTION.SUGGESTION(suggest.name))
      suggest.value = Math.round(suggest.value * 0.95)
      updateSelOpts()
    }
  }
}

function main() {
  renderHome()
  setupEventListeners()
  updateSelOpts()
  calculateCart()
  setupPromotions()
}

main()
