import { prodList, updateProductStock } from './productList.js'
import {
  cartDisp,
  renderBonusPts,
  renderCartDetails,
  updateStockInfo,
} from './ui.js'
import { sel } from './ui.js'

let bonusPts = 0

export function initializeCart() {
  const cartState = calcCart()
  renderCartDetails(cartState)
  updateStockInfo(prodList)
  renderBonusPts(bonusPts)
}

function calcItemTotals(cartItem) {
  const curItem = prodList.find(({ id }) => id === cartItem.id)
  if (!curItem) return null

  const curStock = parseInt(
    cartItem.querySelector('span').textContent.split('x ')[1],
  )

  if (isNaN(curStock)) return null

  const itemTot = curItem.price * curStock

  if (isNaN(itemTot)) return null

  const disc = calcItemDiscount(curItem, curStock) || 0
  return { curStock, itemTot, disc }
}

function calcItemDiscount(item, quantity) {
  if (quantity >= 10) {
    switch (item.id) {
      case 'p1':
        return 0.1
      case 'p2':
        return 0.15
      case 'p3':
        return 0.2
      case 'p4':
        return 0.05
      case 'p5':
        return 0.25
      default:
        return 0
    }
  }
  return 0
}

function applyBulkDiscount(totalAmt, subTot, itemCnt) {
  if (itemCnt >= 30) {
    return Math.max(totalAmt * 0.75, subTot)
  }
  return totalAmt
}

function applyWeekdayDiscount(totalAmt, discountRate) {
  const dayOfWeek = new Date().getDay()
  if (dayOfWeek === 2) {
    totalAmt *= 0.9
    discountRate = Math.max(discountRate, 0.1)
  }
  return { totalAmt, discountRate }
}

export function calcCart() {
  let totalAmt = 0 //  합계
  let itemCnt = 0 //  상품 수
  let subTot = 0 //  소계

  const cartItems = Array.from(cartDisp.children)

  cartItems.forEach((cartItem) => {
    const itemData = calcItemTotals(cartItem)
    if (itemData) {
      const { curStock, itemTot, disc } = itemData
      itemCnt += curStock
      subTot += itemTot
      totalAmt += itemTot * (1 - disc)
    }
  })

  let discountRate = subTot > 0 ? (subTot - totalAmt) / subTot : 0

  totalAmt = applyBulkDiscount(totalAmt, subTot, itemCnt)

  applyWeekdayDiscount(totalAmt, discountRate)

  const dayOfWeek = new Date().getDay()
  if (dayOfWeek === 2) {
    totalAmt *= 0.9
    discountRate = Math.max(discountRate, 0.1)
  }

  if (isNaN(totalAmt) || isNaN(discountRate)) {
    console.error('NaN 빌견!!')
    totalAmt = subTot
    discountRate = 0
  }

  bonusPts += Math.floor(totalAmt / 1000)

  return { totalAmt, discountRate }
}

export function handleAddToCart() {
  const selItem = sel.value
  const itemToAdd = prodList.find((stock) => stock.id === selItem)

  if (!itemToAdd) {
    //  early return 적용
    alert('상품을 찾을 수 없습니다.')
    return
  }

  if (itemToAdd.stock <= 0) {
    //  early return 적용
    alert('재고가 부족합니다.')
    return
  }

  let item = document.getElementById(itemToAdd.id)
  if (item) {
    updateExistingItem(item, itemToAdd)
  } else {
    addItemToCart(itemToAdd)
  }

  const cartState = calcCart()
  renderCartDetails(cartState)
  updateStockInfo(prodList)
  renderBonusPts(bonusPts)
}

function updateExistingItem(item, itemToAdd) {
  const currentQty = parseInt(
    item.querySelector('span').textContent.split('x ')[1],
  )

  if (currentQty + 1 <= itemToAdd.stock) {
    item.querySelector('span').textContent =
      `${itemToAdd.name} - ${itemToAdd.price}원 x ${currentQty + 1}`
    updateProductStock(itemToAdd.id, -1)
  } else {
    alert('재고가 부족합니다.')
  }
}

function addItemToCart(itemToAdd) {
  const item = document.createElement('div')
  item.id = itemToAdd.id
  item.className = 'flex justify-between items-center mb-2'
  item.innerHTML = `
    <span>${itemToAdd.name} - ${itemToAdd.price}원 x 1</span>
    <div>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="-1">-</button>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="1">+</button>
      <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${itemToAdd.id}">삭제</button>
    </div>`

  cartDisp.appendChild(item)
  updateProductStock(itemToAdd.id, -1)
}

export function handleCartInteraction(event) {
  const tgt = event.target

  if (
    !tgt.classList.contains('quantity-change') &&
    !tgt.classList.contains('remove-item')
  ) {
    return
  } //  early return 적용

  const prodId = tgt.dataset.productId
  const itemElem = document.getElementById(prodId)
  const prod = prodList.find((p) => p.id === prodId)

  if (!itemElem || !prod) {
    console.error('잘못된 상품 ID:', prodId)
    return
  }

  if (tgt.classList.contains('quantity-change')) {
    updateQuantity(itemElem, tgt, prod)
  } else if (tgt.classList.contains('remove-item')) {
    removeItem(itemElem, prod)
  }

  const cartState = calcCart()
  renderCartDetails(cartState)
  updateStockInfo(prodList)
  renderBonusPts(bonusPts)
}

function updateQuantity(itemElem, tgt, prod) {
  const qtyChange = parseInt(tgt.dataset.change)
  const currentQty = parseInt(
    itemElem.querySelector('span').textContent.split('x ')[1],
  )
  const newQty = currentQty + qtyChange

  if (newQty > 0 && newQty <= prod.stock + currentQty) {
    itemElem.querySelector('span').textContent =
      `${prod.name} - ${prod.price}원 x ${newQty}`
    prod.stock -= qtyChange
  } else if (newQty <= 0) {
    removeItem(itemElem, prod)
  } else {
    alert('재고가 부족합니다.')
  }
}

function removeItem(itemElem, prod) {
  const remQty = parseInt(
    itemElem.querySelector('span').textContent.split('x ')[1],
  )
  updateProductStock(prod.id, remQty)
  itemElem.remove()
}
