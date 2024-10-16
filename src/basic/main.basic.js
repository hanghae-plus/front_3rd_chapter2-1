// 매직 넘버, 상수값, 대문자에 underbar

const OUT_OF_STOCK_ALERT_QUANTITY = 5;
const BULK_PURCHASE_COUNT = 30;
const FOCUSED_PURCHASE_COUNT = 10;

const LUCKY_EVENT_DISCOUNT_RATE = 0.2;
const LAST_TIME_DISCOUNT_RATE = 0.05;
const BULK_PURCHASE_DISCOUNT_RATE = 0.25;
const TUESDAY_DISCOUNT_RATE = 0.1;

const products = [
  { id: 'p1', name: '상품1', val: 10000, q: 50 },
  { id: 'p2', name: '상품2', val: 20000, q: 30 },
  { id: 'p3', name: '상품3', val: 30000, q: 20 },
  { id: 'p4', name: '상품4', val: 15000, q: 0 },
  { id: 'p5', name: '상품5', val: 25000, q: 10 },
];

let productSelectElement,
  addCartButton,
  cartElement,
  totalAmountElement,
  stockInfoElement;

let userLastSelectedProductId,
  bonusPoint = 0,
  totalAmount = 0,
  itemCount = 0;

// Event Scheduler

const luckyEventScheduler = () => {
  setTimeout(() => {
    setInterval(() => {
      const randomIndex = Math.floor(Math.random() * products.length);
      const targetProduct = products[randomIndex];

      const isLuckyTime = Math.random() < 0.3 && targetProduct.q > 0;
      if (!isLuckyTime) return;

      const { val, name } = targetProduct;
      targetProduct.val = Math.round(val * (1 - LUCKY_EVENT_DISCOUNT_RATE));

      alert(`번개세일! ${name}이(가) 20% 할인 중입니다!`);
      renderProducts();
    }, 30000);
  }, Math.random() * 10000);
};

