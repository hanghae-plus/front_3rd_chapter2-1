import { productList } from '../commonData';
import { lastAddedProduct } from './eventUtils';
import { renderOptionList } from './renderUtils';

const LUCKY_DELAY_TIME = Math.random() * 10000;
const LUCKY_INTERVAL_TIME = 30000;
const LUCKY_RANDOM_RATE = 0.3;
const LUCKY_DISCOUNT_RATE = 0.2;
const SUGGEST_DELAY_TIME = Math.random() * 20000;
const SUGGEST_INTERVAL_TIME = 60000;
const SUGGEST_DISCOUNT_RATE = 0.05;

function createDelayedIntervalFunction(callback, delay, interval) {
  return function () {
    setTimeout(function () {
      setInterval(callback, interval);
    }, delay);
  };
}

function applyLuckySale($productSelect) {
  const luckyItem = productList[Math.floor(Math.random() * productList.length)];
  if (Math.random() < LUCKY_RANDOM_RATE && luckyItem.quantity > 0) {
    luckyItem.price = Math.round(luckyItem.price * (1 - LUCKY_DISCOUNT_RATE));
    alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
    renderOptionList($productSelect);
  }
}

function applySuggestItem($productSelect, lastAddedProduct) {
  if (!lastAddedProduct) return;
  const suggest = productList.find(
    (product) => product.id !== lastAddedProduct && product.quantity > 0,
  );
  if (suggest) {
    alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
    suggest.price = Math.round(suggest.price * (1 - SUGGEST_DISCOUNT_RATE));
    renderOptionList($productSelect);
  }
}

export const setLuckyTimer = ($productSelect) =>
  createDelayedIntervalFunction(
    () => applyLuckySale($productSelect),
    LUCKY_DELAY_TIME,
    LUCKY_INTERVAL_TIME,
  );

export const setSuggestTimer = ($productSelect) =>
  createDelayedIntervalFunction(
    () => applySuggestItem($productSelect, lastAddedProduct),
    SUGGEST_DELAY_TIME,
    SUGGEST_INTERVAL_TIME,
  );
