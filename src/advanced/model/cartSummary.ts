export type CartSummaryType = {
  totalPrice: number;
  discountRate: number;
  point: number;
};

export const DEFAULT_CART_TOTAL: CartSummaryType = {
  discountRate: 0,
  point: 0,
  totalPrice: 0,
};
