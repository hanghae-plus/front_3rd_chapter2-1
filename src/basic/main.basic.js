const productList = [
  { id: 'p1', name: '상품1', price: 10000, stock: 50 },
  { id: 'p2', name: '상품2', price: 20000, stock: 30 },
  { id: 'p3', name: '상품3', price: 30000, stock: 20 },
  { id: 'p4', name: '상품4', price: 15000, stock: 0 },
  { id: 'p5', name: '상품5', price: 25000, stock: 10 },
];
const discountsOfProduct = { p1: 0.1, p2: 0.15, p3: 0.2, p4: 0.05, p5: 0.25 };

const state = {
  lastSelected: null,
  bonusPoints: 0,
  totalAmount: 0,
  itemCount: 0,
  discountRate: 0,
};

const root = document.getElementById('app');

const createElementWithHandler = (tagName, { events = {}, ...options } = {}, parent = root) => {
  const element = document.createElement(tagName);
  Object.entries(options).forEach(([key, value]) => (element[key] = value || element[key]));
  Object.entries(events).forEach(([event, handler]) => element.addEventListener(event, handler));
  parent.appendChild(element);
  return element;
};

const renderSetupUI = () => {
  const container = createElementWithHandler('div', { className: 'bg-gray-100 p-8' });
  const wrapper = createElementWithHandler(
    'div',
    { className: 'max-w-md mx-auto bg-white rounded-xl shadow-md p-8' },
    container
  );

  createElementWithHandler(
    'h1',
    { className: 'text-2xl font-bold mb-4', textContent: '장바구니' },
    wrapper
  );
  createElementWithHandler('div', { id: 'cart-items' }, wrapper);
  createElementWithHandler(
    'div',
    { id: 'cart-total', className: 'text-xl font-bold my-4' },
    wrapper
  );

  createElementWithHandler(
    'select',
    { id: 'product-select', className: 'border rounded p-2 mr-2' },
    wrapper
  );

  createElementWithHandler(
    'button',
    {
      id: 'add-to-cart',
      className: 'bg-blue-500 text-white px-4 py-2 rounded',
      textContent: '추가',
      events: { click: handleAddToCart },
    },
    wrapper
  );

  createElementWithHandler(
    'div',
    { id: 'stock-status', className: 'text-sm text-gray-500 mt-2' },
    wrapper
  );
};

const handleAddToCart = () => {
  const selectedItemId = document.getElementById('product-select').value;
  const product = productList.find((p) => p.id === selectedItemId);

  if (product && product.stock > 0) {
    const existingItem = document.getElementById(product.id);
    existingItem ? updateCartItem(product, 1) : renderCartItem(product);
    state.lastSelected = selectedItemId;
  } else {
    alert('재고가 부족합니다.');
  }
};

const renderCartItem = (product) => {
  const cart = document.getElementById('cart-items');
  createElementWithHandler(
    'div',
    {
      id: product.id,
      className: 'flex justify-between items-center mb-2',
      innerHTML: `
        <span>${product.name} - ${product.price}원 x 1</span>
        <div>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="-1">-</button>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="1">+</button>
          <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${product.id}">삭제</button>
        </div>`,
      events: { click: handleCartItemClick },
    },
    cart
  );
  product.stock--;
  calculateCart();
};

const updateCartItem = (product, addQuantity) => {
  const item = document.getElementById(product.id);
  const oldQuantity = parseInt(item.querySelector('span').textContent.split('x ')[1]);
  const newQuantity = oldQuantity + addQuantity;

  if (newQuantity > 0 && newQuantity <= product.stock + oldQuantity) {
    item.querySelector(
      'span'
    ).textContent = `${product.name} - ${product.price}원 x ${newQuantity}`;
    product.stock -= addQuantity;
  } else {
    alert('재고가 부족합니다.');
  }
  calculateCart();
};

const handleCartItemClick = (event) => {
  const target = event.target;
  const productId = target.dataset.productId;
  const product = productList.find((p) => p.id === productId);
  if (target.classList.contains('quantity-change')) {
    updateCartItem(product, parseInt(target.dataset.change));
  } else if (target.classList.contains('remove-item')) {
    removeCartItem(product);
  }
};

