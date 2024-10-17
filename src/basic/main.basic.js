const PRODUCT_LIST = [
  { id: 'p1', name: '상품1', price: 10000, quantity: 50, originalPrice: 10000 },
  { id: 'p2', name: '상품2', price: 20000, quantity: 30, originalPrice: 20000 },
  { id: 'p3', name: '상품3', price: 30000, quantity: 20, originalPrice: 30000 },
  { id: 'p4', name: '상품4', price: 15000, quantity: 0, originalPrice: 15000 },
  { id: 'p5', name: '상품5', price: 25000, quantity: 10, originalPrice: 25000 },
];

const DISCOUNT_RATES = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};

const TUESDAY_DISCOUNT_RATE = 0.1;
const BULK_DISCOUNT_THRESHOLD = 30;
const BULK_DISCOUNT_RATE = 0.25;
const TUESDAY_DAY_INDEX = 2;

const PROMOTION_INTERVAL_MIN = 10000;
const PROMOTION_INTERVAL_MAX = 20000;
const PROMOTION_FREQUENCY = 30000;
const SUGGESTION_FREQUENCY = 60000;

const OUT_OF_STOCK = '재고가 부족합니다';

let productList = JSON.parse(JSON.stringify(PRODUCT_LIST));
let cartItems = [];
let bonusPoints = 0;
let lastSelectedProductId = null;

function findProductById(id) {
  return productList.find((product) => product.id === id);
}

function applyDiscountToProduct(product, rate) {
  return { ...product, price: Math.round(product.originalPrice * (1 - rate)) };
}

function resetProductPrices() {
  productList.forEach((product) => {
    product.price = product.originalPrice;
  });
}

function isTuesday() {
  return new Date().getDay() === TUESDAY_DAY_INDEX;
}

function getBulkItemDiscount(productId) {
  return DISCOUNT_RATES[productId] || 0;
}

function getRandomInterval(min, max) {
  return Math.random() * (max - min) + min;
}

function calculateCartTotals() {
  let totalAmount = 0;
  let totalItemCount = 0;
  let subTotal = 0;

  resetProductPrices();

  cartItems.forEach((item) => {
    const product = findProductById(item.productId);
    let itemProduct = { ...product };
    let itemTotalPrice = itemProduct.price * item.quantity;
    subTotal += itemTotalPrice;
    totalItemCount += item.quantity;

    let itemDiscountRate = 0;
    if (item.quantity >= 10) {
      itemDiscountRate = getBulkItemDiscount(itemProduct.id);
      itemProduct = applyDiscountToProduct(itemProduct, itemDiscountRate);
      itemTotalPrice = itemProduct.price * item.quantity;
    }
    totalAmount += itemTotalPrice;
  });

  let discountRate = (subTotal - totalAmount) / subTotal;

  if (totalItemCount >= BULK_DISCOUNT_THRESHOLD) {
    const bulkDiscountAmount = subTotal * BULK_DISCOUNT_RATE;
    if (bulkDiscountAmount > subTotal - totalAmount) {
      totalAmount = subTotal * (1 - BULK_DISCOUNT_RATE);
      discountRate = BULK_DISCOUNT_RATE;
    }
  }

  if (isTuesday()) {
    totalAmount *= 1 - TUESDAY_DISCOUNT_RATE;
    discountRate = Math.max(discountRate, TUESDAY_DISCOUNT_RATE);
  }

  bonusPoints += Math.floor(totalAmount / 1000);

  renderTotalAmount(totalAmount, discountRate);
  renderStockInfo();
}

function renderProductOptions() {
  productSelect.innerHTML = '';
  productList.forEach((product) => {
    const option = document.createElement('option');
    option.value = product.id;
    option.textContent = `${product.name} - ${product.price}원`;
    if (product.quantity === 0) option.disabled = true;
    productSelect.appendChild(option);
  });
}

function renderCartItems() {
  cartItems.forEach((item) => {
    const existingElement = document.getElementById(item.productId);
    if (existingElement) {
      updateCartItemQuantity(existingElement, item);
    } else {
      const cartItemElement = createCartItemElement(item);
      cartDisplay.appendChild(cartItemElement);
    }
  });
}

