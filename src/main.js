/* eslint-disable no-use-before-define */
const DISCOUNT_LUCKY = 0.2
const DISCOUNT_BULK = 0.25
const DISCOUNT_SUGGESTION = 0.05
const DISCOUNT_DAY_TUESDAY = 0.1
const TIME_LUCKY_SALE = 30000
const TIME_SUGGESTION = 60000

let productList, productSelect, addBtn, cartDisplay, selectSum, stockInfo
let lastSelectedProduct,
  bonusPoints = 0,
  totalAmount = 0,
  itemCount = 0

function main() {
  // eslint-disable-next-line no-use-before-define
  initializeProducts()
  settingUI()

  calculateCart()

  setLuckySale()
  setSuggestedItem()
}

const initializeProducts = () => {
  productList = [
    { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
    { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
    { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
    { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
    { id: 'p5', name: '상품5', price: 25000, quantity: 10 }
  ]
}

// UI 세팅함수
function settingUI() {
  const root = document.getElementById('app')
  const container = createElement('div', 'bg-gray-100 p-8')
  const wrapper = createElement(
    'div',
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8'
  )
  const headerText = createElement('h1', 'text-2xl font-bold mb-4')
  headerText.textContent = '장바구니'

  cartDisplay = createElement('div', '', 'cart-items')
  selectSum = createElement('div', 'text-xl font-bold my-4', 'cart-total')
  productSelect = createElement('select', 'border rounded p-2 mr-2', 'product-select')
  addBtn = createElement('button', 'bg-blue-500 text-white px-4 py-2 rounded', 'add-to-cart')
  stockInfo = createElement('div', 'text-sm text-gray-500 mt-2', 'stock-status')

  addBtn.textContent = '추가'
  addBtn.addEventListener('click', onClickAddItem)

  wrapper.append(headerText, cartDisplay, selectSum, productSelect, addBtn, stockInfo)
  container.appendChild(wrapper)
  root.appendChild(container)

  updateSelectOptions()
}

const createElement = (tag, className = '', id = '') => {
  const element = document.createElement(tag)
  if (className) element.className = className
  if (id) element.id = id

  return element
}

function updateSelectOptions() {
  productSelect.innerHTML = ''

  productList.forEach(function (item) {
    const option = createElement('option')
    option.value = item.id

    option.textContent = `${item.name} - ${item.price}원`
    if (item.quantity === 0) option.disabled = true
    productSelect.appendChild(option)
  })
}

function calculateCart() {
  totalAmount = 0
  itemCount = 0
  let subtotal = 0
  const cartItems = cartDisplay.children

  Array.from(cartItems).forEach((cartItem) => {
    const productId = cartItem.id
    const product = productList.find((p) => p.id === productId)
    const quantity = parseInt(cartItem.querySelector('span').textContent.split('x ')[1])
    const itemTotal = product.price * quantity
    subtotal += itemTotal
    itemCount += quantity

    totalAmount += applyDiscounts(product, itemTotal, quantity)
  })

  applyBulkDiscount(subtotal)
  applyTuesdayDiscount()

  selectSum.textContent = `총액: ${Math.round(totalAmount)}원`
  renderBonusPoints()
  updateStockInfo()
}

function applyDiscounts(product, itemTotal, quantity) {
  let discount = 0
  if (quantity >= 10) {
    discount = product.id === 'p1' ? 0.1 : product.id === 'p5' ? 0.25 : 0.15
  }
  return itemTotal * (1 - discount)
}

const renderBonusPoints = () => {
  bonusPoints += Math.floor(totalAmount / 1000)
  let pointsTag = document.getElementById('loyalty-points')

  if (!pointsTag) {
    pointsTag = createElement('span', 'text-blue-500 ml-2', 'loyalty-points')
    selectSum.appendChild(pointsTag)
  }

  pointsTag.textContent = `(포인트: ${bonusPoints} )`
}

function updateStockInfo() {
  let infoMessage = ''
  productList.forEach(function (item) {
    if (item.quantity < 5) {
      infoMessage += `${item.name}: ${item.quantity > 0 ? `재고 부족 (${item.quantity}개 남음)` : '품절'}\n`
    }
  })

  stockInfo.textContent = infoMessage
}

function applyBulkDiscount(subtotal) {
  if (itemCount >= 30) {
    const bulkDiscount = subtotal * DISCOUNT_BULK
    if (bulkDiscount > subtotal - totalAmount) {
      totalAmount = subtotal * (1 - DISCOUNT_BULK)
    }
  }
}

function applyTuesdayDiscount() {
  if (new Date().getDay() === 2) {
    totalAmount *= 1 - DISCOUNT_DAY_TUESDAY
  }
}

function onClickAddItem() {
  const selectedItem = productSelect.value
  const product = productList.find((item) => item.id === selectedItem)

  if (product && product.quantity > 0) {
    const existingCartItem = document.getElementById(product.id)

    if (existingCartItem) {
      updateCartItemQuantity(existingCartItem, product, 1)
    } else {
      createNewCartItem(product)
    }

    calculateCart()
    lastSelectedProduct = selectedItem
  } else {
    alert('재고가 부족합니다.')
  }
}

function updateCartItemQuantity(cartItem, product, quantityChange) {
  const quantityElement = cartItem.querySelector('span')
  const currentQuantity = parseInt(quantityElement.textContent.split('x ')[1]) + quantityChange

  if (currentQuantity <= product.quantity && currentQuantity > 0) {
    quantityElement.textContent = `${product.name} - ${product.price}원 x ${currentQuantity}`
    product.quantity -= quantityChange
  } else {
    alert('재고가 부족합니다.')
  }
}

function createNewCartItem(product) {
  const newItem = createElement('div', 'flex justify-between items-center mb-2', product.id)

  newItem.innerHTML = `
    <span>${product.name} - ${product.price}원 x 1</span>
    <div>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" 
      data-change="-1">-</button>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" 
      data-change="1">+</button>
      <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${product.id}">삭제</button>
    </div>`
  cartDisplay.appendChild(newItem)

  product.quantity--
}

main()

cartDisplay.addEventListener('click', function (event) {
  const targetEvent = event.target

  if (
    !targetEvent.classList.contains('quantity-change') &&
    !targetEvent.classList.contains('remove-item')
  ) {
    return
  }

  const productId = targetEvent.dataset.productId
  const itemElem = document.getElementById(productId)
  const product = productList.find((p) => p.id === productId)
  const currentQuantity = parseInt(itemElem.querySelector('span').textContent.split('x ')[1])

  const updateItemQuantity = (newQuantity) => {
    itemElem.querySelector('span').textContent =
      `${itemElem.querySelector('span').textContent.split('x ')[0]}x ${newQuantity}`
  }

  const removeItem = () => {
    const removeQuantity = parseInt(itemElem.querySelector('span').textContent.split('x ')[1])
    product.quantity += removeQuantity
    itemElem.remove()
  }

  if (targetEvent.classList.contains('quantity-change')) {
    const quantityChange = parseInt(targetEvent.dataset.change)
    const newQuantity = currentQuantity + quantityChange

    if (newQuantity > 0 && newQuantity <= product.quantity + currentQuantity) {
      updateItemQuantity(newQuantity)
      product.quantity -= quantityChange
    } else if (newQuantity <= 0) {
      removeItem()
      product.quantity -= quantityChange
    } else {
      alert('재고가 부족합니다.')
    }
  } else if (targetEvent.classList.contains('remove-item')) {
    removeItem()
  }

  calculateCart()
})

function setLuckySale() {
  setTimeout(() => {
    setInterval(() => {
      const luckyItem = productList[Math.floor(Math.random() * productList.length)]

      if (Math.random() < 0.3 && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * (1 - DISCOUNT_LUCKY))
        alert(`번개세일! ${luckyItem.name} 이(가) 20% 할인 중입니다!`)
        updateSelectOptions()
      }
    }, TIME_LUCKY_SALE)
  }, Math.random() * 10000)
}

function setSuggestedItem() {
  setTimeout(() => {
    setInterval(() => {
      if (lastSelectedProduct) {
        const suggestion = productList.find(
          (item) => item.id !== lastSelectedProduct && item.quantity > 0
        )
        if (suggestion) {
          alert(`${suggestion.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`)
          suggestion.price = Math.round(suggestion.price * (1 - DISCOUNT_SUGGESTION))
          updateSelectOptions()
        }
      }
    }, TIME_SUGGESTION)
  }, Math.random() * 20000)
}