const lastTimeEventScheduler = () => {
  setTimeout(() => {
    setInterval(() => {
      if (!userLastSelectedProductId) return;

      const targetProduct = products.find(
        ({ id, q: quantity }) =>
          id !== userLastSelectedProductId && quantity > 0
      );
      if (!targetProduct) return;

      const { name, val: price } = targetProduct;
      targetProduct.val = Math.round(price * (1 - LAST_TIME_DISCOUNT_RATE));

      alert(name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
      renderProducts();
    }, 60000);
  }, Math.random() * 20000);
};

// Business Logics

const findItemDiscountRate = (itemId, quantity) => {
  const isFocusedPurchase = quantity >= FOCUSED_PURCHASE_COUNT;

  if (!isFocusedPurchase) return 0;

  if (itemId === 'p1') return 0.1;
  if (itemId === 'p2') return 0.15;
  if (itemId === 'p3') return 0.2;
  if (itemId === 'p4') return 0.05;
  if (itemId === 'p5') return 0.25;

  return 0;
};

const calculateFromCart = () => {
  // clean-up
  totalAmount = 0;
  itemCount = 0;

  const cartItemElements = [...cartElement.children];

  const totalRegularAmount = cartItemElements.reduce((total, element) => {
    const quantity = parseInt(
      element.querySelector('span').textContent.split('x ')[1]
    );
    const { id: productId, val: productPrice } = products.find(
      ({ id }) => id === element.id
    );

    const productTotalAmount = productPrice * quantity;
    const productDiscountRate = findItemDiscountRate(productId, quantity);

    totalAmount += productTotalAmount * (1 - productDiscountRate);
    itemCount += quantity;

    return (total += productTotalAmount);
  }, 0);

  const totalDiscountAmount = totalRegularAmount - totalAmount;
  let discountRate = totalDiscountAmount / totalRegularAmount;

  const isTuesday = new Date().getDay() === 2;
  const isBulkPurchase = itemCount >= BULK_PURCHASE_COUNT;
  let isDiscounted = false;

  if (isBulkPurchase) {
    const maxDiscountAmount = totalAmount * BULK_PURCHASE_DISCOUNT_RATE;
    const isOverDiscount = maxDiscountAmount > totalDiscountAmount;

    if (isOverDiscount) {
      totalAmount = totalRegularAmount * (1 - BULK_PURCHASE_DISCOUNT_RATE);
      discountRate = BULK_PURCHASE_DISCOUNT_RATE;
    }
  }

  if (isTuesday) {
    totalAmount *= 1 - TUESDAY_DISCOUNT_RATE;
    discountRate = Math.max(discountRate, TUESDAY_DISCOUNT_RATE);
  }

  totalAmountElement.textContent = `총액: ${Math.round(totalAmount)}원`;
  isDiscounted = discountRate > 0;

  if (isDiscounted) {
    const formattedDiscountRate = `${(discountRate * 100).toFixed(1)}%`;

    const discountInfoElement = document.createElement('span');
    discountInfoElement.className = 'text-green-500 ml-2';
    discountInfoElement.textContent = `(${formattedDiscountRate} 할인 적용)`;

    totalAmountElement.appendChild(discountInfoElement);
  }

  renderStockInfo();
  renderBonusPoint();
};

// Render Functions

const renderProducts = () => {
  // clean-up
  productSelectElement.innerHTML = '';

  products.forEach(({ name, id, val: price, q: quantity }) => {
    const isOutOfStock = quantity === 0;

    const option = document.createElement('option');
    option.value = id;
    option.textContent = `${name} - ${price}원`;

    if (isOutOfStock) option.disabled = true;

    productSelectElement.appendChild(option);
  });
};

const renderBonusPoint = () => {
  bonusPoint += Math.floor(totalAmount / 1000);

  let element = document.getElementById('loyalty-points');
  if (!element) {
    element = document.createElement('span');
    element.id = 'loyalty-points';
    element.className = 'text-blue-500 ml-2';

    totalAmountElement.appendChild(element);
  }

  element.textContent = `(포인트: ${bonusPoint})`;
};

const renderStockInfo = () => {
  const message = products
    .map(({ name, q: quantity }) => {
      const isOutOfStock = quantity === 0;
      const isStockRangeReached =
        quantity > 0 && quantity < OUT_OF_STOCK_ALERT_QUANTITY;

      if (isOutOfStock) return `${name}: 품절`;
      if (isStockRangeReached) return `${name}: 재고 부족 (${quantity}개 남음)`;

      return '';
    })
    .join(' ');

  stockInfoElement.textContent = message;
};

// Main

const main = () => {
  const root = document.getElementById('app');

  const container = document.createElement('div');
  container.className = 'bg-gray-100 p-8';

  const wrapper = document.createElement('div');
  wrapper.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';

  const title = document.createElement('h1');
  title.className = 'text-2xl font-bold mb-4';
  title.textContent = '장바구니';

  cartElement = document.createElement('div');
  cartElement.id = 'cart-items';

  totalAmountElement = document.createElement('div');
  totalAmountElement.id = 'cart-total';
  totalAmountElement.className = 'text-xl font-bold my-4';

  productSelectElement = document.createElement('select');
  productSelectElement.id = 'product-select';
  productSelectElement.className = 'border rounded p-2 mr-2';

  addCartButton = document.createElement('button');
  addCartButton.id = 'add-to-cart';
  addCartButton.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  addCartButton.textContent = '추가';

  stockInfoElement = document.createElement('div');
  stockInfoElement.id = 'stock-status';
  stockInfoElement.className = 'text-sm text-gray-500 mt-2';

  wrapper.appendChild(title);
  wrapper.appendChild(cartElement);
  wrapper.appendChild(totalAmountElement);
  wrapper.appendChild(productSelectElement);
  wrapper.appendChild(addCartButton);
  wrapper.appendChild(stockInfoElement);

  container.appendChild(wrapper);

  root.appendChild(container);

  renderProducts();
  calculateFromCart();

  luckyEventScheduler();
  lastTimeEventScheduler();
};

main();

// Event Listeners

addCartButton.addEventListener('click', () => {
  const selectedProductId = productSelectElement.value;

  const targetProduct = products.find(({ id }) => id === selectedProductId);
  const isTargetProductInStock = targetProduct && targetProduct.q > 0;

  if (!isTargetProductInStock) return;

  const { name, val, id, q } = targetProduct;
  const targetProductElement = document.getElementById(id);

  if (!targetProductElement) {
    const cartItemElement = document.createElement('div');
    cartItemElement.id = id;
    cartItemElement.className = 'flex justify-between items-center mb-2';

    const cartItemQuantityElement = document.createElement('span');
    cartItemQuantityElement.textContent = `${name} - ${val}원 x 1`;

    const cartItemActionsElement = document.createElement('div');

    const addButtonElement = document.createElement('button');
    addButtonElement.className =
      'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1';
    addButtonElement.dataset.change = '1';
    addButtonElement.dataset.productId = id;
    addButtonElement.textContent = '+';

    const minusButtonElement = document.createElement('button');
    minusButtonElement.className =
      'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1';
    minusButtonElement.dataset.change = '-1';
    minusButtonElement.dataset.productId = id;
    minusButtonElement.textContent = '-';

    const removeButtonElement = document.createElement('button');
    removeButtonElement.className =
      'remove-item bg-red-500 text-white px-2 py-1 rounded';
    removeButtonElement.dataset.productId = id;
    removeButtonElement.textContent = '삭제';

    cartItemActionsElement.appendChild(addButtonElement);
    cartItemActionsElement.appendChild(minusButtonElement);
    cartItemActionsElement.appendChild(removeButtonElement);

    cartItemElement.appendChild(cartItemQuantityElement);
    cartItemElement.appendChild(cartItemActionsElement);

    cartElement.appendChild(cartItemElement);

    targetProduct.q--;
    calculateFromCart();
    userLastSelectedProductId = selectedProductId;

    return;
  }

  const targetProductOrderQuantity = parseInt(
    targetProductElement.querySelector('span').textContent.split('x ')[1]
  );

  const isOutOfStock = targetProductOrderQuantity + 1 > q;

  if (isOutOfStock) {
    alert('재고가 부족합니다.');
    return;
  }

  targetProductElement.querySelector('span').textContent =
    `${name} - ${val}원 x ${targetProductOrderQuantity + 1}`;

  targetProduct.q--;
  calculateFromCart();
  userLastSelectedProductId = selectedProductId;
});

cartElement.addEventListener('click', (event) => {
  const { target } = event;

  const isCartItemActionClicked =
    target.classList.contains('quantity-change') ||
    target.classList.contains('remove-item');

  if (!isCartItemActionClicked) return;

  const isQuantityButtonClicked = target.classList.contains('quantity-change');
  const isRemoveButtonClicked = target.classList.contains('remove-item');

  const { productId, change } = target.dataset;
  const product = products.find(({ id }) => id === productId);
  const cartItemElement = document.getElementById(productId);

  const [cartItemName, cartItemQuantity] = cartItemElement
    .querySelector('span')
    .textContent.split('x ');

  if (isQuantityButtonClicked) {
    const quantityDelta = parseInt(change);
    const calculatedQuantity = parseInt(cartItemQuantity) + quantityDelta;

    const isCalculatedUnderZero = calculatedQuantity <= 0;
    const isOutOfStock =
      calculatedQuantity > product.q + parseInt(cartItemQuantity);

    if (isCalculatedUnderZero) {
      product.q -= quantityDelta;
      cartItemElement.remove();
    }

    if (isOutOfStock) {
      alert('재고가 부족합니다.');
    } else {
      cartItemElement.querySelector('span').textContent =
        `${cartItemName}x ${calculatedQuantity}`;
      product.q -= quantityDelta;
    }
  }

  if (isRemoveButtonClicked) {
    const recoverQuantity = parseInt(cartItemQuantity);
    product.q += recoverQuantity;
    cartItemElement.remove();
  }

  calculateFromCart();
});
