import { cartItemState, cartTotalPriceState } from '../state.js';

// 상품별 할인율 상수
const DISCOUNT_RATES = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};

// 대량 구매 할인 기준 및 할인율 상수
const BULK_DISCOUNT_THRESHOLD = 30;
const BULK_DISCOUNT_RATE = 0.25;

// 화요일 할인 상수
const TUESDAY_DISCOUNT_RATE = 0.1;
const TUESDAY_DAY_INDEX = 2;

/**
 * 특정 상품에 대한 할인율 계산
 */
function getItemDiscount(curItem, quantity) {
  return quantity >= 10 ? DISCOUNT_RATES[curItem.id] || 0 : 0;
}

/**
 * 대량 구매에 대한 할인율 계산
 */
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

/**
 * 화요일 추가 할인이 적용되는지 확인하고, 할인율 업데이트
 */
function applyTuesdayDiscount(totalPrice, discountRate) {
  const dayIndex = new Date().getDay();
  if (dayIndex === TUESDAY_DAY_INDEX) {
    totalPrice *= 1 - TUESDAY_DISCOUNT_RATE;
    discountRate = Math.max(discountRate, TUESDAY_DISCOUNT_RATE);
  }
  return { updatedTotalPrice: totalPrice, updatedDiscountRate: discountRate };
}

/**
 * 포인트 계산 (1000원당 1포인트)
 */
function calculateRewardPoints(totalPrice) {
  return Math.floor(totalPrice / 1000);
}

/**
 * 장바구니의 총액, 할인율, 포인트 계산 및 상태 업데이트
 */
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
    const itemDiscount = getItemDiscount(cartItem, cartSelectQuantity);

    subTotal += cartTotalPrice;
    totalQuantity += cartSelectQuantity;
    totalPrice += cartTotalPrice * (1 - itemDiscount);
  });

  // 대량 구매 할인 계산
  discountRate = calculateBulkDiscount(subTotal, totalPrice, totalQuantity);

  // 화요일 할인 적용
  const { updatedTotalPrice, updatedDiscountRate } = applyTuesdayDiscount(totalPrice, discountRate);

  // 포인트 계산
  const rewardPoints = calculateRewardPoints(updatedTotalPrice);

  // 최종적으로 상태 업데이트
  setCartTotalPriceState((prevState) => ({
    totalPrice: updatedTotalPrice,
    discountRate: updatedDiscountRate,
    rewardPoints: prevState.rewardPoints + rewardPoints,
  }));
}
