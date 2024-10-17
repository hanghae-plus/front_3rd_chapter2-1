import { renderProductList, initRenderCartBtnEventListeners } from './render';
import { calcCart, lastSelectedProductId, initAddCartBtnEventListeners } from './cart';
import { PRODUCT_LIST } from './constants';

let renderCart, productSum, productSelectDropDown, addCartBtn, stockInfo;

const layout = () => {
  const createElement = (type, attributes = {}, ...children) => {
    const element = document.createElement(type);
    Object.entries(attributes).forEach(([key, value]) => (element[key] = value));
    children.forEach((child) => element.appendChild(child));
    return element;
  };

  const root = document.getElementById('app');
  renderCart = createElement('div', { id: 'cart-items' });
  productSum = createElement('div', { id: 'cart-total', className: 'text-xl font-bold my-4' });
  productSelectDropDown = createElement('select', { id: 'product-select', className: 'border rounded p-2 mr-2' });
  addCartBtn = createElement('button', {
    id: 'add-to-cart',
    className: 'bg-blue-500 text-white px-4 py-2 rounded',
    textContent: '추가',
  });
  stockInfo = createElement('div', { id: 'stock-status', className: 'text-sm text-gray-500 mt-2' });
  const h1Text = createElement('h1', { className: 'text-2xl font-bold mb-4', textContent: '장바구니' });
  const wrap = createElement(
    'div',
    {
      className: 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
    },
    h1Text,
    renderCart,
    productSum,
    productSelectDropDown,
    addCartBtn,
    stockInfo,
  );
  const container = createElement('div', { className: 'bg-gray-100 p-8' }, wrap);
  root.appendChild(container);

  const timeSaleProductRenderer = () => {
    const timeSaleProduct = PRODUCT_LIST[Math.floor(Math.random() * PRODUCT_LIST.length)];
    if (Math.random() < 0.3 && timeSaleProduct.stock > 0) {
      timeSaleProduct.price = Math.round(timeSaleProduct.price * 0.8);
      alert(`번개세일! ${timeSaleProduct.name}이(가) 20% 할인 중입니다!`);
      renderProductList();
    }
  };

  const productSuggestRender = () => {
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
  };

  setTimeout(() => {
    setInterval(() => {
      timeSaleProductRenderer();
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(() => {
    setInterval(() => {
      productSuggestRender();
    }, 60000);
  }, Math.random() * 20000);

  renderProductList();
  initAddCartBtnEventListeners();
  initRenderCartBtnEventListeners();
  calcCart();
};

export { layout, renderCart, productSum, productSelectDropDown, addCartBtn, stockInfo };
