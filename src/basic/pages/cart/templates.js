import { globalCartStore } from './store.js';

export const cartTemplates = () => {
  const { productList } = globalCartStore.getState();

  return `
      <div class="bg-gray-100 p-8">
        <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
          <h1 class="text-2xl font-bold mb-4">장바구니</h1>
          
          <div id="cart-items">
          </div>
          
          <div id="cart-total" class="text-xl font-bold my-4">
          총액: 0원
                 <span id="loyalty-points" class="text-blue-500 ml-2">
        (포인트: 0)
      </span>
</div>
       <select id="product-select" class="border rounded p-2 mr-2">
    ${productList
      .map(
        (product) =>
          `<option ${product.quantity === 0 ? 'disabled' : ''} value="${product.id}">${product.name} - ${product.price}원</option>`
      )
      .join('')}
  </select>
          <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
                ${productList
                  .filter((product) => product.quantity === 0)
                  .map(
                    (product) => `
    <div id="stock-status" class="text-sm text-gray-500 mt-2">${product.name}: ${product.quantity > 0 ? '재고 부족' + ` (${product.quantity}개 남음)` : '품절'}</div>
  `
                  )}
        </div>
      </div>
    `;
};
