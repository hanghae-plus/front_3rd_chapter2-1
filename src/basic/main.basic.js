let prodList = [
  { id: 'p1', name: '상품1', val: 10000, q: 50 },
  { id: 'p2', name: '상품2', val: 20000, q: 30 },
  { id: 'p3', name: '상품3', val: 30000, q: 20 },
  { id: 'p4', name: '상품4', val: 15000, q: 0 },
  { id: 'p5', name: '상품5', val: 25000, q: 10 },
]

let sel, addBtn, cartDisp, sum, stockInfo
let lastSel,
  bonusPts = 0,
  totalAmt = 0,
  itemCnt = 0

function main() {
  const root = document.getElementById('app')
  const cont = createDiv('bg-gray-100 p-8')
  const wrap = createDiv(
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
  )
  const hTxt = createElement('h1', 'text-2xl font-bold mb-4', '장바구니')

  setupElements()

  wrap.append(hTxt, cartDisp, sum, sel, addBtn, stockInfo)
  cont.appendChild(wrap)
  root.appendChild(cont)

  initializeCart()
  setupEventListeners()
}

function createElement(tag, className, textContent = '') {
  const elem = document.createElement(tag)
  elem.className = className
  elem.textContent = textContent
  return elem
}

function createDiv(className) {
  return createElement('div', className)
}

function setupElements() {
  cartDisp = createDiv('')
  sum = createDiv('text-xl font-bold my-4')
  sel = createElement('select', 'border rounded p-2 mr-2')
  addBtn = createElement(
    'button',
    'bg-blue-500 text-white px-4 py-2 rounded',
    '추가',
  )
  stockInfo = createDiv('text-sm text-gray-500 mt-2')

  cartDisp.id = 'cart-items'
  sum.id = 'cart-total'
  sel.id = 'product-select'
  addBtn.id = 'add-to-cart'
  stockInfo.id = 'stock-status'

  updateSelOptions()
}

function updateSelOptions() {
  sel.innerHTML = ''
  prodList.forEach(({ id, name, val, q }) => {
    const opt = createElement('option', '', `${name} - ${val}원`)
    opt.value = id
    opt.disabled = q === 0
    sel.appendChild(opt)
  })
}

function initializeCart() {
  calcCart()
}

function setupEventListeners() {
  addBtn.addEventListener('click', handleAddToCart)
  cartDisp.addEventListener('click', handleCartInteraction)
}

function handleAddToCart() {
  const selItem = sel.value
  const itemToAdd = prodList.find((p) => p.id === selItem)
  if (itemToAdd && itemToAdd.q > 0) {
    console.log(itemToAdd)
    let item = document.getElementById(itemToAdd.id)
    if (item) {
      const currentQty = parseInt(
        item.querySelector('span').textContent.split('x ')[1],
      )
      const newQty = currentQty + 1
      if (newQty <= itemToAdd.q) {
        item.querySelector('span').textContent =
          `${itemToAdd.name} - ${itemToAdd.val}원 x ${newQty}`
        itemToAdd.q--
      } else {
        alert('재고가 부족합니다.')
      }
    } else {
      item = document.createElement('div')
      item.id = itemToAdd.id
      item.className = 'flex justify-between items-center mb-2'
      item.innerHTML = `
        <span>${itemToAdd.name} - ${itemToAdd.val}원 x 1</span>
        <div>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="-1">-</button>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="1">+</button>
          <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${itemToAdd.id}">삭제</button>
        </div>`
      cartDisp.appendChild(item)
      itemToAdd.q--
    }
    calcCart()
    updateStockInfo()
    lastSel = selItem
  } else {
    alert('재고가 부족합니다.')
  }
}

function updateCartItemQuantity(item, itemToAdd, change) {
  const newQty =
    parseInt(item.querySelector('span').textContent.split('x ')[1]) + change
  if (newQty <= itemToAdd.q) {
    item.querySelector('span').textContent =
      `${itemToAdd.name} - ${itemToAdd.val}원 x ${newQty}`
    itemToAdd.q -= change
  } else {
    alert('재고가 부족합니다.')
  }
}

function createNewCartItem(itemToAdd) {
  const newItem = createElement('div', 'flex justify-between items-center mb-2')
  newItem.id = itemToAdd.id
  newItem.innerHTML = `
    <span>${itemToAdd.name} - ${itemToAdd.val}원 x 1</span>
    <div>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="-1">-</button>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="1">+</button>
      <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${itemToAdd.id}">삭제</button>
    </div>`
  cartDisp.appendChild(newItem)
  itemToAdd.q--
}

function handleCartInteraction(event) {
  const tgt = event.target

  if (
    tgt.classList.contains('quantity-change') ||
    tgt.classList.contains('remove-item')
  ) {
    const prodId = tgt.dataset.productId
    const itemElem = document.getElementById(prodId)
    const prod = prodList.find((p) => p.id === prodId)
    if (tgt.classList.contains('quantity-change')) {
      const qtyChange = parseInt(tgt.dataset.change)
      const currentQty = parseInt(
        itemElem.querySelector('span').textContent.split('x ')[1],
      )
      const newQty = currentQty + qtyChange
      if (newQty > 0 && newQty <= prod.q + currentQty) {
        itemElem.querySelector('span').textContent =
          `상품 ${prod.name} - ${prod.val}원 x ${newQty}`
        prod.q -= qtyChange
      } else if (newQty <= 0) {
        itemElem.remove()
        prod.q += qtyChange
      } else {
        alert('재고가 부족합니다.')
      }
    } else if (tgt.classList.contains('remove-item')) {
      const remQty = parseInt(
        itemElem.querySelector('span').textContent.split('x ')[1],
      )
      prod.q += remQty
      itemElem.remove()
    }
    calcCart()
    updateStockInfo()
  }
}

