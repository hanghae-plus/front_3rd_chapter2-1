import { DEFAULT_PRODUCT_LIST } from '../constant/defaultProducts.js';

const LUCKY_SALE_PROBABILITY = 0.3; // 번개세일 확률
const DISCOUNT_PERCENTAGE = 0.2; // 할인율 (20%)
const SALE_INTERVAL_MS = 3000; // 3초로 간격을 줄여서 테스트
const INITIAL_DELAY_MS = Math.random() * 1000; // 0~1초 랜덤 딜레이로 변경

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
