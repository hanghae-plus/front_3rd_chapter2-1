import { productList } from '../commonData';
import {
  calculateTotalAmount,
  calculateTotalAmountWithoutDiscount,
  calculateTotalDiscountRate,
  calculateTotalQuantity,
} from './calculateUtils';
import { isTuesday } from './dateUtils';

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
  productList.forEach((product) => {
    const $option = createElement('option', {
      value: product.id,
      textContent: `${product.name} - ${product.price}원`,
      ...(product.quantity === 0 && { disabled: true }),
    });
    $productSelect.appendChild($option);
  });
}

export function getItemQuantity($cartItem) {
  return parseInt($cartItem.querySelector('span').textContent.split('x ')[1]);
}

export function renderCart($cartItemsDiv, $cartTotalDiv, $stockStatusDiv) {
  const $cartItems = $cartItemsDiv.children;
  let totalAmount = calculateTotalAmount($cartItems);
  const totalAmountWithoutDiscount =
    calculateTotalAmountWithoutDiscount($cartItems);
  const totalQuantity = calculateTotalQuantity({ $cartItems });
  const totalDiscountRate = calculateTotalDiscountRate({
    totalAmountWithoutDiscount,
    totalAmount,
    totalQuantity,
  });

  if (isTuesday()) {
    totalAmount *= 1 - TUESDAY_DISCOUNT_RATE;
  }
  $cartTotalDiv.textContent = `총액: ${Math.round(totalAmount)}원`;
  renderDiscount(totalDiscountRate, $cartTotalDiv);
  renderStockInfo($stockStatusDiv);
  renderLoyaltyPoints($cartTotalDiv, totalAmount);
}

function renderDiscount(totalDiscountRate, $cartTotalDiv) {
  if (totalDiscountRate > 0) {
    const $discountSpan = createElement('span', {
      className: 'text-green-500 ml-2',
      textContent: `(${(totalDiscountRate * 100).toFixed(1)}% 할인 적용)`,
    });
    $cartTotalDiv.appendChild($discountSpan);
  }
}

function renderLoyaltyPoints($cartTotalDiv, totalAmount) {
  loyaltyPoints += Math.floor(totalAmount / 1000);
  let $loyaltyPointsSpan = document.getElementById('loyalty-points');
  if (!$loyaltyPointsSpan) {
    $loyaltyPointsSpan = createElement('span', {
      id: 'loyalty-points',
      className: 'text-blue-500 ml-2',
    });
    $cartTotalDiv.appendChild($loyaltyPointsSpan);
  }
  $loyaltyPointsSpan.textContent = `(포인트: ${loyaltyPoints})`;
}

function renderStockInfo($stockStatusDiv) {
  const infoMessage = productList
    .filter((product) => product.quantity < 5)
    .reduce(
      (acc, cur) =>
        `${acc}${cur.name}: ${cur.quantity > 0 ? `재고 부족 (${cur.quantity}개 남음` : '품절'}\n`,
      '',
    );
  $stockStatusDiv.textContent = infoMessage;
}
