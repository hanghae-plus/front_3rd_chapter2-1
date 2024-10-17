/////////////DOM 요소 관리/////////////
// DOM 요소
const elements = {
  root: document.getElementById('app'),
  cartItems: null,
  cartTotal: null,
  productSelect: null,
  addToCartButton: null,
  stockStatus: null,
};

// element 생성 함수
const createElement = (tag, className = '', textContent = '', id = '') => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (textContent) element.textContent = textContent;
  if (id) element.id = id;
  return element;
};

// DOM 구조 생성
const createDOMStructure = () => {
  const container = createElement('div', 'bg-gray-100 p-8');
  const wrapper = createElement(
    'div',
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8'
  );
  const title = createElement('h1', 'text-2xl font-bold mb-4', '장바구니');

  elements.cartItems = createElement('div', '', '', 'cart-items');
  elements.cartTotal = createElement(
    'div',
    'text-xl font-bold my-4',
    '',
    'cart-total'
  );
  elements.productSelect = createElement(
    'select',
    'border rounded p-2 mr-2',
    '',
    'product-select'
  );
  elements.addToCartButton = createElement(
    'button',
    'bg-blue-500 text-white px-4 py-2 rounded',
    '추가',
    'add-to-cart'
  );
  elements.stockStatus = createElement(
    'div',
    'text-sm text-gray-500 mt-2',
    '',
    'stock-status'
  );

  wrapper.append(
    title,
    elements.cartItems,
    elements.cartTotal,
    elements.productSelect,
    elements.addToCartButton,
    elements.stockStatus
  );
  container.appendChild(wrapper);
  elements.root.appendChild(container);
};

// 상품 목록
const productList = [
  { id: 'p1', name: '상품1', price: 10000, stock: 50 },
  { id: 'p2', name: '상품2', price: 20000, stock: 30 },
  { id: 'p3', name: '상품3', price: 30000, stock: 20 },
  { id: 'p4', name: '상품4', price: 15000, stock: 0 },
  { id: 'p5', name: '상품5', price: 25000, stock: 10 },
];

// ID로 상품 찾기
const findProductById = (id) => productList.find((p) => p.id === id);

// 상품 옵션 업데이트
const updateProductOptions = () => {
  elements.productSelect.innerHTML = '';

  productList.forEach((item) => {
    const option = createElement('option');
    option.value = item.id;
    option.textContent = `${item.name} - ${item.price}원`;
    option.disabled = item.stock === 0;

    elements.productSelect.appendChild(option);
  });
};

// 재고 정보 업데이트
const updateStockInfo = () => {
  const lowStockItems = productList
    .filter((item) => item.stock < 5)
    .map(
      (item) =>
        `${item.name}: ${
          item.stock > 0 ? `재고 부족 (${item.stock}개 남음)` : '품절'
        }`
    )
    .join('\n');

  elements.stockStatus.textContent = lowStockItems;
};

// 장바구니 상태
const cartState = {
  lastSelected: null,
  bonusPoints: 0,
  totalAmount: 0,
  itemCount: 0,
};

// 장바구니 계산
const calculateCart = () => {
  let { totalAmount, itemCount, subTotal } = calculateCartTotals();

  const discountRate = applyDiscounts(totalAmount, itemCount, subTotal);

  updateCartDisplay(totalAmount, discountRate);
  updateStockInfo();
  renderBonusPoints();
};

// 장바구니 총액 계산
const calculateCartTotals = () => {
  let totalAmount = 0;
  let itemCount = 0;
  let subTotal = 0;

  Array.from(elements.cartItems.children).forEach((cartItem) => {
    const [productId, quantity] = getProductInfoFromCartItem(cartItem);
    const product = findProductById(productId);
    const itemTotal = product.price * quantity;

    itemCount += quantity;
    subTotal += itemTotal;
    totalAmount += applyItemDiscount(itemTotal, quantity, productId);
  });

  return { totalAmount, itemCount, subTotal };
};

// 화요일 여부 확인
const isTuesday = () => new Date().getDay() === 2;
console.log('isTuesday: ', isTuesday());

// 장바구니 아이템에서 상품 정보 추출
const getProductInfoFromCartItem = (cartItem) => {
  const quantity = parseInt(
    cartItem.querySelector('span').textContent.split('x ')[1]
  );
  return [cartItem.id, quantity];
};

// 아이템별 할인 적용
const applyItemDiscount = (itemTotal, quantity, productId) => {
  let discount = 0;
  if (quantity >= 10) {
    const discountRates = { p1: 0.1, p2: 0.15, p3: 0.2, p4: 0.05, p5: 0.25 };
    discount = discountRates[productId] || 0;
  }
  return itemTotal * (1 - discount);
};

// 할인 적용
const applyDiscounts = (totalAmount, itemCount, subTotal) => {
  let discountRate = calculateDiscountRate(totalAmount, itemCount, subTotal);

  if (isTuesday()) {
    totalAmount *= 0.9;
    discountRate = Math.max(discountRate, 0.1);
  }

  cartState.totalAmount = Math.round(totalAmount);
  return discountRate;
};

// 할인율 계산
const calculateDiscountRate = (totalAmount, itemCount, subTotal) => {
  if (itemCount >= 30) {
    const bulkDiscount = totalAmount * 0.25;
    const itemDiscount = subTotal - totalAmount;
    if (bulkDiscount > itemDiscount) {
      return 0.25;
    }
  }
  return (subTotal - totalAmount) / subTotal;
};

