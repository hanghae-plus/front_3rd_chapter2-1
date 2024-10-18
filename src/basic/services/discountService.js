import {
  BULK_PURCHASE_THRESHOLD,
  BULK_DISCOUNT_RATE,
  TUESDAY_DISCOUNT_RATE,
  VOLUME_DISCOUNT_MINIMUM,
} from '../shared/constants.js';

const getDiscount = (product, quantity) => {
  if (quantity >= BULK_PURCHASE_THRESHOLD) {
    return product.discountRate;
  }
  return 0;
};

const applyTuesdayDiscount = (totalAmount, discountRate) => {
  const isTuesday = new Date().getDay() === 2;
  const tuesdayDiscountAmount = totalAmount * TUESDAY_DISCOUNT_RATE;
  const currentDiscountAmount = totalAmount * discountRate;

  if (isTuesday) {
    if (tuesdayDiscountAmount > currentDiscountAmount) {
      return TUESDAY_DISCOUNT_RATE;
    }
  }
  return discountRate;
};

const getDiscountRate = (productCount, subtotal, totalAmount) => {
  if (productCount >= VOLUME_DISCOUNT_MINIMUM) {
    const bulkDiscount = subtotal * BULK_DISCOUNT_RATE;
    const productDiscount = subtotal - totalAmount;

    if (bulkDiscount > productDiscount) {
      return BULK_DISCOUNT_RATE;
    }
  }
  return (subtotal - totalAmount) / subtotal;
};

export { getDiscount, applyTuesdayDiscount, getDiscountRate };
