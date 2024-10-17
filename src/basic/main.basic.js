// 상수 정의
const PRODUCT_LIST = [
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
const TUESDAY_DISCOUNT_RATE = 0.1;

// 전역 상태
let products = [...PRODUCT_LIST];
let cart = [];
let bonusPoints = 0;
let lastSelectedProduct = null;

// DOM 요소
let productSelect, addButton, cartDisplay, totalDisplay, stockInfo;

function main() {
  initializeDOM();
  renderProductOptions();
  updateStockInfo();
  setupEventListeners();
  setupPromotions();
}

function initializeDOM() {
  const root = document.getElementById('app');
  const container = createContainer();
  const wrapper = createWrapper();

  const title = createElement('h1', {
    className: 'text-2xl font-bold mb-4',
    textContent: '장바구니',
  });
  cartDisplay = createElement('div', { id: 'cart-items' });
  totalDisplay = createElement('div', { id: 'cart-total', className: 'text-xl font-bold my-4' });
  productSelect = createElement('select', {
    id: 'product-select',
    className: 'border rounded p-2 mr-2',
  });
  addButton = createElement('button', {
    id: 'add-to-cart',
    className: 'bg-blue-500 text-white px-4 py-2 rounded',
    textContent: '추가',
  });
  stockInfo = createElement('div', { id: 'stock-status', className: 'text-sm text-gray-500 mt-2' });

  wrapper.append(title, cartDisplay, totalDisplay, productSelect, addButton, stockInfo);
  container.appendChild(wrapper);
  root.appendChild(container);
}

function createElement(tag, attributes = {}) {
  const element = document.createElement(tag);
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'dataset') {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = dataValue;
      });
    } else {
      element[key] = value;
    }
  });
  return element;
}

function createContainer() {
  return createElement('div', { className: 'bg-gray-100 p-8' });
}

function createWrapper() {
  return createElement('div', {
    className: 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
  });
}