function renderTotalAmount(totalAmount, discountRate) {
  totalDisplay.textContent = `총액: ${Math.round(totalAmount)}원`;
  if (discountRate > 0) {
    const discountInfo = document.createElement('span');
    discountInfo.className = 'text-green-500 ml-2';
    discountInfo.textContent = `(${(discountRate * 100).toFixed(1)}% 할인 적용)`;
    totalDisplay.appendChild(discountInfo);
  }
  renderBonusPoints();
}

function renderBonusPoints() {
  let pointsElement = document.getElementById('loyalty-points');
  if (!pointsElement) {
    pointsElement = document.createElement('span');
    pointsElement.id = 'loyalty-points';
    pointsElement.className = 'text-blue-500 ml-2';
    totalDisplay.appendChild(pointsElement);
  }
  pointsElement.textContent = `(포인트: ${bonusPoints})`;
}

function renderStockInfo() {
  const stockMessages = productList
    .filter((product) => product.quantity < 5)
    .map((product) => {
      const status = product.quantity > 0 ? `재고 부족 (${product.quantity}개 남음)` : '품절';
      return `${product.name}: ${status}`;
    });
  stockStatus.textContent = stockMessages.join('\n');
}

function handleAddToCart() {
  const productId = productSelect.value;
  console.log('🚀 ~ handleAddToCart ~ productId:', productId);
  const product = findProductById(productId);
  console.log('🚀 ~ handleAddToCart ~ product:', product);

  if (!product || product.quantity <= 0) {
    window.alert(OUT_OF_STOCK);
    return;
  }

  const existingCartItem = cartItems.find((item) => item.productId === productId);

  if (existingCartItem) {
    existingCartItem.quantity += 1;
  } else {
    cartItems.push({ productId: productId, quantity: 1 });
  }

  console.log('🚀 ~ handleAddToCart ~ cartItems:', cartItems);
  product.quantity -= 1;
  console.log('🚀 ~ handleAddToCart ~ product:', product);

  lastSelectedProductId = productId;
  renderCartItems();
  calculateCartTotals();
  renderProductOptions();
}

function handleCartInteraction(event) {
  const target = event.target;
  const productId = target.dataset.productId;

  if (target.classList.contains('quantity-change')) {
    const change = parseInt(target.dataset.change, 10);
    updateCartItemQuantity(productId, change);
  } else if (target.classList.contains('remove-item')) {
    removeCartItem(productId);
  }
}

function updateCartItemQuantity(productId, change) {
  const cartItem = cartItems.find((item) => item.productId === productId);
  const product = findProductById(productId);

  if (cartItem && product) {
    if (change === 1 && product.quantity > 0) {
      cartItem.quantity += 1;
      product.quantity -= 1;
    } else if (change === -1) {
      cartItem.quantity -= 1;
      product.quantity += 1;
      if (cartItem.quantity === 0) {
        cartItems = cartItems.filter((item) => item.productId !== productId);
      }
    } else {
      window.alert(OUT_OF_STOCK);
    }
    renderCartItems();
    calculateCartTotals();
    renderProductOptions();
  }
}

function removeCartItem(productId) {
  const cartItem = cartItems.find((item) => item.productId === productId);
  const product = findProductById(productId);

  if (cartItem && product) {
    product.quantity += cartItem.quantity;
    cartItems = cartItems.filter((item) => item.productId !== productId);
    renderCartItems();
    calculateCartTotals();
    renderProductOptions();
  }
}

function createCartItemElement(cartItem) {
  const product = findProductById(cartItem.productId);
  const cartItemElement = document.createElement('div');
  cartItemElement.id = product.id;
  cartItemElement.className = 'flex justify-between items-center mb-2';

  const itemInfo = document.createElement('span');
  itemInfo.textContent = `${product.name} - ${product.price}원 x ${cartItem.quantity}`;

  const controls = document.createElement('div');

  const decreaseButton = createQuantityChangeButton(product.id, -1);
  const increaseButton = createQuantityChangeButton(product.id, 1);
  const removeButton = createRemoveButton(product.id);

  controls.append(decreaseButton, increaseButton, removeButton);
  cartItemElement.append(itemInfo, controls);

  return cartItemElement;
}

