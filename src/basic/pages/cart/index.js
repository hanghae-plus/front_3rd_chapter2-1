import { cartTemplates } from './templates.js';
import { events } from './events.js';
import { cartItemStore } from './store.js';

export function renderStockStatus(productList) {
  const $stockInfoContainer = document.getElementById('stock-status');

  // 기존 내용을 가져와서 유지
  let existingContent = $stockInfoContainer.textContent;

  // 업데이트 및 추가할 항목들을 모아놓을 변수
  let updatedContent = '';

  productList.forEach((item) => {
    // 각 상품에 대해 기존에 같은 정보가 있는지 확인
    let itemTextRegex = new RegExp(`${item.name}: .*`, 'g'); // item.name에 대한 텍스트를 찾는 정규식

    // 새로 추가할 텍스트 구성
    let newText = `${item.name}: ${
      item.quantity > 0 ? '재고 부족' + ` (${item.quantity}개 남음)` : '품절'
    }\n`;

    if (item.quantity <= 5) {
      // quantity가 5 이하인 경우, 업데이트 또는 새로 추가
      if (existingContent.match(itemTextRegex)) {
        // 이미 존재하면 해당 부분을 새 텍스트로 교체
        existingContent = existingContent.replace(itemTextRegex, newText);
      } else {
        // 존재하지 않으면 새로 추가
        updatedContent += newText;
      }
    } else {
      // quantity가 5 이상인 항목은 기존 텍스트에서 제거
      existingContent = existingContent.replace(itemTextRegex, '');
    }
  });

  // 기존 내용을 유지하면서 업데이트된 내용 추가
  $stockInfoContainer.textContent = existingContent + updatedContent;
}

function rerenderCartItems() {
  const cartItems = cartItemStore.getState().cartItems;
  const $cartItems = document.getElementById('cart-items');

  // 현재 DOM에 있는 cart 아이템 ID 추적
  const existingItemIds = Array.from($cartItems.children).map(
    (item) => item.id
  );

  renderStockStatus(cartItems);

  // 새로운 아이템 추가 또는 업데이트
  cartItems.forEach((item) => {
    const $existingItem = document.getElementById(item.id);

    console.log(item.quantity, 'item.quantity');

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
