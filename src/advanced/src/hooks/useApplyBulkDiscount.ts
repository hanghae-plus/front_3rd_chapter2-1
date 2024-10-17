export const BULK_DISCOUNT_THRESHOLD = 30;
export const BULK_DISCOUNT_RATE = 0.25;

export const useApplyBulkDiscount = (subTotal, totalPrice, totalQuantity) => {
  if (totalQuantity >= BULK_DISCOUNT_THRESHOLD) {
    const bulkDiscount = subTotal * BULK_DISCOUNT_RATE;
    const itemDiscount = subTotal - totalPrice;
    if (bulkDiscount > itemDiscount) {
      return BULK_DISCOUNT_RATE;
    }
    return itemDiscount / subTotal;
  }
  return (subTotal - totalPrice) / subTotal;
};
