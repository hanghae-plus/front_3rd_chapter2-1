import { getCartInfo, updateCartInfo } from '../state';
import { productList } from '../data';
import {
  getBulkDiscountRate,
  getProductBulkDiscountRate,
  getSaleDayDiscountRate,
} from './discountUtils';
import {
  ITEM_DISCOUNT_AMOUNT,
  ITEM_DISCOUNT_RATE,
  SALE_DAY,
  SALE_DAY_DISCOUNT_RATE,
} from '../constants';
import { updateStock } from './cartUtils';

// 장바구니 정보
const cartInfo = getCartInfo();

/**
 * 장바구니 계산
 */
export const calculatorCart = () => {
  // 초기화
  updateCartInfo('totalAmount', 0);
  updateCartInfo('itemCount', 0);

  const cartItems = document.getElementById('cart-items').children;
  const cartTotal = document.getElementById('cart-total');

  let subTotal = 0;

  Array.from(cartItems).forEach((item) => {
    const { id, price } = productList.find((prod) => prod.id === item.id);

    const quantity = parseInt(item.querySelector('span').textContent.split('x ')[1]);
    const itemTotal = price * quantity;

    updateCartInfo('itemCount', cartInfo.itemCount + quantity);
    subTotal += itemTotal;

    const discount = getProductBulkDiscountRate(id, quantity);
    updateCartInfo('totalAmount', cartInfo.totalAmount + itemTotal * (1 - discount));
  });

  let discountRate = 0;

  //TODO 함수 구분할예정
  discountRate = getBulkDiscountRate(cartInfo, subTotal);
  //TODO 함수 구분할예정
  discountRate = getSaleDayDiscountRate(cartInfo, discountRate);

  cartTotal.textContent = '총액: ' + Math.round(cartInfo.totalAmount) + '원';

  if (discountRate > 0) {
    cartTotal.innerHTML += `<span class="text-green-500 ml-2">(${(discountRate * 100).toFixed(1)}% 할인 적용)</span>`;
  }
  updateStock();
  renderBonusPoint();
};

/**
 * 포인트 렌더링
 */
const renderBonusPoint = () => {
  updateCartInfo('bonusPoint', cartInfo.bonusPoint + Math.floor(cartInfo.totalAmount / 1000));

  const bonusPointElement = document.getElementById('loyalty-points');

  if (!bonusPointElement) {
    const pointText = `<span id="loyalty-points" class="text-blue-500 ml-2">(포인트: ${cartInfo.bonusPoint})</span>`;
    const cartTotal = document.getElementById('cart-total');
    cartTotal.innerHTML += pointText;
  } else {
    bonusPointElement.textContent = `(포인트: ${cartInfo.bonusPoint})`;
  }
};
