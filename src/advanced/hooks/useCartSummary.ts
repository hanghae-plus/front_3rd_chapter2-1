import { useCallback, useEffect, useState } from 'react';
import { CartSummaryType, DEFAULT_CART_TOTAL } from '../model/cartSummary';
import { CartItemType, CartListType } from '../model/product';

// 수량 할인
const QUANTITY_DISCOUNT = {
  THRESHOLD: 10,
  RATE: {
    p1: 0.1,
    p2: 0.15,
    p3: 0.2,
    p4: 0.05,
    p5: 0.25,
  },
} as const;

// 대량 구매 할인
const BULK_DISCOUNT = {
  THRESHOLD: 30,
  RATE: 0.25,
};

const TUESDAY_DISCOUNT_RATE = 0.1; // 화요일 특별 할인율
const LOYALTY_POINT_CONVERSION = 1000; // 포인트 환산 기준 금액

/**
 * 장바구니의 가격 합계와 할인율 계산하는 훅
 */
export const useCartSummary = (cartList: CartListType) => {
  const [cartSummary, setCartSummary] =
    useState<CartSummaryType>(DEFAULT_CART_TOTAL);

  /** 상품의 할인율 계산 */
  const calculateDiscountRate = useCallback(
    (id: keyof typeof QUANTITY_DISCOUNT.RATE, quantity: number) => {
      return quantity >= QUANTITY_DISCOUNT.THRESHOLD
        ? QUANTITY_DISCOUNT.RATE[id] || 0
        : 0;
    },
    []
  );

  /** 개별 장바구니 항목의 최종 가격 계산 */
  const calculateCartItemPrice = useCallback(
    (item: CartItemType) => {
      const discountRate = calculateDiscountRate(
        item.id as keyof typeof QUANTITY_DISCOUNT.RATE,
        item.quantity
      );
      return item.price * item.quantity * (1 - discountRate);
    },
    [calculateDiscountRate]
  );

  /** 장바구니 내 모든 항목의 합계를 계산 */
  const calculateTotals = useCallback(() => {
    return cartList.reduce(
      (totals, cartItem) => {
        const itemTotalPrice = calculateCartItemPrice(cartItem);
        const itemSubTotal = cartItem.price * cartItem.quantity;

        return {
          totalPrice: totals.totalPrice + itemTotalPrice,
          subTotal: totals.subTotal + itemSubTotal,
          totalQuantity: totals.totalQuantity + cartItem.quantity,
        };
      },
      { totalPrice: 0, subTotal: 0, totalQuantity: 0 }
    );
  }, [cartList, calculateCartItemPrice]);

  /** 장바구니에 할인 적용 */
  const applyDiscounts = useCallback(
    (subTotal: number, totalPrice: number, totalQuantity: number) => {
      const bulkDiscount =
        totalQuantity >= BULK_DISCOUNT.THRESHOLD ? BULK_DISCOUNT.RATE : 0;
      const calculatedDiscountRate =
        bulkDiscount > 0 ? bulkDiscount : (subTotal - totalPrice) / subTotal;

      let finalPrice = totalPrice;
      let finalDiscountRate = calculatedDiscountRate;

      // 화요일 특별 할인 적용
      if (new Date().getDay() === 2) {
        finalPrice *= 1 - TUESDAY_DISCOUNT_RATE; // 10% 할인 적용
        finalDiscountRate = Math.max(finalDiscountRate, TUESDAY_DISCOUNT_RATE);
      }

      return { finalPrice, finalDiscountRate };
    },
    []
  );

  useEffect(() => {
    const { totalPrice, subTotal, totalQuantity } = calculateTotals();
    const { finalPrice, finalDiscountRate } = applyDiscounts(
      subTotal,
      totalPrice,
      totalQuantity
    );

    setCartSummary((prevCartTotal) => ({
      discountRate: finalDiscountRate,
      totalPrice: finalPrice,
      point:
        prevCartTotal.point + Math.floor(finalPrice / LOYALTY_POINT_CONVERSION),
    }));
  }, [cartList, calculateTotals, applyDiscounts]);

  return cartSummary;
};
