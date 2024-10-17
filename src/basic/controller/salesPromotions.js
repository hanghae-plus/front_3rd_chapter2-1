import { prodList } from '../constants/prodList';
import updateSelectOptions from '../views/updateSelectOptions';

const LUCKY_SALE_PROBABILITY = 0.3;
const LUCKY_SALE_DISCOUNT = 0.8;
const LUCKY_SALE_INTERVAL = 30000;
const RANDOM_DELAY = 10000;
const SUGGESTION_SALE_DISCOUNT = 0.95;
const SUGGESTION_SALE_INTERVAL = 60000;
const SUGGESTION_RANDOM_DELAY = 20000;

function applyDiscount(product, discountRate) {
  return Math.round(product.val * discountRate);
}

function notifySale(product, discountRate) {
  const discountPercentage = discountRate * 100;
  alert(`번개세일! ${product.name}이(가) ${discountPercentage}% 할인 중입니다!`);
}

function updateUI(select) {
  updateSelectOptions(select, prodList);
}

function applySuggestionDiscount(product, discountRate) {
  return Math.round(product.price * discountRate);
}

function notifySuggestion(product, discountRate) {
  const discountPercentage = (1 - discountRate) * 100;
  alert(`${product.name}은(는) 어떠세요? 지금 구매하시면 ${discountPercentage}% 추가 할인!`);
}

export function initiateLuckySale(select) {
  const randomDelay = Math.random() * RANDOM_DELAY;
  setTimeout(() => {
    const intervalId = setInterval(() => {
      const luckyItemIndex = Math.floor(Math.random() * prodList.length);
      const luckyItem = prodList[luckyItemIndex];

      if (Math.random() < LUCKY_SALE_PROBABILITY && luckyItem.quality > 0) {
        luckyItem.val = applyDiscount(luckyItem, LUCKY_SALE_DISCOUNT);
        notifySale(luckyItem, LUCKY_SALE_DISCOUNT);
        updateUI(select);
      }
    }, LUCKY_SALE_INTERVAL);

    return () => clearInterval(intervalId);
  }, randomDelay);
}

export function initiateSuggestSale(select, lastSelect) {
  const randomDelay = Math.random() * SUGGESTION_RANDOM_DELAY;
  setTimeout(() => {
    const intervalId = setInterval(() => {
      if (lastSelect) {
        const suggestion = prodList.find((item) => item.id !== lastSelect && item.quantity > 0);
        if (suggestion) {
          suggestion.price = applySuggestionDiscount(suggestion, SUGGESTION_SALE_DISCOUNT);
          notifySuggestion(suggestion, SUGGESTION_SALE_DISCOUNT);
          updateUI(select);
        }
      }
    }, SUGGESTION_SALE_INTERVAL);

    return () => clearInterval(intervalId);
  }, randomDelay);
}
