import React from "react";
import { CartProductType } from "./product-container";

interface TotalCostProps {
  cartProductList: CartProductType[];
}

const PRODUCT_DISCOUNT_RATE = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};

const TotalCost = ({ cartProductList }: TotalCostProps) => {
  const calculateCartCost = () => {
    const MIN_DISCOUNT_PRODUCT_QUANTITY = 10;
    let totalCartCount = 0;
    let totalCartCost = 0;
    let totalDiscountedCost = 0;

    cartProductList.forEach(product => {
      let productPrice = product.price * product.count;

      totalCartCount += product.count;
      totalCartCost += productPrice;
      if (product.count >= MIN_DISCOUNT_PRODUCT_QUANTITY) {
        productPrice *= 1 - PRODUCT_DISCOUNT_RATE[product.id];
      }
      totalDiscountedCost += productPrice;
    });

    return { totalCartCount, totalCartCost, totalDiscountedCost };
  };

  const discountedCost = () => {
    const MIN_DISCONUT_TOTAL_QUANTITY = 30;
    const BULK_PURCHASE_DISCOUNT_RATE = 0.25;
    const TO_PERCENTAGE = 100;
    const cartTotalQuantity = cartProductList.reduce((acc, product) => {
      return acc + product.count;
    }, 0);

    const totalCost = calculateCartCost();
    let totalDiscountRate = 0;
    let finalCost = totalCost.totalDiscountedCost;

    if (cartTotalQuantity >= MIN_DISCONUT_TOTAL_QUANTITY) {
      const bulkDiscount = totalCost.totalDiscountedCost * BULK_PURCHASE_DISCOUNT_RATE;
      const productDiscount = totalCost.totalCartCost - totalCost.totalDiscountedCost;

      if (bulkDiscount > productDiscount) {
        finalCost = totalCost.totalCartCost * (1 - BULK_PURCHASE_DISCOUNT_RATE);
        totalDiscountRate = BULK_PURCHASE_DISCOUNT_RATE;
      } else {
        totalDiscountRate = 1 - totalCost.totalDiscountedCost / totalCost.totalCartCost;
      }
    } else {
      totalDiscountRate = 1 - totalCost.totalDiscountedCost / totalCost.totalCartCost;
    }

    const TUESDAY_GET_NUMBER = 2;
    const TUESDAY_DISCOUNT_RATE = 0.1;
    if (new Date().getDay() === TUESDAY_GET_NUMBER) {
      finalCost *= 1 - TUESDAY_DISCOUNT_RATE;
      totalDiscountRate = Math.max(totalDiscountRate, TUESDAY_DISCOUNT_RATE);
    }

    return {
      finalCost: Math.round(finalCost),
      totalDiscountRate: Number((totalDiscountRate * TO_PERCENTAGE).toFixed(1)),
    };
  };

  const calculatePoint = () => {
    const BONUS_POINT_RATE = 1000;
    const bonusPoint = Math.floor(discountedCost().finalCost / BONUS_POINT_RATE);
    return bonusPoint;
  };

  return (
    <div id="cart-total" className="text-xl font-bold my-4">
      총액: {discountedCost().finalCost.toLocaleString()}원
      {discountedCost().totalDiscountRate > 0 && (
        <span className="text-green-500 ml-2">
          ({discountedCost().totalDiscountRate}% 할인 적용)
        </span>
      )}
      <span id="loyalty-points" className="text-blue-500 ml-2">
        (포인트: {calculatePoint().toLocaleString()})
      </span>
    </div>
  );
};

export default TotalCost;
