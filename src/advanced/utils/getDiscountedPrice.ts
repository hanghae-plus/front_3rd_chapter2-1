export const getDiscountedPrice = (price: number, discount: number) => {
  return Math.round(price * (1 - discount));
};
