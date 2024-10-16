import {
  PRODUCT_BULK_DISCOUNT_AMOUNT,
  PRODUCT_BULK_DISCOUNT_RATE,
  SUGGEST_DISCOUNT_RATE,
  SUGGEST_TIME_INTERVAL,
  SURPRISE_DISCOUNT_PROBABILITY,
  SURPRISE_DISCOUNT_RATE,
  SURPRISE_TIME_INTERVAL,
} from '../constants';
import { productList } from '../data';
import { getCartInfo } from '../state';
import { updateSelectOptions } from './cartUtils';

const cartInfo = getCartInfo();

export const getProductBulkDiscountRate = (productId, quantity) => {
  if (quantity >= PRODUCT_BULK_DISCOUNT_AMOUNT) {
    return PRODUCT_BULK_DISCOUNT_RATE[productId];
  }
  return 0;
};

export const scheduleDiscount = () => {
  setLuckItemDiscount();
  setSuggestItemDiscount();
};

const setLuckItemDiscount = () => {
  setTimeout(() => {
    setInterval(() => {
      const luckyItem = productList[Math.floor(Math.random() * productList.length)];
      if (Math.random() < SURPRISE_DISCOUNT_PROBABILITY && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * SURPRISE_DISCOUNT_RATE);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');

        updateSelectOptions();
      }
    }, SURPRISE_TIME_INTERVAL);
  }, Math.random() * 10000);
};

const setSuggestItemDiscount = () => {
  setTimeout(function () {
    setInterval(function () {
      if (cartInfo.lastAddedProduct) {
        const suggest = productList.find((product) => {
          return product.id !== cartInfo.lastAddedProduct && product.quantity > 0;
        });
        if (suggest) {
          alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.price = Math.round(suggest.price * SUGGEST_DISCOUNT_RATE);

          updateSelectOptions();
        }
      }
    }, SUGGEST_TIME_INTERVAL);
  }, Math.random() * 20000);
};
