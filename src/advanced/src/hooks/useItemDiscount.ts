export const DISCOUNT_RATES = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};

export const useItemDiscount = (curItem, quantity) => {
  return quantity >= 10 ? DISCOUNT_RATES[curItem.id] || 0 : 0;
};
