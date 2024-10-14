const PRODUCT_BULK_DISCOUNT_AMOUNT = 10;
const PRODUCT_BULK_DISCOUNT_RATE = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};
export const getProductBulkDiscountRate = (productId, quantity) => {
  if (quantity >= PRODUCT_BULK_DISCOUNT_AMOUNT) return PRODUCT_BULK_DISCOUNT_RATE[productId];
  return 0;
};

const calculateDiscountRate = (totalPrice, discountedTotalPrice) => (totalPrice - discountedTotalPrice) / totalPrice;
export const calculateDiscountedPrice = (price, discountRate) => price * (1 - discountRate);
export const calculateTotalProductsBulkDiscount = (totalItems, totalPrice, discountedTotalPrice) => {
  const TOTAL_BULK_DISCOUNT_AMOUNT = 30;

  if (totalItems < TOTAL_BULK_DISCOUNT_AMOUNT) {
    return {
      updatedTotalPrice: discountedTotalPrice,
      discountRate: calculateDiscountRate(totalPrice, discountedTotalPrice),
    };
  }

  return getMoreDiscountPriceAndRate(discountedTotalPrice, totalPrice);
};
export const calculateDayDiscount = ({ updatedTotalPrice, discountRate }) => {
  const SALE_DAY = 2;
  const SALE_DAY_DISCOUNT_RATE = 0.1;

  if (new Date().getDay() === SALE_DAY) {
    updatedTotalPrice = calculateDiscountedPrice(updatedTotalPrice, SALE_DAY_DISCOUNT_RATE);
    discountRate = Math.max(discountRate, SALE_DAY_DISCOUNT_RATE);
  }

  return { updatedTotalPrice, discountRate };
};

const TOTAL_BULK_DISCOUNT_RATE = 0.25;
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
