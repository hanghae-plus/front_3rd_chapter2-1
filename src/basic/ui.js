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
