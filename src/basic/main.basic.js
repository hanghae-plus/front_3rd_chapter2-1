const FLASH_SALE_INTERVAL = 30000
const SUGGESTION_INTERVAL = 60000
const FLASH_SALE_CHANCE = 0.3
const POINT_RATE = 1000

let products,
  lastSel,
  bonusPoint = 0,
  totalAmount = 0,
  itemCount = 0

function getHTMLTemplate() {
  return `
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

function main() {
  initializeProducts()
  renderHTML()
  setupEventListeners()
  updateSelOpts()
  calcCart()
  setupPromotions()
}

function initializeProducts() {
  products = [
    { id: 'p1', name: '상품1', value: 10000, quantity: 50 },
    { id: 'p2', name: '상품2', value: 20000, quantity: 30 },
    { id: 'p3', name: '상품3', value: 30000, quantity: 20 },
    { id: 'p4', name: '상품4', value: 15000, quantity: 0 },
    { id: 'p5', name: '상품5', value: 25000, quantity: 10 },
  ]
}

function renderHTML() {
  const root = document.getElementById('app')
  root.innerHTML = getHTMLTemplate()
}

function setupEventListeners() {
  document.getElementById('add-to-cart').addEventListener('click', handleAddToCart)
  document.getElementById('cart-items').addEventListener('click', handleCartAction)
}

function updateSelOpts() {
  const productSelectElement = document.getElementById('product-select')
  productSelectElement.innerHTML = products
    .map(
      (item) =>
        `<option value="${item.id}" ${item.quantity === 0 ? 'disabled' : ''}>${item.name} - ${item.value}원</option>`,
    )
    .join('')
}

function calcCart() {
  const cartItems = document.getElementById('cart-items').children
  let subTotal = 0
  totalAmount = 0
  itemCount = 0

  Array.from(cartItems).forEach((cart) => {
    const currentItem = products.find((product) => product.id === cart.id)
    const quantity = parseInt(cart.querySelector('span').textContent.split('x ')[1])
    const itemTotal = currentItem.value * quantity
    itemCount += quantity
    subTotal += itemTotal
    totalAmount += itemTotal * (1 - getDiscountRate(currentItem.id, quantity))
  })

  // 대량 구매 할인 적용
  const bulkDiscountRate = itemCount >= 30 ? 0.25 : 0
  if (bulkDiscountRate > 0) {
    totalAmount = Math.min(totalAmount, subTotal * (1 - bulkDiscountRate))
  }

  // 최종 할인율 계산
  const finalDiscountRate = (subTotal - totalAmount) / subTotal

  updateCartTotal(finalDiscountRate)
  updateStockInfo()
  renderBonusPts()
}

function getDiscountRate(productId, quantity) {
  if (quantity < 10) return 0
  const discountRates = { p1: 0.1, p2: 0.15, p3: 0.2, p4: 0.05, p5: 0.25 }
  return discountRates[productId] || 0
}

function updateCartTotal(discountRate) {
  const today = new Date().getDay()
  const isTuesday = today === 2
  const cartTotalElement = document.getElementById('cart-total')

  cartTotalElement.textContent = `총액: ${Math.round(totalAmount)}원`

  if (discountRate > 0 || isTuesday) {
    const span = document.createElement('span')
    span.className = 'text-green-500 ml-2'

    if (isTuesday || discountRate >= 0.1) {
      span.textContent = '(10.0% 할인 적용)'
    } else {
      span.textContent = `(${(discountRate * 100).toFixed(1)}% 할인 적용)`
    }

    cartTotalElement.appendChild(span)
  }
}

function updateStockInfo() {
  const stockStatusElement = document.getElementById('stock-status')
  stockStatusElement.textContent = products
    .filter((item) => item.quantity < 5)
    .map((item) => `${item.name}: ${item.quantity > 0 ? `재고 부족 (${item.quantity}개 남음)` : '품절'}`)
    .join('\n')
}

function renderBonusPts() {
  bonusPoint += Math.floor(totalAmount / POINT_RATE)
  const cartTotalElement = document.getElementById('cart-total')
  let pointTag = document.getElementById('loyalty-points')
  if (!pointTag) {
    pointTag = document.createElement('span')
    pointTag.id = 'loyalty-points'
    pointTag.className = 'text-blue-500 ml-2'
    cartTotalElement.appendChild(pointTag)
  }
  pointTag.textContent = `(포인트: ${bonusPoint})`
}

function handleAddToCart() {
  const productSelectElement = document.getElementById('product-select')
  const cartItems = document.getElementById('cart-items')
  const selItem = productSelectElement.value
  const itemToAdd = products.find((p) => p.id === selItem)
  if (itemToAdd && itemToAdd.quantity > 0) {
    const item = document.getElementById(itemToAdd.id)
    if (item) {
      updateExistingCartItem(item, itemToAdd)
    } else {
      addNewCartItem(cartItems, itemToAdd)
    }
    calcCart()
    lastSel = selItem
  }
}

function updateExistingCartItem(item, product) {
  const newQuantity = parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1
  if (product.quantity > 0) {
    item.querySelector('span').textContent = `${product.name} - ${product.value}원 x ${newQuantity}`
    product.quantity--
  } else {
    alert('재고가 부족합니다.')
  }
}

function addNewCartItem(cartItems, product) {
  const newItem = document.createElement('div')
  newItem.id = product.id
  newItem.className = 'flex justify-between items-center mb-2'
  newItem.innerHTML = `
    <span>${product.name} - ${product.value}원 x 1</span>
    <div>
      <button 
        class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
        data-product-id="${product.id}" 
        data-change="-1"
      >
        -
      </button>
      <button 
        class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
        data-product-id="${product.id}" 
        data-change="1"
      >
        +
      </button>
      <button 
        class="remove-item bg-red-500 text-white px-2 py-1 rounded" 
        data-product-id="${product.id}"
      >
        삭제
      </button>
    </div>
  `
  cartItems.appendChild(newItem)
  product.quantity--
}

function handleCartAction(event) {
  const target = event.target
  if (target.classList.contains('quantity-change') || target.classList.contains('remove-item')) {
    const prodId = target.dataset.productId
    const itemElem = document.getElementById(prodId)
    const prod = products.find((p) => p.id === prodId)
    if (target.classList.contains('quantity-change')) {
      handleQuantityChange(itemElem, prod, parseInt(target.dataset.change))
    } else if (target.classList.contains('remove-item')) {
      handleRemoveItem(itemElem, prod)
    }
    calcCart()
  }
}

function handleQuantityChange(itemElem, product, change) {
  const newQuantity = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) + change
  if (
    newQuantity > 0 &&
    newQuantity <= product.quantity + parseInt(itemElem.querySelector('span').textContent.split('x ')[1])
  ) {
    itemElem.querySelector('span').textContent =
      `${itemElem.querySelector('span').textContent.split('x ')[0]}x ${newQuantity}`
    product.quantity -= change
  } else if (newQuantity <= 0) {
    itemElem.remove()
    product.quantity -= change
  } else {
    alert('재고가 부족합니다.')
  }
}

function handleRemoveItem(itemElem, product) {
  const remQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1])
  product.quantity += remQty
  itemElem.remove()
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
  const luckyItem = products[Math.floor(Math.random() * products.length)]
  if (Math.random() < FLASH_SALE_CHANCE && luckyItem.quantity > 0) {
    luckyItem.value = Math.round(luckyItem.value * 0.8)
    alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`)
    updateSelOpts()
  }
}

function runSuggestion() {
  if (lastSel) {
    const suggest = products.find((item) => item.id !== lastSel && item.quantity > 0)
    if (suggest) {
      alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`)
      suggest.value = Math.round(suggest.value * 0.95)
      updateSelOpts()
    }
  }
}

main()
