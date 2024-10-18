import { createElement } from '../services';

// UI 생성: 필요한 모든 UI 요소들을 생성하여 반환
export const createUI = () => {
  const cont = createElement('div', '', 'bg-gray-100 p-8');
  const wrap = createElement(
    'div',
    '',
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
  );

  const hTxt = createElement('h1', '장바구니', 'text-2xl font-bold mb-4');
  const cartItems = createElement('div', '', '', { id: 'cart-items' });
  const cartTotal = createElement('div', '', 'text-xl font-bold my-4', { id: 'cart-total' });
  const productSel = createElement('select', '', 'border rounded p-2 mr-2', { id: 'product-select' });
  const addBtn = createElement('button', '추가', 'bg-blue-500 text-white px-4 py-2 rounded', { id: 'add-to-cart' });
  const stockStatus = createElement('div', '', 'text-sm text-gray-500 mt-2', { id: 'stock-status' });

  [hTxt, cartItems, cartTotal, productSel, addBtn, stockStatus].forEach((el) => wrap.appendChild(el));
  cont.appendChild(wrap);
  return { cont, cartItems, cartTotal, productSel, addBtn, stockStatus };
};

// 상품 선택 옵션을 업데이트
export const updateSelOpts = (productSel, products) => {
  productSel.innerHTML = '';
  products.forEach(({ id, name, val, q }) => {
    const option = createElement('option', `${name} - ${val}원`, '', { value: id });
    option.disabled = q === 0;
    productSel.appendChild(option);
  });
};
