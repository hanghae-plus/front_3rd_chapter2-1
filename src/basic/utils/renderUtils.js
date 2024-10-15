import { productList } from '../commonData';

const QUANTITY_FOR_DISCOUNT = 10;
const TOTAL_QUANTITY_FOR_DISCOUNT = 30;
const TOTAL_DISCOUNT_RATE = 0.25;
const TUESDAY_DISCOUNT_RATE = 0.1;

let loyaltyPoints = 0;

function createElement(tag, propertyObject) {
  const element = document.createElement(tag);
  for (const key in propertyObject) {
    element[key] = propertyObject[key];
  }
  return element;
}

export function createContainerDiv() {
  return createElement('div', { className: 'bg-gray-100 p-8' });
}

export function createWrapperDiv() {
  return createElement('div', {
    className:
      'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
  });
}

export function createTitleH1() {
  return createElement('h1', {
    className: 'text-2xl font-bold mb-4',
    textContent: '장바구니',
  });
}

export function createCartItemsDiv() {
  return createElement('div', { id: 'cart-items' });
}

export function createCartTotalDiv() {
  return createElement('div', {
    id: 'cart-total',
    className: 'text-xl font-bold my-4',
  });
}

export function createProductSelect() {
  return createElement('select', {
    id: 'product-select',
    className: 'border rounded p-2 mr-2',
  });
}

export function createAddButton() {
  return createElement('button', {
    id: 'add-to-cart',
    className: 'bg-blue-500 text-white px-4 py-2 rounded',
    textContent: '추가',
  });
}

export function createStockStatusDiv() {
  return createElement('div', {
    id: 'stock-status',
    className: 'text-sm text-gray-500 mt-2',
  });
}

export function renderOptionList($productSelect) {
  $productSelect.innerHTML = '';
  productList.forEach((item) => {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = item.name + ' - ' + item.price + '원';
    if (item.quantity === 0) option.disabled = true;
    $productSelect.appendChild(option);
  });
}

export function getItemQuantity($cartItem) {
  return parseInt($cartItem.querySelector('span').textContent.split('x ')[1]);
}

export function renderCart($cartItemsDiv, $cartTotalDiv, $stockStatusDiv) {
  let totalAmount = 0;
  const $cartItems = $cartItemsDiv.children;
  let totalAmountWithoutDiscount = 0;
  // for문. 장바구니 아이템들을 돌린다.
  // totalAmount
  for (let i = 0; i < $cartItems.length; i++) {
    const currentItem = productList.find(
      (product) => product.id === $cartItems[i].id,
    );
    const quantity = getItemQuantity($cartItems[i]);
    const itemAmount = currentItem.price * quantity;
    totalAmountWithoutDiscount += itemAmount;
    const discountRate =
      quantity >= QUANTITY_FOR_DISCOUNT ? currentItem.discountRate : 0;
    totalAmount += itemAmount * (1 - discountRate);
  }

  const totalQuantity = calculateTotalQuantity({ $cartItems });
  const totalDiscountRate = calculateTotalDiscountRate({
    totalAmountWithoutDiscount,
    totalAmount,
    totalQuantity,
  });

  if (isTuesday()) {
    totalAmount *= 1 - TUESDAY_DISCOUNT_RATE;
  }
  $cartTotalDiv.textContent = '총액: ' + Math.round(totalAmount) + '원';
  if (totalDiscountRate > 0) {
    var span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent =
      '(' + (totalDiscountRate * 100).toFixed(1) + '% 할인 적용)';
    $cartTotalDiv.appendChild(span);
  }
  updateStockInfo($stockStatusDiv);
  renderBonusPts($cartTotalDiv, totalAmount);
}

function calculateTotalQuantity({ $cartItems }) {
  return [...$cartItems].reduce((acc, cur) => acc + getItemQuantity(cur), 0);
}

function calculateTotalDiscountRate({
  totalAmountWithoutDiscount,
  totalAmount,
  totalQuantity,
}) {
  let totalDiscountRate = 0;
  const itemDiscount = totalAmountWithoutDiscount - totalAmount;
  if (totalQuantity >= TOTAL_QUANTITY_FOR_DISCOUNT) {
    const bulkDiscount = totalAmount * TOTAL_DISCOUNT_RATE;
    if (bulkDiscount > itemDiscount) {
      totalAmount = totalAmountWithoutDiscount * (1 - TOTAL_DISCOUNT_RATE);
      totalDiscountRate = TOTAL_DISCOUNT_RATE;
    } else {
      totalDiscountRate = itemDiscount / totalAmountWithoutDiscount;
    }
  } else {
    totalDiscountRate = itemDiscount / totalAmountWithoutDiscount;
  }
  if (isTuesday()) {
    totalDiscountRate = Math.max(totalDiscountRate, TUESDAY_DISCOUNT_RATE);
  }
  return totalDiscountRate;
}

function isTuesday() {
  return new Date().getDay() === 2;
}

// 포인트 문구 렌더
const renderBonusPts = ($cartTotalDiv, totalAmount) => {
  loyaltyPoints += Math.floor(totalAmount / 1000);
  var ptsTag = document.getElementById('loyalty-points');
  if (!ptsTag) {
    ptsTag = document.createElement('span');
    ptsTag.id = 'loyalty-points';
    ptsTag.className = 'text-blue-500 ml-2';
    $cartTotalDiv.appendChild(ptsTag);
  }
  ptsTag.textContent = '(포인트: ' + loyaltyPoints + ')';
};

// 상태 문구 업데이트
function updateStockInfo($stockStatusDiv) {
  var infoMsg = '';
  productList.forEach(function (item) {
    if (item.quantity < 5) {
      infoMsg +=
        item.name +
        ': ' +
        (item.quantity > 0
          ? '재고 부족 (' + item.quantity + '개 남음)'
          : '품절') +
        '\n';
    }
  });
  $stockStatusDiv.textContent = infoMsg;
}