function renderProductOptions() {
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

function updateStockInfo() {
  const lowStockProducts = products.filter((product) => product.quantity < 5);
  stockInfo.textContent = lowStockProducts
    .map(
      (product) =>
        `${product.name}: ${product.quantity > 0 ? `재고 부족 (${product.quantity}개 남음)` : '품절'}`
    )
    .join('\n');
}

function setupEventListeners() {
  addButton.addEventListener('click', handleAddToCart);
}

function handleAddToCart() {
  const selectedProduct = products.find((p) => p.id === productSelect.value);
  if (selectedProduct && selectedProduct.quantity > 0) {
    addToCart(selectedProduct);
    updateCart();
    lastSelectedProduct = selectedProduct.id;
  }
}

function addToCart(product) {
  const existingItem = cart.find((item) => item.id === product.id);
  if (existingItem) {
    if (product.quantity > 0) {
      existingItem.quantity++;
      product.quantity--;
    } else {
      alert('재고가 부족합니다.');
    }
  } else {
    cart.push({ ...product, quantity: 1 });
    product.quantity--;
  }
}

function updateCartItemQuantity(productId, change) {
  const cartItem = cart.find((item) => item.id === productId);
  const product = products.find((p) => p.id === productId);
  if (cartItem && product) {
    if (change > 0) {
      // 수량 증가
      if (product.quantity >= change) {
        cartItem.quantity += change;
        product.quantity -= change;
      } else {
        alert('재고가 부족합니다.');
        return;
      }
    } else if (change < 0) {
      // 수량 감소
      if (cartItem.quantity >= -change) {
        cartItem.quantity += change;
        product.quantity -= change; // change가 음수이므로 더해줌
        if (cartItem.quantity === 0) {
          removeFromCart(productId);
        }
      } else {
        alert('장바구니에 해당 수량이 없습니다.');
        return;
      }
    }
    updateCart();
  }
}

function removeFromCart(productId) {
  const index = cart.findIndex((item) => item.id === productId);
  if (index !== -1) {
    const removedItem = cart.splice(index, 1)[0];
    const product = products.find((p) => p.id === productId);
    if (product) {
      product.quantity += removedItem.quantity;
    }
    updateCart();
  }
}

function updateCart() {
  renderCartItems();
  calculateTotal();
  renderProductOptions();
  updateStockInfo();
}

function renderCartItems() {
  cartDisplay.innerHTML = ''; // 기존 내용 초기화

  cart.forEach((item) => {
    const itemElement = createElement('div', {
      id: item.id,
      className: 'flex justify-between items-center mb-2',
    });

    const itemInfo = createElement('span', {
      textContent: `${item.name} - ${item.price}원 x ${item.quantity}`,
    });

    const buttonContainer = createElement('div');

    const decreaseButton = createElement('button', {
      className: 'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1',
      textContent: '-',
      dataset: { productId: item.id, change: -1 },
    });
    decreaseButton.addEventListener('click', handleQuantityChange);

    const increaseButton = createElement('button', {
      className: 'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1',
      textContent: '+',
      dataset: { productId: item.id, change: 1 },
    });
    increaseButton.addEventListener('click', handleQuantityChange);

    const removeButton = createElement('button', {
      className: 'remove-item bg-red-500 text-white px-2 py-1 rounded',
      textContent: '삭제',
      dataset: { productId: item.id },
    });
    removeButton.addEventListener('click', handleRemoveItem);

    buttonContainer.append(decreaseButton, increaseButton, removeButton);
    itemElement.append(itemInfo, buttonContainer);
    cartDisplay.appendChild(itemElement);
  });
}

function handleQuantityChange(event) {
  const productId = event.target.dataset.productId;
  const change = parseInt(event.target.dataset.change);
  updateCartItemQuantity(productId, change);
}

function handleRemoveItem(event) {
  const productId = event.target.dataset.productId;
  removeFromCart(productId);
}

function calculateTotal() {
  let totalAmount = 0;
  let itemCount = 0;
  let subTotal = 0;

  cart.forEach((item) => {
    const quantity = item.quantity;
    const price = item.price;
    let itemTotal = price * quantity;
    subTotal += itemTotal;
    itemCount += quantity;

    if (quantity >= 10) {
      const discountRate = DISCOUNT_RATES[item.id] || 0;
      itemTotal *= 1 - discountRate;
    }
    totalAmount += itemTotal;
  });

  let discountRate = 0;
  if (itemCount >= BULK_DISCOUNT_THRESHOLD) {
    const bulkDiscount = subTotal * BULK_DISCOUNT_RATE;
    const itemDiscount = subTotal - totalAmount;
    if (bulkDiscount > itemDiscount) {
      totalAmount = subTotal * (1 - BULK_DISCOUNT_RATE);
      discountRate = BULK_DISCOUNT_RATE;
    } else {
      discountRate = itemDiscount / subTotal;
    }
  } else {
    discountRate = (subTotal - totalAmount) / subTotal;
  }

  if (new Date().getDay() === 2) {
    totalAmount *= 1 - TUESDAY_DISCOUNT_RATE;
    discountRate = Math.max(discountRate, TUESDAY_DISCOUNT_RATE);
  }

  bonusPoints += Math.floor(totalAmount / 1000);

  renderTotalAmount(totalAmount, discountRate);
}

function renderTotalAmount(totalAmount, discountRate) {
  totalDisplay.textContent = `총액: ${Math.round(totalAmount)}원`;
  if (discountRate > 0) {
    const discountInfo = createElement('span', {
      className: 'text-green-500 ml-2',
      textContent: `(${(discountRate * 100).toFixed(1)}% 할인 적용)`,
    });
    totalDisplay.appendChild(discountInfo);
  }
  renderBonusPoints();
}

function renderBonusPoints() {
  let pointsElement = document.getElementById('loyalty-points');
  if (!pointsElement) {
    pointsElement = createElement('span', {
      id: 'loyalty-points',
      className: 'text-blue-500 ml-2',
    });
    totalDisplay.appendChild(pointsElement);
  }
  pointsElement.textContent = `(포인트: ${bonusPoints})`;
}

function setupPromotions() {
  setTimeout(() => {
    setInterval(applyRandomFlashSale, 30000);
  }, Math.random() * 10000);

  setTimeout(() => {
    setInterval(suggestProduct, 60000);
  }, Math.random() * 20000);
}

function applyRandomFlashSale() {
  const availableProducts = products.filter((p) => p.quantity > 0);
  if (availableProducts.length > 0 && Math.random() < 0.3) {
    const luckyProduct = availableProducts[Math.floor(Math.random() * availableProducts.length)];
    luckyProduct.price = Math.round(luckyProduct.price * 0.8);
    alert(`번개세일! ${luckyProduct.name}이(가) 20% 할인 중입니다!`);
    renderProductOptions();
  }
}

function suggestProduct() {
  if (lastSelectedProduct) {
    const suggestedProduct = products.find((p) => p.id !== lastSelectedProduct && p.quantity > 0);
    if (suggestedProduct) {
      alert(`${suggestedProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
      suggestedProduct.price = Math.round(suggestedProduct.price * 0.95);
      renderProductOptions();
    }
  }
}

main();
