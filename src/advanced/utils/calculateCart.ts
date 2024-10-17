import { Cart } from '../types';

const PRODUCT_DISCOUNT_QUANTITY = 10;
const PRODUCT_DISCOUNT_RATE: { [key: string]: number } = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};
const getDiscountRate = (cart: Cart) => {
  const { id, quantity } = cart;
  let rate = 0;
  if (quantity >= PRODUCT_DISCOUNT_QUANTITY) rate = PRODUCT_DISCOUNT_RATE[id];

  return rate;
};

const BULK_DISCOUNT_QUANTITY = 30;
const BULK_DISCOUNT_RATE = 0.25;
const calculateBulkDiscount = (cartList: Cart[]) => {
  const totalCount = cartList.reduce((acc, cart) => acc + cart.quantity, 0);
  const totalOriginPrice = cartList.reduce(
    (acc, cart) => acc + cart.price * cart.quantity,
    0
  );
  let totalDiscountPrice = cartList.reduce(
    (acc, item) =>
      acc + item.price * item.quantity * (1 - getDiscountRate(item)),
    0
  );
  let rate = 0;

  if (totalCount >= BULK_DISCOUNT_QUANTITY) {
    const bulkDiscount = totalDiscountPrice * BULK_DISCOUNT_RATE;
    const itemDiscount = totalOriginPrice - totalDiscountPrice;

    if (bulkDiscount > itemDiscount) {
      totalDiscountPrice = totalOriginPrice * (1 - BULK_DISCOUNT_RATE);
      rate = BULK_DISCOUNT_RATE;
    } else rate = (totalOriginPrice - totalDiscountPrice) / totalOriginPrice;
  } else rate = (totalOriginPrice - totalDiscountPrice) / totalOriginPrice;

  rate = isNaN(rate) ? 0 : rate;

  return [rate, totalDiscountPrice];
};

const SPECIAL_DISCOUNT_DAY = 2; // 화요일
const SPECIAL_DISCOUNT_RATE = 0.1;
const calculateSpecialDiscount = (rate: number, totalPrice: number) => {
  if (new Date().getDay() === SPECIAL_DISCOUNT_DAY) {
    totalPrice *= 1 - SPECIAL_DISCOUNT_RATE;
    rate = Math.max(rate, SPECIAL_DISCOUNT_RATE);
  }

  rate = isNaN(rate) ? 0 : rate;

  return [rate, totalPrice];
};

function calculateCart(cartList: Cart[]): number[] {
  let [discountRate, totalPrice] = calculateBulkDiscount(cartList);
  [discountRate, totalPrice] = calculateSpecialDiscount(
    discountRate,
    totalPrice
  );

  return [totalPrice, discountRate];
}

export default calculateCart;
