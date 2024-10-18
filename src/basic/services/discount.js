import {
  PRODUCT_BULK_DISCOUNT_AMOUNT,
  PRODUCT_BULK_DISCOUNT_RATE,
  SALE_DAY,
  SALE_DAY_DISCOUNT_RATE,
  SUGGEST_DISCOUNT_RATE,
  SUGGEST_TIME_INTERVAL,
  SURPRISE_DISCOUNT_PROBABILITY,
  SURPRISE_DISCOUNT_RATE,
  SURPRISE_TIME_INTERVAL,
  TOTAL_BULK_DISCOUNT_AMOUNT,
  TOTAL_BULK_DISCOUNT_RATE,
} from '../const/discount';
import { products } from '../data/products';
import { calculateDiscountedPrice, calculateDiscountRate } from '../utils/discount';
import { renderProductOptions } from '../views/product';

const setSurpriseDiscount = () => {
  setTimeout(() => {
    setInterval(() => {
      const luckyItem = products[Math.floor(Math.random() * products.length)];
      if (Math.random() < SURPRISE_DISCOUNT_PROBABILITY && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * SURPRISE_DISCOUNT_RATE);
        alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        renderProductOptions();
      }
    }, SURPRISE_TIME_INTERVAL);
  }, Math.random() * 10000);
};
const setSuggestDiscount = (lastAddedProductId) => {
  setTimeout(() => {
    setInterval(() => {
      if (lastAddedProductId) {
        const suggest = products.find((product) => {
          return product.id !== lastAddedProductId && product.quantity > 0;
        });

        if (suggest) {
          alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          suggest.price = Math.round(suggest.price * SUGGEST_DISCOUNT_RATE);
          renderProductOptions();
        }
      }
    }, SUGGEST_TIME_INTERVAL);
  }, Math.random() * 20000);
};

const calculateTotalProductsBulkDiscount = (totalItems, totalPrice, discountedTotalPrice) => {
  if (totalItems < TOTAL_BULK_DISCOUNT_AMOUNT) {
    return {
      updatedTotalPrice: discountedTotalPrice,
      discountRate: calculateDiscountRate(totalPrice, discountedTotalPrice),
    };
  }

  return getMoreDiscountPriceAndRate(discountedTotalPrice, totalPrice);
};
const calculateDayDiscount = ({ updatedTotalPrice, discountRate }) => {
  if (new Date().getDay() === SALE_DAY) {
    updatedTotalPrice = calculateDiscountedPrice(updatedTotalPrice, SALE_DAY_DISCOUNT_RATE);
    discountRate = Math.max(discountRate, SALE_DAY_DISCOUNT_RATE);
  }

  return { updatedTotalPrice, discountRate };
};

const getProductBulkDiscountRate = (productId, quantity) => {
  if (quantity >= PRODUCT_BULK_DISCOUNT_AMOUNT) return PRODUCT_BULK_DISCOUNT_RATE[productId];
  return 0;
};
const getMoreDiscountPriceAndRate = (discountedTotalPrice, totalPrice) => {
  let updatedTotalPrice = 0;
  let discountRate = 0;

  const bulkDiscountingPrice = discountedTotalPrice * TOTAL_BULK_DISCOUNT_RATE;
  const itemBulkDiscountingPrice = totalPrice - discountedTotalPrice;

  if (bulkDiscountingPrice > itemBulkDiscountingPrice) {
    updatedTotalPrice = calculateDiscountedPrice(totalPrice, TOTAL_BULK_DISCOUNT_RATE);
    discountRate = TOTAL_BULK_DISCOUNT_RATE;
  } else {
    updatedTotalPrice = discountedTotalPrice;
    discountRate = calculateDiscountRate(totalPrice, discountedTotalPrice);
  }

  return { updatedTotalPrice, discountRate };
};

export {
  setSurpriseDiscount,
  setSuggestDiscount,
  calculateDiscountedPrice,
  calculateTotalProductsBulkDiscount,
  calculateDayDiscount,
  getProductBulkDiscountRate,
};
