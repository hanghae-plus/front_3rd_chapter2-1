import { DEFAULT_PRODUCT_LIST } from '../constant/defaultProducts.js';

const LUCKY_SALE_PROBABILITY = 0.3;
const DISCOUNT_PERCENTAGE = 0.2;
const SALE_INTERVAL_MS = 3000;
const INITIAL_DELAY_MS = Math.random() * 1000;

function applyLuckySale() {
  const luckyItem = DEFAULT_PRODUCT_LIST[Math.floor(Math.random() * DEFAULT_PRODUCT_LIST.length)];

  if (Math.random() < LUCKY_SALE_PROBABILITY && luckyItem.quantity > 0) {
    luckyItem.price = Math.round(luckyItem.price * (1 - DISCOUNT_PERCENTAGE));
    alert(`번개세일! ${luckyItem.name}이(가) ${DISCOUNT_PERCENTAGE * 100}% 할인 중입니다!`);
  }
}

export function startLuckySale() {
  setTimeout(() => {
    setInterval(applyLuckySale, SALE_INTERVAL_MS);
  }, INITIAL_DELAY_MS);
}