const removeCartItem = (product) => {
  const item = document.getElementById(product.id);
  const quantity = parseInt(item.querySelector('span').textContent.split('x ')[1]);
  product.stock += quantity;
  item.remove();
  calculateCart();
};
const updateSelOpts = () => {
  const productSelect = document.getElementById('product-select');
  productSelect.innerHTML = '';
  productList.forEach(function (item) {
    let opt = document.createElement('option');
    opt.value = item.id;

    opt.textContent = item.name + ' - ' + item.price + '원';
    if (item.stock === 0) opt.disabled = true;
    productSelect.appendChild(opt);
  });
};

const getDiscountRate = (productId) => {
  return discountsOfProduct[productId] || 0;
};

const calculateCart = () => {
  state.totalAmount = 0;
  state.itemCount = 0;
  let subTot = 0;

  Array.from(document.getElementById('cart-items').children).forEach((item) => {
    const productId = item.id;
    const product = productList.find((p) => p.id === productId);
    const quantity = parseInt(item.querySelector('span').textContent.split('x ')[1]);
    const itemTotal = product.price * quantity;

    let discount = quantity >= 10 ? getDiscountRate(productId) : 0;
    state.totalAmount += itemTotal * (1 - discount);
    state.itemCount += quantity;
    subTot += itemTotal;
  });

  if (state.itemCount >= 30) {
    let bulkDisc = state.totalAmount * 0.25;
    let itemDisc = subTot - state.totalAmount;
    if (bulkDisc > itemDisc) {
      state.totalAmount = subTot * (1 - 0.25);
      state.discountRate = 0.25;
    } else {
      state.discountRate = (subTot - state.totalAmount) / subTot;
    }
  } else {
    state.discountRate = (subTot - state.totalAmount) / subTot;
  }

  processDiscountRate();
  renderCartTotal();
  renderBonusPoints();
  updateStockInfo();
};

const processDiscountRate = () => {
  if (new Date().getDay() === 2) {
    state.totalAmount *= 1 - 0.1;
    state.discountRate = Math.max(state.discountRate, 0.1);
  }
};

const renderCartTotal = () => {
  document.getElementById('cart-total').textContent = `총액: ${Math.round(state.totalAmount)}원`;
  if (state.discountRate > 0) {
    document.getElementById('cart-total').textContent =
      '(' + (state.discountRate * 100).toFixed(1) + '% 할인 적용)';
  }
};

const renderBonusPoints = () => {
  state.bonusPoints += Math.floor(state.totalAmount / 1000);
  createElementWithHandler(
    'span',
    {
      id: 'loyalty-points',
      className: 'text-blue-500 ml-2',
      textContent: `(포인트: ${state.bonusPoints})`,
    },
    document.getElementById('cart-total')
  );
};

const updateStockInfo = () => {
  updateSelOpts();
  const stockInfo = productList
    .filter((item) => item.stock < 5)
    .map((item) => `${item.name}: ${item.stock > 0 ? `재고 부족 (${item.stock}개 남음)` : '품절'}`)
    .join('\n');
  document.getElementById('stock-status').textContent = stockInfo;
};

const setupTimeSale = () => {
  setTimeout(function () {
    setInterval(function () {
      let luckyItem = productList[Math.floor(Math.random() * productList.length)];
      if (Math.random() < 0.3 && luckyItem.stock > 0) {
        luckyItem.val = Math.round(luckyItem.price * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateSelOpts();
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(function () {
    setInterval(function () {
      if ((state.lastSelected = null)) {
        let suggest = productList.find((item) => item.id !== state.lastSelected && item.stock > 0);
        if (suggest) {
          alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.val = Math.round(suggest.price * 0.95);
          updateSelOpts();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
};

function main() {
  renderSetupUI();
  setupTimeSale();
  updateStockInfo();
  calculateCart();
}

main();
