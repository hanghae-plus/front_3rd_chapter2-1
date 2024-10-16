import { createElement, createDiv } from './utils.js'
import { prodList } from './productList.js'

export let cartDisp, sel, addBtn, sum, stockInfo

export function setupElements() {
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

export function updateStockInfo(prodList) {
  let infoMsg = prodList
    ?.filter((item) => item.stock < 5)
    .map(
      ({ name, stock }) =>
        `${name}: ${stock > 0 ? '재고 부족 (' + stock + '개 남음)' : '품절'}`,
    )
    .join('\n')

  document.getElementById('stock-status').textContent = infoMsg
}

export function renderBonusPts(bonusPts) {
  let ptsTag = document.getElementById('loyalty-points')
  if (!ptsTag) {
    ptsTag = document.createElement('span')
    ptsTag.id = 'loyalty-points'
    ptsTag.className = 'text-blue-500 ml-2'
    sum.appendChild(ptsTag)
  }
  ptsTag.textContent = `(포인트: ${bonusPts})`
}

function updateSelOptions() {
  sel.innerHTML = prodList
    .map(
      ({ id, name, price, stock }) => `
    <option value="${id}" ${stock === 0 ? 'disabled' : ''}>${name} - ${price}원</option>
  `,
    )
    .join('')
}

export function renderCartDetails({ totalAmt, discountRate }) {
  sum.innerHTML = `총액: ${Math.round(totalAmt)}원${discountRate > 0 ? `<span class="text-green-500 ml-2">(${(discountRate * 100).toFixed(1)}% 할인 적용)</span>` : ''}`
}

export function setupEventListeners(handleAddToCart, handleCartInteraction) {
  addBtn.addEventListener('click', handleAddToCart)
  cartDisp.addEventListener('click', handleCartInteraction)
}
