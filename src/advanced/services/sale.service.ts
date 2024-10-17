import { PRODUCT_LIST } from '../__tests__/productData';
import { lastAddedItem, updateSelectOptionStatus } from './render.service';

const RANDOM_RATE_LIMIT = 0.3;
const LUCKY_DISCOUNT_RATE = 0.2;
const EXTRA_DISCOUNT_RATE = 0.05;
const THIRTY_SECONDS = 30000;
const TEN_SECONDES = 10000;
const ONE_MINUTES = 60000;
const TWENTY_SECONDS = 20000;

export function applyLuckySale() {
  setTimeout(() => {
    setInterval(() => {
      const luckyRandomIdx = Math.floor(Math.random() * PRODUCT_LIST.length);
      const luckyItem = PRODUCT_LIST[luckyRandomIdx];
      const isLuckyTime = Math.random() < RANDOM_RATE_LIMIT;

      if (isLuckyTime && luckyItem.quantity > 0) {
        luckyItem.val = Math.round(luckyItem.val * (1 - LUCKY_DISCOUNT_RATE));
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateSelectOptionStatus();
      }
    }, THIRTY_SECONDS);
  }, Math.random() * TEN_SECONDES);
}

export function applyExtraSale() {
  setTimeout(() => {
    setInterval(() => {
      if (!lastAddedItem) return;

      const product = PRODUCT_LIST.find(
        (item) => item.id !== lastAddedItem && item.quantity > 0,
      );
      if (!product) return;

      alert(`${product.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
      product.val = Math.round(product.val * (1 - EXTRA_DISCOUNT_RATE));
      updateSelectOptionStatus();
    }, ONE_MINUTES);
  }, Math.random() * TWENTY_SECONDS);
}
