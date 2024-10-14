import { cartItemState, cartTotalPriceState } from '../state.js';

const DISCOUNT_RATES = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};

const BULK_DISCOUNT_THRESHOLD = 30; // 대량 구매 할인 기준 수량
const BULK_DISCOUNT_RATE = 0.25; // 대량 구매 할인율
const TUESDAY_DISCOUNT_RATE = 0.1; // 화요일 추가 할인율
const TUESDAY_DAY_INDEX = 2; // 화요일에 해당하는 요일 인덱스

function getItemDiscount(curItem, quantity) {
  return quantity >= 10 ? DISCOUNT_RATES[curItem.id] || 0 : 0;
}

function calculateBulkDiscount(subTotal, totalPrice, totalQuantity) {
  if (totalQuantity >= BULK_DISCOUNT_THRESHOLD) {
    const bulkDiscount = subTotal * BULK_DISCOUNT_RATE;
    const itemDiscount = subTotal - totalPrice;
    if (bulkDiscount > itemDiscount) {
      return BULK_DISCOUNT_RATE;
    }
    return itemDiscount / subTotal;
  }
  return (subTotal - totalPrice) / subTotal;
}

function applyTuesdayDiscount(totalPrice, discountRate) {
  const dayIndex = new Date().getDay();
  if (dayIndex === TUESDAY_DAY_INDEX) {
    totalPrice *= 1 - TUESDAY_DISCOUNT_RATE;
    discountRate = Math.max(discountRate, TUESDAY_DISCOUNT_RATE);
  }
  return { finalTotalPrice: totalPrice, finalDiscountRate: discountRate };
}

function calculateRewardPoints(totalPrice) {
  return Math.floor(totalPrice / 1000);
}

export function calculateCartTotals() {
  const { cartItems } = cartItemState.getState();
  const setCartTotalPriceState = cartTotalPriceState.setState;

  let totalPrice = 0;
  let totalQuantity = 0;
  let subTotal = 0;
  let discountRate = 0;

  cartItems.forEach((cartItem) => {
    const cartSelectQuantity = cartItem.selectQuantity;
    const cartTotalPrice = cartItem.price * cartSelectQuantity;
    const discount = getItemDiscount(cartItem, cartSelectQuantity);

    subTotal += cartTotalPrice;
    totalQuantity += cartSelectQuantity;
    totalPrice += cartTotalPrice * (1 - discount);
  });

  discountRate = calculateBulkDiscount(subTotal, totalPrice, totalQuantity);

  const { finalTotalPrice, finalDiscountRate } = applyTuesdayDiscount(totalPrice, discountRate);

  const rewardPoints = calculateRewardPoints(finalTotalPrice);

  setCartTotalPriceState((prevState) => {
    return {
      totalPrice: finalTotalPrice,
      discountRate: finalDiscountRate,
      rewardPoints: prevState.rewardPoints + rewardPoints,
    };
  });
}
