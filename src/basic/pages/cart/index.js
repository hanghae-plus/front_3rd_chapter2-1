import { cartTemplates } from './templates.js';
import { events } from './events.js';
import { cartItemStore } from './store.js';

function rerenderCartItems() {
  const cartItems = cartItemStore.getState().cartItems;
  const $cartItems = document.getElementById('cart-items');

  // 현재 DOM에 있는 cart 아이템 ID 추적
  const existingItemIds = Array.from($cartItems.children).map(
    (item) => item.id
  );

  // 새로운 아이템 추가 또는 업데이트
  cartItems.forEach((item) => {
    const $existingItem = document.getElementById(item.id);

    if ($existingItem) {
      // 이미 존재하는 요소의 텍스트 노드만 업데이트
      const span = $existingItem.querySelector('span');
      span.textContent = `${item.name} - ${item.price}원 x ${item.selectQuantity}`;
      // 현재 유지되고 있는 항목이므로, 삭제 대상에서 제외
      const index = existingItemIds.indexOf(item.id);
      if (index > -1) {
        existingItemIds.splice(index, 1);
      }
    } else {
      // 새로 추가할 항목만 렌더링
      const newItemHTML = `
        <div id="${item.id}" class="flex justify-between items-center mb-2">
          <span>${item.name} - ${item.price}원 x ${item.selectQuantity}</span>
          <div>
            <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-item-id="${item.id}" data-change="-1">-</button>
            <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-item-id="${item.id}" data-change="1">+</button>
            <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-item-id="${item.id}">삭제</button>
          </div>
        </div>`;
      // 새로운 항목 추가
      $cartItems.insertAdjacentHTML('beforeend', newItemHTML);
    }
  });

  // cartItems에 없는 기존 요소는 DOM에서 삭제
  existingItemIds.forEach((id) => {
    const $itemToRemove = document.getElementById(id);
    if ($itemToRemove) {
      $itemToRemove.remove();
    }
  });
}

function Cart() {
  cartItemStore.subscribe(rerenderCartItems);

  return {
    element: cartTemplates(),
    events: events(),
  };
}

export default Cart;
