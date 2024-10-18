import { getDiscountRate } from '../models/getDiscountRate';
import { mapCartItems } from '../models/mapCartItems';
import renderLoyaltyPoints from './renderLoyaltyPoints';
import { applyBulkDiscount } from '../models/applyBulkDiscount';
import { getSpecialDiscountRate } from '../models/getSpecialDiscountRate';
import { createSpan } from '../createElements';

const LOW_STOCK_THRESHOLD = 5;
const NO_STOCK = 0;
const FULL_PRICE_MULTIPLIER = 1;

/**
 * @function updateStockInfo
 * @description 상품 목록에서 재고 정보를 확인하고, 재고가 낮거나 품절된 상품에 대한 메시지를 업데이트
 * @param {Array} prodList - 상품 목록 배열
 * @param {HTMLElement} stockInfoDiv - 재고 정보를 표시할 HTML 요소
 */

export const updateStockInfo = (prodList, stockInfoDiv) => {
  let infoMessage = '';
  prodList.forEach((item) => {
    if (item.quantity < LOW_STOCK_THRESHOLD) {
      infoMessage += `${item.name}: ${item.quantity > NO_STOCK ? `재고 부족 (${item.quantity}개 남음)` : '품절'}\n`;
    }
  });
  stockInfoDiv.textContent = infoMessage;
};

/**
 * @function updateCartDisplay
 * @description 장바구니의 총액과 적용된 할인율을 표시
 * @param {HTMLElement} sumDiv - 총액을 표시할 HTML 요소
 * @param {number} totalPrice - 계산된 총액
 * @param {number} discountRate - 적용된 할인율
 */

export const updateCartDisplay = (sumDiv, totalPrice, discountRate) => {
  sumDiv.textContent = `총액: ${Math.round(totalPrice)}원`;
  if (discountRate > 0) {
    const span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = `(${(discountRate * 100).toFixed(1)}% 할인 적용)`;
    sumDiv.appendChild(span);
  }
};

/**
 * @function calculateCart
 * @description 장바구니의 총액을 계산하고, 적용된 할인율, 재고 정보, 적립 포인트를 업데이트
 * @param {Object} params - 필요한 매개변수를 포함하는 객체
 *   @param {Array} prodList - 상품 목록 배열
 *   @param {HTMLElement} sumDiv - 총액을 표시할 HTML 요소
 *   @param {HTMLElement} cartsDiv - 장바구니의 상품 목록을 표시하는 HTML 요소
 *   @param {HTMLElement} stockInfoDiv - 재고 정보를 표시할 HTML 요소
 */

export function calculateCart({ prodList, sumDiv, cartsDiv, stockInfoDiv }) {
  const carts = mapCartItems(cartsDiv, prodList);
  const count = carts.reduce((acc, item) => acc + item.quantity, NO_STOCK);
  const totalOriginPrice = carts.reduce((acc, item) => acc + item.price * item.quantity, NO_STOCK);
  const totalDiscountPrice = carts.reduce(
    (acc, item) =>
      acc + item.price * item.quantity * (FULL_PRICE_MULTIPLIER - getDiscountRate(item)),
    NO_STOCK
  );

  let rate = 0;
  let totalPrice = 0;
  [rate, totalPrice] = applyBulkDiscount(count, totalOriginPrice, totalDiscountPrice);
  [rate, totalPrice] = getSpecialDiscountRate(rate, totalPrice);

  sumDiv.textContent = `총액: ${Math.round(totalPrice)}원`;

  if (rate > 0) {
    const span = createSpan({
      text: `(${(rate * 100).toFixed(1)}% 할인 적용)`,
      className: 'text-green-500 ml-2',
    });
    sumDiv.appendChild(span);
  }

  updateStockInfo(prodList, stockInfoDiv);
  renderLoyaltyPoints(totalPrice, sumDiv);
}
