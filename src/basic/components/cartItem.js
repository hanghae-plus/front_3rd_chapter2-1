// 장바구니 상품추가, 수정
import { createElementWithProps } from '../utils/createElement.js';

export function createCartItem(item) {
  return createElementWithProps('div', {
    id: item.id,
    className: 'flex justify-between items-center mb-2',
    innerHTML: `
      <span>${item.name} - ${item.price}원 x 1</span>
      <div>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${item.id}" data-change="-1">-</button>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${item.id}" data-change="1">+</button>
        <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${item.id}">삭제</button>
      </div>
    `,
  });
}

export function updateCartItem(cartItemElement, product, countChange) {
  const remQty = parseInt(
    cartItemElement.querySelector('span').textContent.split('x ')[1]
  );
  const newStock = remQty + countChange;

  if (newStock > 0 && newStock <= product.stock + remQty) {
    cartItemElement.querySelector('span').textContent = `
    ${product.name} - ${product.price}원 x ${newStock}
    `;
    product.stock -= countChange;
  } else if (newStock <= 0) {
    cartItemElement.remove();
    product.stock -= countChange;
  } else {
    alert('재고가 부족합니다.');
  }
}
