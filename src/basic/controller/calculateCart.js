import { getDiscountRate } from '../models/getDiscountRate';
import { mapCartItems } from '../models/mapCartItems';
import renderLoyaltyPoints from './renderLoyaltyPoints';
import { applyBulkDiscount } from '../models/applyBulkDiscount';
import { getSpecialDiscountRate } from '../models/getSpecialDiscountRate';
import { createSpan } from '../createElements';

const LOW_STOCK_THRESHOLD = 5;
const NO_STOCK = 0;
const FULL_PRICE_MULTIPLIER = 1;

export const updateStockInfo = (prodList, stockInfoDiv) => {
  let infoMessage = '';
  prodList.forEach((item) => {
    if (item.quantity < LOW_STOCK_THRESHOLD) {
      infoMessage += `${item.name}: ${item.quantity > NO_STOCK ? `재고 부족 (${item.quantity}개 남음)` : '품절'}\n`;
    }
  });
  stockInfoDiv.textContent = infoMessage;
};

export const updateCartDisplay = (sumDiv, totalPrice, discountRate) => {
  sumDiv.textContent = `총액: ${Math.round(totalPrice)}원`;
  if (discountRate > 0) {
    const span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = `(${(discountRate * 100).toFixed(1)}% 할인 적용)`;
    sumDiv.appendChild(span);
  }
};

export function calculateCart({ prodList, sumDiv, cartsDiv, stockInfoDiv }) {
  const carts = mapCartItems(cartsDiv, prodList);
  const count = carts.reduce((acc, item) => acc + item.quantity, NO_STOCK);
  const totalOriginPrice = carts.reduce((acc, item) => acc + item.price * item.quantity, NO_STOCK);
  const totalDiscountPrice = carts.reduce(
    (acc, item) =>
      acc + item.price * item.quantity * (FULL_PRICE_MULTIPLIER - getDiscountRate(item)),
    NO_STOCK,
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
