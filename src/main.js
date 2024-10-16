/* eslint-disable no-use-before-define */
let productList, productSelect, addBtn, cartDisplay, selectSum, stockInfo
let lastSel,
  bonusPoints = 0,
  totalAmount = 0,
  itemCount = 0

function main() {
  // eslint-disable-next-line no-use-before-define
  initializeProducts()
  settingUI()

  calculateCart()

  setTimeout(function () {
    setInterval(function () {
      const luckyItem = productList[Math.floor(Math.random() * productList.length)]

      if (Math.random() < 0.3 && luckyItem.q > 0) {
        luckyItem.val = Math.round(luckyItem.val * 0.8)
        alert(`번개세일!  ${luckyItem.name} 이(가) 20% 할인 중입니다!`)
        updateSelOpts()
      }
    }, 30000)
  }, Math.random() * 10000)

  setTimeout(function () {
    setInterval(function () {
      if (lastSel) {
        const suggest = productList.find(function (item) {
          return item.id !== lastSel && item.q > 0
        })
        if (suggest) {
          alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`)
          suggest.val = Math.round(suggest.val * 0.95)
          updateSelOpts()
        }
      }
    }, 60000)
  }, Math.random() * 20000)
}

const initializeProducts = () => {
  productList = [
    { id: 'p1', name: '상품1', val: 10000, q: 50 },
    { id: 'p2', name: '상품2', val: 20000, q: 30 },
    { id: 'p3', name: '상품3', val: 30000, q: 20 },
    { id: 'p4', name: '상품4', val: 15000, q: 0 },
    { id: 'p5', name: '상품5', val: 25000, q: 10 }
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

    option.textContent = `${item.name} - ${item.val}원`
    if (item.quantity === 0) option.disabled = true
    productSelect.appendChild(option)
  })
}

function calculateCart() {
  totalAmount = 0
  itemCount = 0
  const cartItems = cartDisplay.children
  let subTotal = 0

  for (let i = 0; i < cartItems.length; i++) {
    ;(function () {
      let curItem

      for (let j = 0; j < productList.length; j++) {
        if (productList[j].id === cartItems[i].id) {
          curItem = productList[j]
          break
        }
      }

      const quantity = parseInt(cartItems[i].querySelector('span').textContent.split('x ')[1])

      const itemTotal = curItem.val * quantity
      let disc = 0
      itemCount += quantity
      subTotal += itemTotal

      if (quantity >= 10) {
        if (curItem.id === 'p1') disc = 0.1
        else if (curItem.id === 'p2') disc = 0.15
        else if (curItem.id === 'p3') disc = 0.2
        else if (curItem.id === 'p4') disc = 0.05
        else if (curItem.id === 'p5') disc = 0.25
      }

      totalAmount += itemTotal * (1 - disc)
    })()
  }

  let discRate = 0
  if (itemCount >= 30) {
    const bulkDisc = totalAmount * 0.25
    const itemDisc = subTotal - totalAmount

    if (bulkDisc > itemDisc) {
      totalAmount = subTotal * (1 - 0.25)
      discRate = 0.25
    } else {
      discRate = (subTotal - totalAmount) / subTotal
    }
  } else {
    discRate = (subTotal - totalAmount) / subTotal
  }

  if (new Date().getDay() === 2) {
    totalAmount *= 1 - 0.1
    discRate = Math.max(discRate, 0.1)
  }

  selectSum.textContent = `총액:${Math.round(totalAmount)}원`

  if (discRate > 0) {
    const span = document.createElement('span')
    span.className = 'text-green-500 ml-2'
    span.textContent = `(${(discRate * 100).toFixed(1)}% 할인 적용)`
    selectSum.appendChild(span)
  }

  updateStockInfo()
  renderbonusPoints()
}

const renderbonusPoints = () => {
  bonusPoints += Math.floor(totalAmount / 1000)
  let pointsTag = document.getElementById('loyalty-points')

  if (!pointsTag) {
    pointsTag = document.createElement('span')
    pointsTag.id = 'loyalty-points'
    pointsTag.className = 'text-blue-500 ml-2'
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

main()

addBtn.addEventListener('click', function () {
  const selItem = productSelect.value

  const itemToAdd = productList.find(function (p) {
    return p.id === selItem
  })

  if (itemToAdd && itemToAdd.q > 0) {
    const item = document.getElementById(itemToAdd.id)

    if (item) {
      const newQuantity = parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1

      if (newQuantity <= itemToAdd.q) {
        item.querySelector('span').textContent =
          itemToAdd.name + ' - ' + itemToAdd.val + '원 x ' + newQuantity
        itemToAdd.q--
      } else {
        alert('재고가 부족합니다.')
      }
    } else {
      const newItem = document.createElement('div')
      newItem.id = itemToAdd.id
      newItem.className = 'flex justify-between items-center mb-2'
      newItem.innerHTML =
        '<span>' +
        itemToAdd.name +
        ' - ' +
        itemToAdd.val +
        '원 x 1</span><div>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="-1">-</button>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="1">+</button>' +
        '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
        itemToAdd.id +
        '">삭제</button></div>'
      cartDisplay.appendChild(newItem)
      itemToAdd.q--
    }
    calculateCart()
    lastSel = selItem
  }
})

cartDisplay.addEventListener('click', function (event) {
  const targetEvent = event.target

  if (
    targetEvent.classList.contains('quantity-change') ||
    targetEvent.classList.contains('remove-item')
  ) {
    const productId = targetEvent.dataset.productId
    const itemElem = document.getElementById(productId)
    const product = productList.find(function (p) {
      return p.id === productId
    })

    if (targetEvent.classList.contains('quantity-change')) {
      const quantityChange = parseInt(targetEvent.dataset.change)
      const newQuantity =
        parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) + quantityChange
      if (
        newQuantity > 0 &&
        newQuantity <=
          product.q + parseInt(itemElem.querySelector('span').textContent.split('x ')[1])
      ) {
        itemElem.querySelector('span').textContent =
          itemElem.querySelector('span').textContent.split('x ')[0] + 'x ' + newQuantity
        product.q -= quantityChange
      } else if (newQuantity <= 0) {
        itemElem.remove()
        product.q -= quantityChange
      } else {
        alert('재고가 부족합니다.')
      }
    } else if (targetEvent.classList.contains('remove-item')) {
      const remQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1])
      product.q += remQty
      itemElem.remove()
    }
    calcCart()
  }
})
