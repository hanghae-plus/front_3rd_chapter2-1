const createTitle = (text) => {
  const h1 = document.createElement('h1');
  h1.className = 'text-2xl font-bold mb-4';
  h1.textContent = text;

  return h1;
};
const createDiv = ({ id, className }) => {
  const div = document.createElement('div');
  if (id) div.id = id;
  if (className) div.className = className;

  return div;
};
const createSelect = ({ id, className }) => {
  const select = document.createElement('select');
  if (id) select.id = id;
  if (className) select.className = className;

  return select;
};
const createBtn = ({ id, className, text }) => {
  const button = document.createElement('button');
  if (id) button.id = id;
  if (className) button.className = 'bg-blue-500 text-white px-4 py-2 rounded' + className;
  if (text) button.textContent = text;

  return button;
};

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
