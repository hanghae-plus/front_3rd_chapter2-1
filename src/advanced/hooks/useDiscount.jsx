import React from 'react';
import {
  PRODUCT_BULK_DISCOUNT_AMOUNT,
  PRODUCT_BULK_DISCOUNT_RATE,
} from '../constants/discountConstant';

export const useDiscount = () => {
  const getProductBulkDiscountRate = (productId, quantity) => {
    if (quantity >= PRODUCT_BULK_DISCOUNT_AMOUNT) {
      return PRODUCT_BULK_DISCOUNT_RATE[productId];
    }
    return 0;
  };

  return { getProductBulkDiscountRate };
};
