// Shopping Cart Application in Functional Programming Style

document.addEventListener('DOMContentLoaded', initApp);

// Constants
const PRODUCTS = [
  { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
  { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
  { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
  { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
  { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
];

const DISCOUNT_RATES = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};

const BULK_DISCOUNT_THRESHOLD = 30;
const BULK_DISCOUNT_RATE = 0.25;
const WEEKDAY_DISCOUNT_DAY = 2; // Tuesday
const WEEKDAY_DISCOUNT_RATE = 0.1;
const FLASH_SALE_PROBABILITY = 0.3;
const FLASH_SALE_DISCOUNT_RATE = 0.2;
const SUGGESTION_DISCOUNT_RATE = 0.05;

function initApp() {
  const rootElement = document.getElementById('app');

  let products = PRODUCTS.map((product) => ({ ...product }));
  let cartItems = {};
  let bonusPoints = 0;
  let lastSelectedProductId = null;

  createUI(rootElement);
  updateProductOptions(products);
  calculateCart();

  setupEventListeners();
  startFlashSaleTimer();
  startSuggestionTimer();

  function createUI(rootElement) {
    const container = createElement('div', { className: 'bg-gray-100 p-8' });
    const wrapper = createElement('div', {
      className: 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
    });

    const title = createElement('h1', {
      className: 'text-2xl font-bold mb-4',
      textContent: '장바구니',
    });

    const cartDisplay = createElement('div', { id: 'cart-items' });
    const totalDisplay = createElement('div', {
      id: 'cart-total',
      className: 'text-xl font-bold my-4',
    });

    const productSelect = createElement('select', {
      id: 'product-select',
      className: 'border rounded p-2 mr-2',
    });

    const addToCartButton = createElement('button', {
      id: 'add-to-cart',
      className: 'bg-blue-500 text-white px-4 py-2 rounded',
      textContent: '추가',
    });

    const stockStatus = createElement('div', {
      id: 'stock-status',
      className: 'text-sm text-gray-500 mt-2',
    });

    wrapper.append(title, cartDisplay, totalDisplay, productSelect, addToCartButton, stockStatus);
    container.appendChild(wrapper);
    rootElement.appendChild(container);
  }

  function createElement(tag, options = {}) {
    const element = document.createElement(tag);
    Object.assign(element, options);
    return element;
  }

  function updateProductOptions(products) {
    const productSelect = document.getElementById('product-select');
    productSelect.innerHTML = '';
    products.forEach((product) => {
      const option = createElement('option', {
        value: product.id,
        textContent: `${product.name} - ${product.price}원`,
        disabled: product.quantity === 0,
      });
      productSelect.appendChild(option);
    });
  }

  function setupEventListeners() {
    const addToCartButton = document.getElementById('add-to-cart');
    addToCartButton.addEventListener('click', handleAddToCart);

    const cartDisplay = document.getElementById('cart-items');
    cartDisplay.addEventListener('click', handleCartActions);
  }

  function handleAddToCart() {
    const productSelect = document.getElementById('product-select');
    const selectedProductId = productSelect.value;
    const product = findProductById(products, selectedProductId);

    if (product && product.quantity > 0) {
      lastSelectedProductId = selectedProductId;
      addProductToCart(product);
      calculateCart();
    } else {
      alert('재고가 부족합니다.');
    }
  }

  function findProductById(products, productId) {
    return products.find((product) => product.id === productId);
  }

  function addProductToCart(product) {
    if (cartItems[product.id]) {
      const cartItem = cartItems[product.id];
      if (cartItem.quantity < product.quantity) {
        cartItem.quantity += 1;
        product.quantity -= 1;
        updateCartItemDisplay(cartItem);
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      cartItems[product.id] = { ...product, quantity: 1 };
      product.quantity -= 1;
      renderCartItem(cartItems[product.id]);
    }
    updateStockStatus();
  }

  function renderCartItem(cartItem) {
    const cartDisplay = document.getElementById('cart-items');

    const cartItemElement = createElement('div', {
      id: `cart-item-${cartItem.id}`,
      className: 'flex justify-between items-center mb-2',
      innerHTML: `
        <span>${cartItem.name} - ${cartItem.price}원 x ${cartItem.quantity}</span>
        <div>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${cartItem.id}" data-change="-1">-</button>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${cartItem.id}" data-change="1">+</button>
          <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${cartItem.id}">삭제</button>
        </div>
      `,
    });
    cartDisplay.appendChild(cartItemElement);
  }

  function updateCartItemDisplay(cartItem) {
    const cartItemElement = document.getElementById(`cart-item-${cartItem.id}`);
    const quantitySpan = cartItemElement.querySelector('span');
    quantitySpan.textContent = `${cartItem.name} - ${cartItem.price}원 x ${cartItem.quantity}`;
  }

  function handleCartActions(event) {
    const target = event.target;
    const productId = target.dataset.productId;
    const product = findProductById(products, productId);
    const cartItem = cartItems[productId];

    if (!cartItem) return;

    if (target.classList.contains('quantity-change')) {
      const change = parseInt(target.dataset.change, 10);
      changeCartItemQuantity(cartItem, product, change);
    } else if (target.classList.contains('remove-item')) {
      removeCartItem(cartItem, product);
    }

    calculateCart();
  }

  function changeCartItemQuantity(cartItem, product, change) {
    const newQuantity = cartItem.quantity + change;

    if (newQuantity > 0 && newQuantity <= product.quantity + cartItem.quantity) {
      cartItem.quantity = newQuantity;
      product.quantity -= change;
      updateCartItemDisplay(cartItem);
    } else if (newQuantity <= 0) {
      removeCartItem(cartItem, product);
    } else {
      alert('재고가 부족합니다.');
    }

    updateStockStatus();
  }

  function removeCartItem(cartItem, product) {
    product.quantity += cartItem.quantity;
    delete cartItems[cartItem.id];

    const cartItemElement = document.getElementById(`cart-item-${cartItem.id}`);
    if (cartItemElement) {
      cartItemElement.remove();
    }

    updateStockStatus();
  }

  function calculateCart() {
    let subtotal = 0;
    let totalItems = 0;
    let totalDiscount = 0;

    Object.values(cartItems).forEach((item) => {
      const itemTotal = item.price * item.quantity;
      const itemDiscount = getItemDiscount(item);
      subtotal += itemTotal;
      totalDiscount += itemTotal * itemDiscount;
      totalItems += item.quantity;
    });

    let totalAmount = subtotal - totalDiscount;
    const bulkDiscount = getBulkDiscount(totalItems, totalAmount);
    totalAmount -= bulkDiscount;

    const weekdayDiscount = getWeekdayDiscount(totalAmount);
    totalAmount -= weekdayDiscount;

    updateTotalDisplay(totalAmount, subtotal - totalAmount);
    updateBonusPoints(totalAmount);
  }

  function getItemDiscount(item) {
    if (item.quantity < 10) return 0;
    return DISCOUNT_RATES[item.id] || 0;
  }

  function getBulkDiscount(totalItems, totalAmount) {
    if (totalItems >= BULK_DISCOUNT_THRESHOLD) {
      return totalAmount * BULK_DISCOUNT_RATE;
    }
    return 0;
  }

  function getWeekdayDiscount(totalAmount) {
    const today = new Date().getDay(); // 0 (Sun) to 6 (Sat)
    if (today === WEEKDAY_DISCOUNT_DAY) {
      return totalAmount * WEEKDAY_DISCOUNT_RATE;
    }
    return 0;
  }

  function updateTotalDisplay(totalAmount, totalDiscount) {
    const totalDisplay = document.getElementById('cart-total');
    totalDisplay.textContent = `총액: ${Math.round(totalAmount)}원`;

    // Remove previous discount and bonus points display if any
    const existingDiscountSpan = totalDisplay.querySelector('.discount-span');
    if (existingDiscountSpan) {
      existingDiscountSpan.remove();
    }

    const existingPointsSpan = totalDisplay.querySelector('#loyalty-points');
    if (existingPointsSpan) {
      existingPointsSpan.remove();
    }

    if (totalDiscount > 0) {
      const discountPercentage = ((totalDiscount / (totalAmount + totalDiscount)) * 100).toFixed(1);
      const discountSpan = createElement('span', {
        className: 'discount-span text-green-500 ml-2',
        textContent: `(${discountPercentage}% 할인 적용)`,
      });
      totalDisplay.appendChild(discountSpan);
    }
  }

  function updateBonusPoints(totalAmount) {
    bonusPoints += Math.floor(totalAmount / 1000);

    const totalDisplay = document.getElementById('cart-total');
    let pointsDisplay = document.getElementById('loyalty-points');

    if (!pointsDisplay) {
      pointsDisplay = createElement('span', {
        id: 'loyalty-points',
        className: 'text-blue-500 ml-2',
      });
      totalDisplay.appendChild(pointsDisplay);
    }

    pointsDisplay.textContent = `(포인트: ${bonusPoints})`;
  }

  function updateStockStatus() {
    const stockStatus = document.getElementById('stock-status');
    const lowStockProducts = products
      .filter((product) => product.quantity < 5)
      .map((product) => {
        const status = product.quantity > 0 ? `재고 부족 (${product.quantity}개 남음)` : '품절';
        return `${product.name}: ${status}`;
      });

    stockStatus.textContent = lowStockProducts.join('\n');
  }

  function startFlashSaleTimer() {
    setTimeout(() => {
      setInterval(() => triggerFlashSale(), 30000);
    }, Math.random() * 10000);
  }

  function triggerFlashSale() {
    const availableProducts = products.filter((product) => product.quantity > 0);
    if (availableProducts.length === 0) return;

    const luckyProduct = availableProducts[Math.floor(Math.random() * availableProducts.length)];
    if (Math.random() < FLASH_SALE_PROBABILITY) {
      luckyProduct.price = Math.round(luckyProduct.price * (1 - FLASH_SALE_DISCOUNT_RATE));
      alert(`번개세일! ${luckyProduct.name}이(가) 20% 할인 중입니다!`);
      updateProductOptions(products);
    }
  }

  function startSuggestionTimer() {
    setTimeout(() => {
      setInterval(() => suggestProduct(), 60000);
    }, Math.random() * 20000);
  }

  function suggestProduct() {
    if (!lastSelectedProductId) return;

    const suggestion = products.find(
      (product) => product.id !== lastSelectedProductId && product.quantity > 0
    );

    if (suggestion) {
      suggestion.price = Math.round(suggestion.price * (1 - SUGGESTION_DISCOUNT_RATE));
      alert(`${suggestion.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
      updateProductOptions(products);
    }
  }
}
