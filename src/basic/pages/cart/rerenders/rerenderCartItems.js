import { cartItemState } from '../state.js';
import { rerenderStockStatus } from './rerenderStockStatus.js';

const createCartItemNode = (item) => `
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
  const $cartItemElements = document.getElementById('cart-items');
  const existingItemIds = Array.from($cartItemElements.children).map((item) => item.id);

  rerenderStockStatus(cartItems);

  cartItems.forEach((item) => {
    const $existingItemElement = document.getElementById(item.id);

    if ($existingItemElement) {
      const span = $existingItemElement.querySelector('span');
      span.textContent = `${item.name} - ${item.price}원 x ${item.selectQuantity}`;

      const index = existingItemIds.indexOf(item.id);
      if (index > -1) {
        existingItemIds.splice(index, 1);
      }
    } else {
      $cartItemElements.insertAdjacentHTML('beforeend', createCartItemNode(item));
    }
  });

  existingItemIds.forEach((id) => {
    const $itemToRemove = document.getElementById(id);
    if ($itemToRemove) {
      $itemToRemove.remove();
    }
  });
}
