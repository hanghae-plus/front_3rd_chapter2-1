import { cartTemplates } from './templates.js';
import { events } from './events.js';
import { cartItemStore } from './store.js';

function rerenderCartItems() {
  const cartItems = cartItemStore.getState().cartItems;
  const $cartItems = document.getElementById('cart-items');

  $cartItems.innerHTML = cartItems
    .map((item) => {
      return `
      <div id="${item.id}" class="flex justify-between items-center mb-2">
        <span>${item.name} - ${item.val}원 x ${item.q}</span>
        <div>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-item-id="${item.id}" data-change="-1">-</button>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-item-id="${item.id}" data-change="1">+</button>
          <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-item-id="${item.id}">삭제</button>
        </div>
      </div>`;
    })
    .join('');
}

function Cart() {
  cartItemStore.subscribe(rerenderCartItems);

  return {
    element: cartTemplates(),
    events: events(),
  };
}

export default Cart;
