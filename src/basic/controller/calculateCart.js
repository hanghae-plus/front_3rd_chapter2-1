import {  getDiscountRate } from '../models/getDiscountRate'
import { mapCartItems } from "../models/mapCartItems";
import renderLoyaltyPoints from "./renderLoyaltyPoints";
import { applyBulkDiscount } from "../models/applyBulkDiscount";
import { getSpecialDiscountRate } from "../models/getSpecialDiscountRate";
import { createSpan } from '../createElements';

export const updateStockInfo = (prodList, stockInfoDiv) => {
  let infoMsg = '';
  prodList.forEach(item => {
    if (item.q < 5) {
      infoMsg += `${item.name}: ${item.q > 0 ? `재고 부족 (${item.q}개 남음)` : '품절'}\n`;
    }
  });
  stockInfoDiv.textContent = infoMsg;
};

export const updateCartDisplay = (sumDiv, totalPrice, discountRate) => {
  sumDiv.textContent = `총액: ${Math.round(totalPrice)}원`;
  if (discountRate > 0) {
    let span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = `(${(discountRate * 100).toFixed(1)}% 할인 적용)`;
    sumDiv.appendChild(span);
  }
};

export function calculateCart({ prodList, sumDiv, cartsDiv, stockInfoDiv }) {
  const carts = mapCartItems(cartsDiv, prodList);
  const count = carts.reduce((acc, item) => acc + item.q, 0);
  const totalOriginPrice = carts.reduce((acc, item) => acc + item.val * item.q, 0);
  const totalDiscountPrice = carts.reduce(
    (acc, item) => acc + item.val * item.q * (1 - getDiscountRate(item)),
    0
  );

  let rate = 0;
  let totalPrice = 0;
  [rate, totalPrice] = applyBulkDiscount(count, totalOriginPrice, totalDiscountPrice);
  [rate, totalPrice] = getSpecialDiscountRate(rate, totalPrice);

  sumDiv.textContent = `총액: ${Math.round(totalPrice)}원`;

  if (rate > 0) {
    let span = createSpan({
      text: `(${(rate * 100).toFixed(1)}% 할인 적용)`,
      className: 'text-green-500 ml-2',
    });
    sumDiv.appendChild(span);
  }

  updateStockInfo(prodList, stockInfoDiv);
  renderLoyaltyPoints(totalPrice, sumDiv);
}