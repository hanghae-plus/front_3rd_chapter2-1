import { useCallback, useEffect, useState } from 'react';
import { CartSummaryType, DEFAULT_CART_TOTAL } from '../model/cartSummary';
import { CartItemType, CartListType } from '../model/product';

const DISCOUNTS = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
} as const;

/**
 * 장바구니의 가격 합계와 할인율 계산하는 훅입니다.
 */
export const useCartSummary = (cartList: CartListType) => {
  const [cartSummary, setCartSummary] =
    useState<CartSummaryType>(DEFAULT_CART_TOTAL);

  /** 상품의 할인율 계산 */
  const calculateDiscountRate = useCallback(
    (id: keyof typeof DISCOUNTS, quantity: number) => {
      return quantity >= 10 ? DISCOUNTS[id] || 0 : 0;
    },
    []
  );

  /** 개별 장바구니 항목의 최종 가격 계산 */
  const calculateCartItemPrice = useCallback(
    (item: CartItemType) => {
      const discountRate = calculateDiscountRate(
        item.id as keyof typeof DISCOUNTS,
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
      const bulkDiscount = totalQuantity >= 30 ? 0.25 : 0;
      const calculatedDiscountRate =
        bulkDiscount > 0 ? bulkDiscount : (subTotal - totalPrice) / subTotal;

      let finalPrice = totalPrice;
      let finalDiscountRate = calculatedDiscountRate;

      // 화요일 특별 할인 적용
      if (new Date().getDay() === 2) {
        finalPrice *= 0.9; // 10% 할인 적용
        finalDiscountRate = Math.max(finalDiscountRate, 0.1);
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
      point: prevCartTotal.point + Math.floor(finalPrice / 1000),
    }));
  }, [cartList, calculateTotals, applyDiscounts]);

  return cartSummary;
};
