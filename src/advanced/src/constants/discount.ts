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
} as const;

export const WEEKDAY = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
} as const;

const NO_DISCOUNT = 0;

export const WEEKDAY_DISCOUNT_RATE = {
  [WEEKDAY.MONDAY]: NO_DISCOUNT,
  [WEEKDAY.TUESDAY]: 0.1,
  [WEEKDAY.WEDNESDAY]: NO_DISCOUNT,
  [WEEKDAY.THURSDAY]: NO_DISCOUNT,
  [WEEKDAY.FRIDAY]: NO_DISCOUNT,
  [WEEKDAY.SATURDAY]: NO_DISCOUNT,
  [WEEKDAY.SUNDAY]: NO_DISCOUNT,
} as const;