// 장바구니 표시 업데이트
const updateCartDisplay = (totalAmount, discountRate) => {
  elements.cartTotal.textContent = `총액: ${
    totalAmount - totalAmount * discountRate
  }원`;

  if (discountRate > 0) {
    const discountSpan = createElement(
      'span',
      'text-green-500 ml-2',
      `(${(discountRate * 100).toFixed(1)}% 할인 적용)`
    );
    elements.cartTotal.appendChild(discountSpan);
  }
};

// 보너스 포인트 표시
const renderBonusPoints = () => {
  cartState.bonusPoints += Math.floor(cartState.totalAmount / 1000);
  let pointsElement = document.getElementById('loyalty-points');

  if (!pointsElement) {
    pointsElement = createElement(
      'span',
      'text-blue-500 ml-2',
      '',
      'loyalty-points'
    );
    elements.cartTotal.appendChild(pointsElement);
  }

  pointsElement.textContent = `(포인트: ${cartState.bonusPoints})`;
};

// 장바구니에 상품 추가 처리
const handleAddToCart = () => {
  const selectedProductId = elements.productSelect.value;
  const selectedProduct = findProductById(selectedProductId);

  if (selectedProduct && selectedProduct.stock > 0) {
    updateOrAddCartItem(selectedProduct);
    calculateCart();
    cartState.lastSelected = selectedProductId;
  }
};

// 수량 변경 처리
const handleQuantityChange = (cartItem, product, change) => {
  const quantitySpan = cartItem.querySelector('span');
  const currentQuantity = parseInt(quantitySpan.textContent.split('x ')[1]);
  const newQuantity = currentQuantity + change;

  if (newQuantity > 0 && newQuantity <= product.stock + currentQuantity) {
    quantitySpan.textContent = `${product.name} - ${product.price}원 x ${newQuantity}`;
    product.stock -= change;
  } else if (newQuantity <= 0) {
    cartItem.remove();
    product.stock -= change;
  } else {
    alert('재고가 부족합니다.');
  }
};

// 아이템 제거 처리
const handleRemoveItem = (cartItem, product) => {
  const quantity = parseInt(
    cartItem.querySelector('span').textContent.split('x ')[1]
  );
  product.stock += quantity;
  cartItem.remove();
};

// 장바구니 아이템 액션 처리
const handleCartItemAction = (event) => {
  const target = event.target;
  if (
    target.classList.contains('quantity-change') ||
    target.classList.contains('remove-item')
  ) {
    const productId = target.dataset.productId;
    const product = findProductById(productId);
    const cartItem = document.getElementById(productId);

    if (target.classList.contains('quantity-change')) {
      handleQuantityChange(cartItem, product, parseInt(target.dataset.change));
    } else if (target.classList.contains('remove-item')) {
      handleRemoveItem(cartItem, product);
    }

    calculateCart();
  }
};

// 이벤트 리스너 설정
const setupEventListeners = () => {
  elements.addToCartButton.addEventListener('click', handleAddToCart);
  elements.cartItems.addEventListener('click', handleCartItemAction);
};

// 새 장바구니 아이템 추가
const addNewCartItem = (product) => {
  const newItem = createElement(
    'div',
    'flex justify-between items-center mb-2'
  );
  newItem.id = product.id;
  newItem.innerHTML = `
    <span>${product.name} - ${product.price}원 x 1</span>
    <div>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="-1">-</button>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="1">+</button>
      <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${product.id}">삭제</button>
    </div>
  `;
  elements.cartItems.appendChild(newItem);
};

// 장바구니 아이템 업데이트 또는 추가
const updateOrAddCartItem = (product) => {
  const existingItem = document.getElementById(product.id);
  if (existingItem) {
    updateExistingCartItem(existingItem, product);
  } else {
    addNewCartItem(product);
  }
  product.stock--;
};

// 기존 장바구니 아이템 업데이트
const updateExistingCartItem = (item, product) => {
  const quantitySpan = item.querySelector('span');
  const currentQuantity = parseInt(quantitySpan.textContent.split('x ')[1]);
  const newQuantity = currentQuantity + 1;

  if (newQuantity <= product.stock + currentQuantity) {
    quantitySpan.textContent = `${product.name} - ${product.price}원 x ${newQuantity}`;
  } else {
    alert('재고가 부족합니다.');
  }
};

// 랜덤 이벤트 스케줄링
const scheduleRandomEvents = () => {
  setTimeout(() => {
    setInterval(triggerFlashSale, 30000);
  }, Math.random() * 10000);

  setTimeout(() => {
    setInterval(suggestProduct, 60000);
  }, Math.random() * 20000);
};

// 번개 세일 이벤트
const triggerFlashSale = () => {
  const luckyItem = productList[Math.floor(Math.random() * productList.length)];

  if (Math.random() < 0.3 && luckyItem.stock > 0) {
    luckyItem.price = Math.round(luckyItem.price * 0.8);
    alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
    updateProductOptions();
  }
};

// 상품 제안 이벤트
const suggestProduct = () => {
  if (cartState.lastSelected) {
    const suggestedProduct = productList.find(
      (item) => item.id !== cartState.lastSelected && item.stock > 0
    );
    if (suggestedProduct) {
      alert(
        `${suggestedProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`
      );
      suggestedProduct.price = Math.round(suggestedProduct.price * 0.95);
      updateProductOptions();
    }
  }
};

// 메인 함수
const main = () => {
  createDOMStructure();
  updateProductOptions();
  calculateCart();
  setupEventListeners();
  scheduleRandomEvents();
};

// 초기화
main();
