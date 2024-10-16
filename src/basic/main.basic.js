import {
  handleAddToCart,
  handleCartInteraction,
  initializeCart,
  initializeTimedEvents,
} from './cart'
import {
  addBtn,
  cartDisp,
  sel,
  setupElements,
  setupEventListeners,
  stockInfo,
  sum,
} from './ui'
import { createDiv, createElement } from './utils'

function main() {
  const root = document.getElementById('app')
  const container = createDiv('bg-gray-100 p-8')
  const wrapper = createDiv(
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
  )
  const title = createElement('h1', 'text-2xl font-bold mb-4', '장바구니')

  setupElements()

  wrapper.append(title, cartDisp, sum, sel, addBtn, stockInfo)
  container.appendChild(wrapper)
  root.appendChild(container)

  initializeCart()
  initializeTimedEvents()
  setupEventListeners(handleAddToCart, handleCartInteraction)
}

main()