function createQuantityChangeButton(productId, change) {
  const button = document.createElement('button');
  button.className = 'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1';
  button.dataset.productId = productId;
  button.dataset.change = change;
  button.textContent = change > 0 ? '+' : '-';
  return button;
}

function createRemoveButton(productId) {
  const button = document.createElement('button');
  button.className = 'remove-item bg-red-500 text-white px-2 py-1 rounded';
  button.dataset.productId = productId;
  button.textContent = '삭제';
  return button;
}

function createContainer() {
  const container = document.createElement('div');
  container.className = 'bg-gray-100 p-8';
  return container;
}

function createWrapper() {
  const wrapper = document.createElement('div');
  wrapper.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  return wrapper;
}

function createTitle(text) {
  const title = document.createElement('h1');
  title.className = 'text-2xl font-bold mb-4';
  title.textContent = text;
  return title;
}

function createCartDisplay() {
  const display = document.createElement('div');
  display.id = 'cart-items';
  return display;
}

function createTotalDisplay() {
  const display = document.createElement('div');
  display.id = 'cart-total';
  display.className = 'text-xl font-bold my-4';
  return display;
}

function createProductSelect() {
  const select = document.createElement('select');
  select.id = 'product-select';
  select.className = 'border rounded p-2 mr-2';
  return select;
}

function createAddButton() {
  const button = document.createElement('button');
  button.id = 'add-to-cart';
  button.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  button.textContent = '추가';
  return button;
}

function createStockStatus() {
  const status = document.createElement('div');
  status.id = 'stock-status';
  status.className = 'text-sm text-gray-500 mt-2';
  return status;
}

const appRoot = document.getElementById('app');

const container = createContainer();
const wrapper = createWrapper();

const title = createTitle('장바구니');
const cartDisplay = createCartDisplay();
const totalDisplay = createTotalDisplay();
const productSelect = createProductSelect();
const addButton = createAddButton();
const stockStatus = createStockStatus();

wrapper.append(title, cartDisplay, totalDisplay, productSelect, addButton, stockStatus);
container.appendChild(wrapper);
appRoot.appendChild(container);

renderProductOptions();
renderStockInfo();

addButton.addEventListener('click', handleAddToCart);
cartDisplay.addEventListener('click', handleCartInteraction);

function setupPromotions() {
  setTimeout(
    () => {
      setInterval(() => {
        applyRandomFlashSale();
      }, PROMOTION_FREQUENCY);
    },
    getRandomInterval(PROMOTION_INTERVAL_MIN, PROMOTION_INTERVAL_MAX)
  );

  setTimeout(
    () => {
      setInterval(() => {
        suggestProduct();
      }, SUGGESTION_FREQUENCY);
    },
    getRandomInterval(PROMOTION_INTERVAL_MIN, PROMOTION_INTERVAL_MAX)
  );
}

function applyRandomFlashSale() {
  const availableProducts = productList.filter((product) => product.quantity > 0);
  if (availableProducts.length === 0) return;

  const luckyProduct = availableProducts[Math.floor(Math.random() * availableProducts.length)];
  if (Math.random() < 0.3) {
    luckyProduct.price = Math.round(luckyProduct.price * 0.8);
    window.alert(`번개세일! ${luckyProduct.name}이(가) 20% 할인 중입니다!`);
    renderProductOptions();
  }
}

function suggestProduct() {
  if (!lastSelectedProductId) return;

  const suggestedProduct = productList.find(
    (product) => product.id !== lastSelectedProductId && product.quantity > 0
  );

  if (suggestedProduct) {
    suggestedProduct.price = Math.round(suggestedProduct.price * 0.95);
    window.alert(`${suggestedProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
    renderProductOptions();
  }
}
