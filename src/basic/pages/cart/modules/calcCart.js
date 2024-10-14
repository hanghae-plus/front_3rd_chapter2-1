// 할인율 상수
import { cartItemStore, cartPointStore, cartTotalPriceStore } from '../store.js';

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

export function calcCart() {
  const { cartItems } = cartItemStore.getState();
  let totalPrice = 0;
  let totalQuantity = 0;
  let subTotal = 0;
  let discountRate = 0;

  // 각 상품의 가격 및 수량 계산
  cartItems.forEach((cartItem) => {
    const cartSelectQuantity = cartItem.selectQuantity;
    const cartTotalPrice = cartItem.price * cartSelectQuantity;
    const discount = getItemDiscount(cartItem, cartSelectQuantity);

    subTotal += cartTotalPrice;
    totalQuantity += cartSelectQuantity;
    totalPrice += cartTotalPrice * (1 - discount);
  });

  // 대량 구매 할인율 계산
  discountRate = calculateBulkDiscount(subTotal, totalPrice, totalQuantity);

  // 화요일 할인 적용
  const { finalTotalPrice, finalDiscountRate } = applyTuesdayDiscount(totalPrice, discountRate);

  console.log(finalDiscountRate, 'finalDiscountRate');

  // 포인트 계산
  const rewardPoints = calculateRewardPoints(totalPrice);

  // 최종적으로 상태 업데이트를 한 번에 처리
  cartTotalPriceStore.setState({
    totalPrice: finalTotalPrice,
    discountRate: finalDiscountRate,
  });

  cartPointStore.setState({
    rewardPoints,
  });
}

function getItemDiscount(curItem, quantity) {
  return quantity >= 10 ? DISCOUNT_RATES[curItem.id] || 0 : 0;
}

// 대량 구매 할인 계산 함수
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

// 화요일 할인 적용 함수
function applyTuesdayDiscount(totalPrice, discountRate) {
  const dayIndex = new Date().getDay();
  if (dayIndex === TUESDAY_DAY_INDEX) {
    totalPrice *= 1 - TUESDAY_DISCOUNT_RATE;
    // 할인율 업데이트: 더 큰 할인율을 적용
    discountRate = Math.max(discountRate, TUESDAY_DISCOUNT_RATE);
  }
  return { finalTotalPrice: totalPrice, finalDiscountRate: discountRate };
}

// 보상 포인트 계산 함수
function calculateRewardPoints(totalPrice) {
  return Math.floor(totalPrice / 1000); // 예: 1000원당 1포인트
}