function setupDiscountAlerts({
  setTimeoutFn = setTimeout,
  setIntervalFn = setInterval,
  randomFn = Math.random,
} = {}) {
  setTimeoutFn(() => {
    setIntervalFn(() => applyLightningSale(), 30000)
  }, randomFn() * 10000)

  setTimeoutFn(() => {
    setIntervalFn(() => suggestProduct(), 60000)
  }, randomFn() * 20000)
}

function applyLightningSale() {
  const luckyItem = prodList[Math.floor(Math.random() * prodList.length)]
  if (Math.random() < 0.3 && luckyItem.q > 0) {
    luckyItem.val = Math.round(luckyItem.val * 0.8)
    alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`)
    updateSelOptions()
  }
}

function suggestProduct() {
  if (!lastSel) return

  const suggest = prodList.find((item) => item.id !== lastSel && item.q > 0)
  if (suggest) {
    alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`)
    suggest.val = Math.round(suggest.val * 0.95)
    updateSelOptions()
  }
}

function renderSuffix(discountRate) {
  sum.textContent = `총액: ${Math.round(totalAmt)}원`

  if (discountRate > 0) {
    const discountSpan = document.createElement('span')
    discountSpan.className = 'text-green-500 ml-2'
    discountSpan.textContent = `(${(discountRate * 100).toFixed(1)}% 할인 적용)`
    sum.appendChild(discountSpan)
  }
}

function calcCart() {
  totalAmt = 0
  itemCnt = 0
  const cartItems = cartDisp.children
  let subTot = 0

  Array.from(cartItems).forEach((cartItem) => {
    const curItem = prodList.find(({ id }) => id === cartItem.id)
    const q = parseInt(
      cartItem.querySelector('span').textContent.split('x ')[1],
    )
    const itemTot = curItem.val * q
    let disc = 0

    if (q >= 10) {
      if (curItem.id === 'p1') disc = 0.1
      else if (curItem.id === 'p2') disc = 0.15
      else if (curItem.id === 'p3') disc = 0.2
      else if (curItem.id === 'p4') disc = 0.05
      else if (curItem.id === 'p5') disc = 0.25
    }

    itemCnt += q
    subTot += itemTot
    totalAmt += itemTot * (1 - disc)
  })

  const discountRate = (subTot - totalAmt) / subTot
  if (itemCnt >= 30) {
    const bulkDisc = totalAmt * 0.25
    const itemDisc = subTot - totalAmt
    if (bulkDisc > itemDisc) {
      totalAmt = subTot * 0.75
    }
  }

  const dayOfWeek = new Date().getDay()
  if (dayOfWeek === 2) {
    totalAmt *= 0.9 // 10% Tuesday discount
  }

  renderSuffix(discountRate)
  updateStockInfo()
  renderBonusPts()
}

function calculateItemDiscount(curItem, q) {
  let disc = 0
  if (q >= 10) {
    switch (curItem.id) {
      case 'p1':
        disc = 0.1
        break
      case 'p2':
        disc = 0.15
        break
      case 'p3':
        disc = 0.2
        break
      case 'p4':
        disc = 0.05
        break
      case 'p5':
        disc = 0.25
        break
    }
  }
  return disc
}

function applyBulkDiscount(subTot) {
  let discRate = 0
  if (itemCnt >= 30) {
    const bulkDisc = totalAmt * 0.25
    const itemDisc = subTot - totalAmt
    if (bulkDisc > itemDisc) {
      totalAmt = subTot * (1 - 0.25)
      discRate = 0.25
    } else {
      discRate = (subTot - totalAmt) / subToten
    }
  } else {
    discRate = (subTot - totalAmt) / subTot
  }
  renderDiscontRate(discRate)
}

function renderDiscontRate(discRate) {
  sum.textContent = `총액: ${Math.round(totalAmt)}원`
  if (discRate > 0) {
    const span = createElement(
      'span',
      'text-green-500 ml-2',
      `(${(discRate * 100).toFixed(1)}% 할인 적용)`,
    )
    sum.appendChild(span)
  }
}

function updateStockInfo() {
  let infoMsg = ''
  prodList.forEach(({ name, q }) => {
    if (q < 5) {
      infoMsg += `${name}: ${q > 0 ? '재고 부족 (' + q + '개 남음)' : '품절'}\n`
    }
  })
  stockInfo.textContent = infoMsg
}

function renderBonusPts() {
  bonusPts += Math.floor(totalAmt / 1000)
  let ptsTag = document.getElementById('loyalty-points')
  if (!ptsTag) {
    ptsTag = document.createElement('span')
    ptsTag.id = 'loyalty-points'
    ptsTag.className = 'text-blue-500 ml-2'
    sum.appendChild(ptsTag)
  }
  ptsTag.textContent = `(포인트: ${bonusPts})`
}

main()
setupDiscountAlerts()
