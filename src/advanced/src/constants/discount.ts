export const PRODUCT_DISCOUNT_RULES = {
  p1: {
    minQuantity: 10,
    rate: 0.1,
  },
  p2: {
    minQuantity: 10,
    rate: 0.15,
  },
  p3: {
    minQuantity: 10,
    rate: 0.2,
  },
  p4: {
    minQuantity: 10,
    rate: 0.05,
  },
  p5: {
    minQuantity: 10,
    rate: 0.25,
  },
};

export const WEEKDAY = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

export const WEEKDAY_DISCOUNT_RATE = {
  [WEEKDAY.MONDAY]: 0,
  [WEEKDAY.TUESDAY]: 0.1,
  [WEEKDAY.WEDNESDAY]: 0,
  [WEEKDAY.THURSDAY]: 0,
  [WEEKDAY.FRIDAY]: 0,
  [WEEKDAY.SATURDAY]: 0,
  [WEEKDAY.SUNDAY]: 0,
};
