const salesProductList = [
  { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
  { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
  { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
  { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
  { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
];

const CONSTANTS = {
  FLASH_SALE_DISCOUNT: 0.2,
  SUGGESTION_DISCOUNT: 0.05,
  TUESDAY_DISCOUNT: 0.1,
  POINTS_PER_AMOUNT: 1000,
  BULK_PURCHASE_THRESHOLD: 30,
  BULK_DISCOUNT_RATE: 0.25,
  STOCK_WARNING_THRESHOLD: 5,
  INTERVALS: {
    FLASH_SALE: 30000,
    SUGGESTION: 60000,
  },
};

const STYLES = {
  wrapper: 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
  container: 'bg-gray-100 p-8',
  heading: 'text-2xl font-bold mb-4',
  select: 'border rounded p-2 mr-2',
  total: 'text-xl font-bold my-4',
  button: 'bg-blue-500 text-white px-4 py-2 rounded',
  status: 'text-sm text-gray-500 mt-2',
  cartItem: 'flex justify-between items-center mb-2',
};

const state = {
  products: [],
  lastSelectedProduct: null,
  bonusPoints: 0,
  totalAmount: 0,
  itemCount: 0,
  elements: {},
};

const createElement = (type, { id, className = '', textContent = '', dataSet = {} } = {}) => {
  const element = document.createElement(type);

  if (id) element.id = id;
  if (className) element.className = className;
  if (textContent) element.textContent = textContent;

  Object.keys(dataSet).forEach((key) => {
    element.dataset[key] = dataSet[key];
  });

  return element;
};

const createUIElements = () => ({
  root: document.getElementById('app'),
  wrapper: createElement('div', { className: STYLES.wrapper }),
  container: createElement('div', { className: STYLES.container }),
  heading: createElement('h1', {
    className: STYLES.heading,
    textContent: '장바구니',
  }),
  cartContainer: createElement('div', {
    id: 'cart-items',
  }),
  productSelect: createElement('select', {
    id: 'product-select',
    className: STYLES.select,
  }),
  totalAmount: createElement('div', {
    id: 'cart-total',
    className: STYLES.total,
  }),
  addButton: createElement('button', {
    id: 'add-to-cart',
    className: STYLES.button,
    textContent: '추가',
  }),
  stockStatus: createElement('div', {
    id: 'stock-status',
    className: STYLES.status,
  }),
});

const initializeUI = () => {
  state.elements = createUIElements();
  const {
    wrapper,
    container,
    heading,
    cartContainer,
    totalAmount,
    productSelect,
    addButton,
    stockStatus,
    root,
  } = state.elements;

  wrapper.append(heading, cartContainer, totalAmount, productSelect, addButton, stockStatus);
  container.appendChild(wrapper);
  root.appendChild(container);

  updateProductOptions();
  updateCartDisplay();
};

const calculateItemDiscount = (productId, quantity) => {
  const bulkDiscounts = {
    p1: 0.1,
    p2: 0.15,
    p3: 0.2,
    p4: 0.05,
    p5: 0.25,
  };
  return quantity >= 10 ? bulkDiscounts[productId] || 0 : 0;
};

const calculateTotalDiscount = (subTotal, totalAmount) => {
  let discountRate = (subTotal - totalAmount) / subTotal || 0;

  if (state.itemCount >= CONSTANTS.BULK_PURCHASE_THRESHOLD) {
    const bulkDiscount = totalAmount * CONSTANTS.BULK_DISCOUNT_RATE;
    const itemDiscount = subTotal - totalAmount;

    if (bulkDiscount > itemDiscount) {
      totalAmount = subTotal * (1 - CONSTANTS.BULK_DISCOUNT_RATE);
      discountRate = CONSTANTS.BULK_DISCOUNT_RATE;
    }
  }

  if (new Date().getDay() === 2) {
    totalAmount *= 1 - CONSTANTS.TUESDAY_DISCOUNT;
    discountRate = Math.max(discountRate, CONSTANTS.TUESDAY_DISCOUNT);
  }

  return { totalAmount, discountRate };
};

const calculateCartTotals = (cartItems) => {
  let subTotal = 0;
  let totalAmount = 0;
  state.itemCount = 0;

  [...cartItems].forEach((item) => {
    const product = state.products.find((p) => p.id === item.id);
    const quantity = parseInt(item.dataset.quantity);
    const productTotal = product.price * quantity;

    state.itemCount += quantity;
    subTotal += productTotal;

    const discount = calculateItemDiscount(product.id, quantity);
    totalAmount += productTotal * (1 - discount);
  });

  return calculateTotalDiscount(subTotal, totalAmount);
};

const updateProductOptions = () => {
  const { productSelect } = state.elements;
  productSelect.innerHTML = '';

  state.products.forEach((product) => {
    const option = createElement('option', {
      textContent: `${product.name} - ${product.price}원`,
      dataSet: {
        productId: product.id,
        disabled: product.quantity === 0,
      },
    });
    option.value = product.id;
    option.disabled = product.quantity === 0;
    productSelect.appendChild(option);
  });
};

const updateTotalDisplay = (discountRate) => {
  const { totalAmount } = state.elements;
  totalAmount.textContent = `총액: ${Math.round(state.totalAmount)}원`;

  if (discountRate > 0) {
    const discountSpan = createElement('span', {
      className: 'text-green-500 ml-2',
      textContent: `(${(discountRate * 100).toFixed(1)}% 할인 적용)`,
    });
    totalAmount.appendChild(discountSpan);
  }
};

const updateBonusPoints = () => {
  state.bonusPoints = Math.floor(state.totalAmount / CONSTANTS.POINTS_PER_AMOUNT);

  let pointsDisplay = document.getElementById('loyalty-points');
  if (!pointsDisplay) {
    pointsDisplay = createElement('span', {
      id: 'loyalty-points',
      className: 'text-blue-500 ml-2',
      textContent: `(포인트: ${state.bonusPoints})`,
    });
    state.elements.totalAmount.appendChild(pointsDisplay);
  } else {
    pointsDisplay.textContent = `(포인트: ${state.bonusPoints})`;
  }
};

const updateStockStatus = () => {
  const lowStockProducts = state.products
    .filter((product) => product.quantity < CONSTANTS.STOCK_WARNING_THRESHOLD)
    .map(
      (product) =>
        `${product.name}: ${
          product.quantity > 0 ? `재고 부족 (${product.quantity}개 남음)` : '품절'
        }`,
    );

  state.elements.stockStatus.textContent = lowStockProducts.join('\n');
};

const updateCartDisplay = () => {
  const cartItems = state.elements.cartContainer.children;
  const { totalAmount, discountRate } = calculateCartTotals(cartItems);

  state.totalAmount = totalAmount;
  updateTotalDisplay(discountRate);
  updateStockStatus();
  updateBonusPoints();
};

const handleQuantityChange = (cartItem, product, change) => {
  const currentQuantity = parseInt(cartItem.dataset.quantity);
  const newQuantity = currentQuantity + change;

  if (newQuantity <= 0) {
    cartItem.remove();
    product.quantity -= change;
  } else if (newQuantity <= product.quantity + currentQuantity) {
    cartItem.dataset.quantity = newQuantity;
    cartItem.querySelector('span').textContent =
      `${product.name} - ${product.price}원 x ${newQuantity}`;
    product.quantity -= change;
  } else {
    alert('재고가 부족합니다.');
  }
};

const handleRemoveItem = (cartItem, product) => {
  const removedQuantity = parseInt(cartItem.dataset.quantity);
  product.quantity += removedQuantity;
  cartItem.remove();
};

const handleCartAction = (event) => {
  const target = event.target;
  if (!target.dataset.productId) return;

  const productId = target.dataset.productId;
  const cartItem = document.getElementById(productId);
  const product = state.products.find((p) => p.id === productId);

  if (target.classList.contains('quantity-change')) {
    handleQuantityChange(cartItem, product, parseInt(target.dataset.change));
  } else if (target.classList.contains('remove-item')) {
    handleRemoveItem(cartItem, product);
  }

  updateCartDisplay();
};

const handleAddToCart = () => {
  const selectedProductId = state.elements.productSelect.value;
  const product = state.products.find((p) => p.id === selectedProductId);

  if (!product || product.quantity <= 0) return;

  const cartItem = document.getElementById(product.id);
  if (cartItem) {
    const currentQuantity = parseInt(cartItem.dataset.quantity);
    const newQuantity = currentQuantity + 1;

    if (newQuantity <= product.quantity) {
      cartItem.dataset.quantity = newQuantity;
      cartItem.querySelector('span').textContent =
        `${product.name} - ${product.price}원 x ${newQuantity}`;
      product.quantity--;
    } else {
      alert('재고가 부족합니다.');
    }
  } else {
    const newItem = createElement('div', {
      id: product.id,
      className: STYLES.cartItem,
      dataSet: { quantity: '1' },
    });

    const itemContent = createElement('span', {
      textContent: `${product.name} - ${product.price}원 x 1`,
    });

    const buttonsContainer = createElement('div');

    // 수량 감소 버튼
    const decreaseBtn = createElement('button', {
      className: 'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1',
      textContent: '-',
      dataSet: {
        productId: product.id,
        change: '-1',
      },
    });

    // 수량 증가 버튼
    const increaseBtn = createElement('button', {
      className: 'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1',
      textContent: '+',
      dataSet: {
        productId: product.id,
        change: '1',
      },
    });

    // 삭제 버튼
    const removeBtn = createElement('button', {
      className: 'remove-item bg-red-500 text-white px-2 py-1 rounded',
      textContent: '삭제',
      dataSet: {
        productId: product.id,
      },
    });

    buttonsContainer.append(decreaseBtn, increaseBtn, removeBtn);
    newItem.append(itemContent, buttonsContainer);
    state.elements.cartContainer.appendChild(newItem);
    product.quantity--;
  }

  state.lastSelectedProduct = selectedProductId;
  updateCartDisplay();
};

const setupPromotions = () => {
  const setupFlashSale = () => {
    setInterval(() => {
      const luckyProduct = state.products[Math.floor(Math.random() * state.products.length)];
      if (Math.random() < 0.3 && luckyProduct.quantity > 0) {
        luckyProduct.price = Math.round(luckyProduct.price * (1 - CONSTANTS.FLASH_SALE_DISCOUNT));
        alert(`번개세일! ${luckyProduct.name}이(가) 20% 할인 중입니다!`);
        updateProductOptions();
      }
    }, CONSTANTS.INTERVALS.FLASH_SALE);
  };

  const setupSuggestions = () => {
    setInterval(() => {
      if (state.lastSelectedProduct) {
        const suggestion = state.products.find(
          (item) => item.id !== state.lastSelectedProduct && item.quantity > 0,
        );

        if (suggestion) {
          alert(`${suggestion.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          suggestion.price = Math.round(suggestion.price * (1 - CONSTANTS.SUGGESTION_DISCOUNT));
          updateProductOptions();
        }
      }
    }, CONSTANTS.INTERVALS.SUGGESTION);
  };

  setTimeout(setupFlashSale, Math.random() * 10000);
  setTimeout(setupSuggestions, Math.random() * 20000);
};

const initializeApp = (products) => {
  state.products = products;

  initializeUI();
  setupPromotions();

  state.elements.addButton.addEventListener('click', handleAddToCart);
  state.elements.cartContainer.addEventListener('click', handleCartAction);
};

// Initialize the application
initializeApp(salesProductList);
