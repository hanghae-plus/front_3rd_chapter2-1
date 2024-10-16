let $productSelect, $addButton, $cartItems, $cartTotal, $stockStatus;
let lastSelectedProductId,
  bonusPoints = 0,
  totalAmount = 0,
  itemCount = 0;

const productList = [
  { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
  { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
  { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
  { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
  { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
];

const handleTimerFlashSale = () => {
  const FLASH_SALE_INTERVAL = 30000;
  const FLASH_SALE_CHANCE = 0.3;
  const FLASH_SALE_DISCOUNT = 0.8;

  setInterval(() => {
    const saleItem =
      productList[Math.floor(Math.random() * productList.length)];
    const canStartFlashSale =
      Math.random() < FLASH_SALE_CHANCE && saleItem.quantity > 0;
    if (canStartFlashSale) {
      saleItem.price = Math.round(saleItem.price * FLASH_SALE_DISCOUNT);
      alert(`번개세일! ${saleItem.name}이(가) 20% 할인 중입니다!`);
      updateProductOptions();
    }
  }, FLASH_SALE_INTERVAL);
};

const handleTimerSuggestion = () => {
  const SUGGESTION_INTERVAL = 60000;
  const SUGGESTION_DISCOUNT = 0.95;

  setInterval(() => {
    if (lastSelectedProductId) {
      const suggestedProduct = productList.find(
        (product) =>
          product.id !== lastSelectedProductId && product.quantity > 0,
      );
      if (suggestedProduct) {
        alert(
          `${suggestedProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`,
        );
        suggestedProduct.price = Math.round(
          suggestedProduct.price * SUGGESTION_DISCOUNT,
        );
        updateProductOptions();
      }
    }
  }, SUGGESTION_INTERVAL);
};

const cartHTML = () => {
  return /* HTML */ `
    <div class="bg-gray-100 p-8">
      <div
        class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8"
      >
        <h1 class="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items"></div>
        <div id="cart-total" class="text-xl font-bold my-4"></div>
        <select id="product-select" class="border rounded p-2 mr-2"></select>
        <button
          id="add-to-cart"
          class="bg-blue-500 text-white px-4 py-2 rounded"
        >
          추가
        </button>
        <div id="stock-status" class="text-sm text-gray-500 mt-2"></div>
      </div>
    </div>
  `;
};

const main = () => {
  const $root = document.getElementById('app');
  $root.innerHTML = cartHTML();
  $cartItems = document.getElementById('cart-items');
  $cartTotal = document.getElementById('cart-total');
  $productSelect = document.getElementById('product-select');
  $addButton = document.getElementById('add-to-cart');
  $stockStatus = document.getElementById('stock-status');

  updateProductOptions();
  calcCart();

  setTimeout(handleTimerFlashSale, Math.random() * 10000);
  setTimeout(handleTimerSuggestion, Math.random() * 20000);
};

const updateProductOptions = () => {
  $productSelect.innerHTML = '';
  productList.forEach((product) => {
    const $option = document.createElement('option');
    $option.value = product.id;

    $option.textContent = product.name + ' - ' + product.price + '원';
    if (product.quantity === 0) $option.disabled = true;
    $productSelect.appendChild($option);
  });
};

const calcCart = () => {
  totalAmount = 0;
  itemCount = 0;
  const cartItems = $cartItems.children;
  let subTot = 0;
  for (let i = 0; i < cartItems.length; i++) {
    const cartItem = cartItems[i];
    const currentProduct = productList.find(
      (product) => product.id === cartItem.id,
    );

    if (!currentProduct) return;

    const quantity = parseInt(
      cartItems[i].querySelector('span').textContent.split('x ')[1],
    );
    const productTotalPrice = currentProduct.price * quantity;
    const discount = getDiscount(currentProduct, quantity);

    itemCount += quantity;
    subTot += productTotalPrice;
    totalAmount += productTotalPrice * (1 - discount);
  }
  let discountRate = getDiscountRate(itemCount, subTot, totalAmount);
  discountRate = applyTuesdayDiscount(totalAmount, discountRate);

  updateCartTotal(discountRate);
  updateStockInfo();
  calculateBonusPoints();
  updateBonusPoints(bonusPoints);
};

const getDiscount = (product, quantity) => {
  if (quantity >= 10) {
    switch (product.id) {
      case 'p1':
        return 0.1;
      case 'p2':
        return 0.15;
      case 'p3':
        return 0.2;
      case 'p4':
        return 0.05;
      case 'p5':
        return 0.25;
      default:
        return 0;
    }
  }
  return 0;
};

const applyTuesdayDiscount = (totalAmount, discountRate) => {
  if (new Date().getDay() === 2) {
    totalAmount *= 1 - 0.1;
    return (discountRate = Math.max(discountRate, 0.1));
  }
  return discountRate;
};

const getDiscountRate = (itemCount, subtotal, totalAmount) => {
  if (itemCount >= 30) {
    const bulkDiscount = subtotal * 0.25;
    const itemDiscount = subtotal - totalAmount;
    if (bulkDiscount > itemDiscount) {
      totalAmount = subtotal * (1 - 0.25);
      return 0.25;
    }
    return (subtotal - totalAmount) / subtotal;
  }
  return (subtotal - totalAmount) / subtotal;
};

const updateCartTotal = (discountRate) => {
  $cartTotal.textContent = '총액: ' + Math.round(totalAmount) + '원';
  if (discountRate > 0) {
    const span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
    $cartTotal.appendChild(span);
  }
};

const calculateBonusPoints = () => {
  bonusPoints += Math.floor(totalAmount / 1000);
};

const updateBonusPoints = (bonusPoints) => {
  let pointsTag = document.getElementById('loyalty-points');
  if (!pointsTag) {
    pointsTag = document.createElement('span');
    pointsTag.id = 'loyalty-points';
    pointsTag.className = 'text-blue-500 ml-2';
    $cartTotal.appendChild(pointsTag);
  }
  pointsTag.textContent = '(포인트: ' + bonusPoints + ')';
};

const updateStockInfo = () => {
  let infoMessage = '';
  productList.forEach((product) => {
    if (product.quantity < 5) {
      infoMessage +=
        product.name +
        ': ' +
        (product.quantity > 0
          ? '재고 부족 (' + product.quantity + '개 남음)'
          : '품절') +
        '\n';
    }
  });
  $stockStatus.textContent = infoMessage;
};

main();

const handleClickAddToCart = () => {
  const selectedProductId = $productSelect.value;
  const itemToAdd = findProductById(selectedProductId);

  if (!itemToAdd || itemToAdd.quantity <= 0) return;

  const existingCartItem = document.getElementById(itemToAdd.id);

  if (existingCartItem) {
    updateExistingCartItem(existingCartItem, itemToAdd);
  } else {
    addNewCartItem(itemToAdd);
  }

  calcCart();
  lastSelectedProductId = selectedProductId;
};

const findProductById = (id) => productList.find((p) => p.id === id);

const updateExistingCartItem = (cartItem, product) => {
  const quantitySpan = cartItem.querySelector('span');
  const currentQuantity = parseInt(quantitySpan.textContent.split('x ')[1]);
  const newQuantity = currentQuantity + 1;

  if (newQuantity <= product.quantity) {
    quantitySpan.textContent = `${product.name} - ${product.price}원 x ${newQuantity}`;
    product.quantity--;
  } else {
    alert('재고가 부족합니다.');
  }
};

const addNewCartItem = (product) => {
  const newItem = updateCartItem(product);
  $cartItems.innerHTML += newItem;
  product.quantity--;
};

const updateCartItem = (product) => {
  return /* HTML */ `<div
    class="flex justify-between items-center mb-2"
    id="${product.id}"
  >
    <span>${product.name} - ${product.price}원 x 1</span>
    <div>
      <button
        class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
        data-product-id="${product.id}"
        data-change="-1"
      >
        -
      </button>
      <button
        class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
        data-product-id="${product.id}"
        data-change="1"
      >
        +
      </button>
      <button
        class="remove-item bg-red-500 text-white px-2 py-1 rounded"
        data-product-id="${product.id}"
      >
        삭제
      </button>
    </div>
  </div> `;
};

const handleClickCartAction = (event) => {
  const eventTarget = event.target;

  if (!isCartActionButton(eventTarget)) return;

  const productId = eventTarget.dataset.productId;
  const cartItem = document.getElementById(productId);
  const product = findProductById(productId);

  if (eventTarget.classList.contains('quantity-change')) {
    updateItemQuantity(eventTarget, cartItem, product);
  } else if (eventTarget.classList.contains('remove-item')) {
    removeItem(cartItem, product);
  }

  calcCart();
};

const isCartActionButton = (target) =>
  target.classList.contains('quantity-change') ||
  target.classList.contains('remove-item');

const updateItemQuantity = (button, cartItem, product) => {
  const quantityChange = parseInt(button.dataset.change);
  const currentQuantity = getCurrentQuantity(cartItem);
  const newQuantity = currentQuantity + quantityChange;
  const isValidQuantityChange =
    newQuantity > 0 && newQuantity <= product.quantity + currentQuantity;

  if (isValidQuantityChange) {
    updateCartItemQuantity(cartItem, product, newQuantity);
    product.quantity -= quantityChange;
  } else if (newQuantity <= 0) {
    removeCartItem(cartItem);
    product.quantity += currentQuantity;
  } else {
    alert('재고가 부족합니다.');
  }
};

const getCurrentQuantity = (cartItem) =>
  parseInt(cartItem.querySelector('span').textContent.split('x ')[1]);

const updateCartItemQuantity = (cartItem, product, newQuantity) => {
  const spanElement = cartItem.querySelector('span');
  spanElement.textContent = `${product.name} - ${product.price}원 x ${newQuantity}`;
};

const removeCartItem = (cartItem) => cartItem.remove();

const removeItem = (cartItem, product) => {
  const removedQuantity = getCurrentQuantity(cartItem);
  product.quantity += removedQuantity;
  removeCartItem(cartItem);
};

$addButton.addEventListener('click', handleClickAddToCart);

$cartItems.addEventListener('click', handleClickCartAction);
