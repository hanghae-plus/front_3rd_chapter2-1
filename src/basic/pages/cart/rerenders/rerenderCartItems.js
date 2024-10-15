import { cartItemState } from '../state.js';
import { rerenderStockStatus } from './rerenderStockStatus.js';

const createCartItemTemplate = (item) => `
        <div id="${item.id}" class="flex justify-between items-center mb-2">
          <span>${item.name} - ${item.price}원 x ${item.selectQuantity}</span>
          <div>
            <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-item-id="${item.id}" data-change="-1">-</button>
            <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-item-id="${item.id}" data-change="1">+</button>
            <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-item-id="${item.id}">삭제</button>
          </div>
        </div>
`;

export function rerenderCartItems() {
  const { cartItems } = cartItemState.getState();
  const cartItemsContainer = document.getElementById('cart-items');
  const currentCartItemIds = Array.from(cartItemsContainer.children).map((item) => item.id);

  rerenderStockStatus(cartItems);

  cartItems.forEach((item) => {
    const $currentCartItemElement = document.getElementById(item.id);

    if ($currentCartItemElement) {
      const $cartItemInfoElement = $currentCartItemElement.querySelector('span');
      $cartItemInfoElement.textContent = `${item.name} - ${item.price}원 x ${item.selectQuantity}`;

      const index = currentCartItemIds.indexOf(item.id);
      if (index > -1) {
        currentCartItemIds.splice(index, 1);
      }
    } else {
      cartItemsContainer.insertAdjacentHTML('beforeend', createCartItemTemplate(item));
    }
  });

  currentCartItemIds.forEach((id) => {
    const $cartItemElement = document.getElementById(id);
    if ($cartItemElement) {
      $cartItemElement.remove();
    }
  });
}
