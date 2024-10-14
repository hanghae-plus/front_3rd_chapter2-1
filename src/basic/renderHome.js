import { createBtn, createDiv, createSelect, createTitle } from './createElements';

const renderHome = () => {
  const cont = createDiv({ className: 'bg-gray-100 p-8' });
  const wrap = createDiv({
    className: 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
  });
  const title = createTitle('장바구니');
  const cartItemsDiv = createDiv({ id: 'cart-items' });
  const cartTotalDiv = createDiv({ id: 'cart-total', className: 'text-xl font-bold my-4' });
  const productSelect = createSelect({
    id: 'product-select',
    className: 'border rounded p-2 mr-2',
  });
  const addToCartBtn = createBtn({ id: 'add-to-cart', text: '추가' });
  const stockStatusDiv = createDiv({ id: 'stock-status', className: 'text-sm text-gray-500 mt-2' });

  wrap.appendChild(title);
  wrap.appendChild(cartItemsDiv);
  wrap.appendChild(cartTotalDiv);
  wrap.appendChild(productSelect);
  wrap.appendChild(addToCartBtn);
  wrap.appendChild(stockStatusDiv);
  cont.appendChild(wrap);

  return cont;
};

export default renderHome;
