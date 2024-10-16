import { renderProductList, initRenderCartBtnEventListeners } from './render';
import { calcCart, lastSelectedProductId, initAddCartBtnEventListeners } from './cart';
import { PRODUCT_LIST } from './constants';

let renderCart, productSum, productSelectDropDown, addCartBtn, stockInfo;

const layout = () => {
  const root = document.getElementById('app');
  const container = document.createElement('div');
  const wrap = document.createElement('div');
  const h1Text = document.createElement('h1');

  renderCart = document.createElement('div');
  productSum = document.createElement('div');
  productSelectDropDown = document.createElement('select');
  addCartBtn = document.createElement('button');
  stockInfo = document.createElement('div');

  renderCart.id = 'cart-items';
  productSum.id = 'cart-total';
  productSelectDropDown.id = 'product-select';
  addCartBtn.id = 'add-to-cart';

  stockInfo.id = 'stock-status';
  container.className = 'bg-gray-100 p-8';
  wrap.className = 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  h1Text.className = 'text-2xl font-bold mb-4';
  productSum.className = 'text-xl font-bold my-4';
  productSelectDropDown.className = 'border rounded p-2 mr-2';
  addCartBtn.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  stockInfo.className = 'text-sm text-gray-500 mt-2';

  h1Text.textContent = '장바구니';
  addCartBtn.textContent = '추가';

  wrap.appendChild(h1Text);
  wrap.appendChild(renderCart);
  wrap.appendChild(productSum);
  wrap.appendChild(productSelectDropDown);
  wrap.appendChild(addCartBtn);
  wrap.appendChild(stockInfo);
  container.appendChild(wrap);
  root.appendChild(container);

  setTimeout(() => {
    setInterval(() => {
      const timeSaleProduct = PRODUCT_LIST[Math.floor(Math.random() * PRODUCT_LIST.length)];
      if (Math.random() < 0.3 && timeSaleProduct.stock > 0) {
        timeSaleProduct.price = Math.round(timeSaleProduct.price * 0.8);
        alert(`번개세일! ${timeSaleProduct.name}이(가) 20% 할인 중입니다!`);
        renderProductList();
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(() => {
    setInterval(() => {
      if (lastSelectedProductId) {
        const productSuggest = PRODUCT_LIST.find((product) => {
          return product.id !== lastSelectedProductId && product.stock > 0;
        });
        if (productSuggest) {
          alert(`${productSuggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          productSuggest.price = Math.round(productSuggest.price * 0.95);
          renderProductList();
        }
      }
    }, 60000);
  }, Math.random() * 20000);

  renderProductList();
  initAddCartBtnEventListeners();
  initRenderCartBtnEventListeners();
  calcCart();
};

export { layout, renderCart, productSum, productSelectDropDown, addCartBtn, stockInfo };
