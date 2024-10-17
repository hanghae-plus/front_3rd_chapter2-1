import { useCallback, useState } from 'react';

import { SALE_DAY, SALE_DAY_DISCOUNT_RATE, TOTAL_BULK_DISCOUNT_AMOUNT, TOTAL_BULK_DISCOUNT_RATE } from '../constants';
import { useCartStore } from '../stores';
import { calculateDiscountedPrice, calculateDiscountRate, getProductBulkDiscountRate } from '../utils/discount';

const useCartTotalPrice = () => {
  const storeCartItems = useCartStore((state) => state.cartItems);

  const [totalPrice, setTotalPrice] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);
  const [points, setPoints] = useState(0);

  const calculateCartTotals = () => {
    return storeCartItems.reduce(
      (acc, cartItem) => {
        const productTotalPrice = cartItem.price * cartItem.cartQuantity;
        const productBulkDiscountRate = getProductBulkDiscountRate(cartItem.id, cartItem.cartQuantity);

        return {
          totalQuantity: acc.totalQuantity + cartItem.cartQuantity,
          totalPrice: acc.totalPrice + productTotalPrice,
          productBulkDiscountedPrice:
            acc.productBulkDiscountedPrice + calculateDiscountedPrice(productTotalPrice, productBulkDiscountRate),
        };
      },
      { totalQuantity: 0, totalPrice: 0, productBulkDiscountedPrice: 0 },
    );
  };
  const calculateProductsBulkDiscountPrice = (discountedTotalPrice: number) => {
    return discountedTotalPrice * TOTAL_BULK_DISCOUNT_RATE;
  };
  const checkTotalBulkDiscountedMore = (productBulkDiscountPrice: number, productsBulkDiscountPrice: number) => {
    return productBulkDiscountPrice <= productsBulkDiscountPrice;
  };
  const calculateDayDiscountRate = () => {
    if (new Date().getDay() === SALE_DAY) return SALE_DAY_DISCOUNT_RATE;
    return 0;
  };
  const updatePoints = (points: number, totalPrice: number) => {
    return points + Math.floor(totalPrice / 1000);
  };

  const calculateDiscountedPriceAndPoints = useCallback(() => {
    let discountRate = 0;
    let discountedTotalPrice = 0;

    // 상품 할인가 계산
    const { totalQuantity, totalPrice, productBulkDiscountedPrice } = calculateCartTotals();
    if (totalQuantity === 0 && totalPrice === 0) return;

    // 상품 전체 할인가 계산
    if (totalQuantity >= TOTAL_BULK_DISCOUNT_AMOUNT) {
      const productsBulkDiscountPrice = calculateProductsBulkDiscountPrice(productBulkDiscountedPrice);
      const isTotalBulkDiscountedMore = checkTotalBulkDiscountedMore(
        totalPrice - productBulkDiscountedPrice,
        productsBulkDiscountPrice,
      );

      discountRate = isTotalBulkDiscountedMore
        ? TOTAL_BULK_DISCOUNT_RATE
        : calculateDiscountRate(totalPrice, productBulkDiscountedPrice);
    } else {
      discountRate = calculateDiscountRate(totalPrice, productBulkDiscountedPrice);
    }

    discountRate = Math.max(discountRate, calculateDayDiscountRate());
    discountedTotalPrice = calculateDiscountedPrice(totalPrice, discountRate);
    const finalPoints = updatePoints(points, discountedTotalPrice);

    // 최종 setState
    setTotalPrice(discountedTotalPrice);
    setDiscountRate(discountRate);
    setPoints(finalPoints);
  }, [storeCartItems]);

  return { totalPrice, discountRate, points, calculateDiscountedPriceAndPoints };
};

export default useCartTotalPrice;
