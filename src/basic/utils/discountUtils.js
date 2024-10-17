import {
  ITEM_DISCOUNT_AMOUNT,
  ITEM_DISCOUNT_RATE,
  LUCK_DISCOUNT_PROBABILITY,
  LUCK_DISCOUNT_RATE,
  LUCK_TIME_INTERVAL,
  PRODUCT_BULK_DISCOUNT_AMOUNT,
  PRODUCT_BULK_DISCOUNT_RATE,
  SALE_DAY,
  SALE_DAY_DISCOUNT_RATE,
  SUGGEST_DISCOUNT_RATE,
  SUGGEST_TIME_INTERVAL,
} from '../constants';
import { productList } from '../data';
import { getCartInfo, updateCartInfo } from '../state';
import { updateSelectOptions } from './cartUtils';

const cartInfo = getCartInfo();

export const getProductBulkDiscountRate = (productId, quantity) => {
  if (quantity >= PRODUCT_BULK_DISCOUNT_AMOUNT) {
    return PRODUCT_BULK_DISCOUNT_RATE[productId];
  }
  return 0;
};

export const getBulkDiscountRate = (cartInfo, subTotal) => {
  if (cartInfo.itemCount >= ITEM_DISCOUNT_AMOUNT) {
    // 상품이 30개 이상일 때
    const bulkDiscount = cartInfo.totalAmount * ITEM_DISCOUNT_RATE;
    const itemDiscount = subTotal - cartInfo.totalAmount; // 상품 할인액

    if (bulkDiscount > itemDiscount) {
      cartInfo.totalAmount = subTotal * (1 - ITEM_DISCOUNT_RATE);
      return ITEM_DISCOUNT_RATE;
    } else {
      const result = itemDiscount / subTotal;
      return result;
    }
  } else {
    const result = (subTotal - cartInfo.totalAmount) / subTotal;
    return result;
  }
};

export const getSaleDayDiscountRate = (cartInfo, discountRate) => {
  if (new Date().getDay() === SALE_DAY) {
    // 화요일이면 할인
    updateCartInfo('totalAmount', cartInfo.totalAmount * (1 - SALE_DAY_DISCOUNT_RATE));
    return Math.max(discountRate, SALE_DAY_DISCOUNT_RATE);
  }
  return discountRate; // SALE_DAY가 아닌 경우 기존 할인율 유지
};

export const scheduleDiscount = () => {
  setLuckItemDiscount();
  setSuggestItemDiscount();
};

const setLuckItemDiscount = () => {
  setTimeout(() => {
    setInterval(() => {
      const luckyItem = productList[Math.floor(Math.random() * productList.length)];
      if (Math.random() < LUCK_DISCOUNT_PROBABILITY && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * LUCK_DISCOUNT_RATE);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');

        updateSelectOptions();
      }
    }, LUCK_TIME_INTERVAL);
  }, Math.random() * 10000);
};

const setSuggestItemDiscount = () => {
  setTimeout(() => {
    setInterval(() => {
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
