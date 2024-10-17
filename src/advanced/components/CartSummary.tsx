import { useEffect, useState } from "react";
import { CartSummaryProps, ProductList } from "../types/product";
import { calculateDiscountRate } from "../service/cartService";

export const CartSummary = ({ finalTotalPrice, itemCount, preDiscountTotalPrice }: CartSummaryProps) => {
  const [discountRate, setDiscountRate] = useState(0);
  const [point, setPoint] = useState(0);
  const [discountedTotalPrice, setDiscountedTotalPrice] = useState(0);

  useEffect(() => {
    let bonusPoint = Math.floor(finalTotalPrice / 1000);
    setPoint(bonusPoint);

    const calculateDiscountProps: CartSummaryProps = {
      preDiscountTotalPrice,
      finalTotalPrice,
      itemCount,
    };

    const discountRate = calculateDiscountRate(calculateDiscountProps);
    setDiscountRate(discountRate);

    // 할인율 적용하여 최종 가격 계산
    const totalAfterDiscount = preDiscountTotalPrice * (1 - discountRate);
    setDiscountedTotalPrice(totalAfterDiscount);
  }, [finalTotalPrice, itemCount]);

  return (
    <div className="text-xl font-bold my-4" id="cart-total">
      총액: {discountedTotalPrice.toLocaleString()}원{discountRate > 0 ? <span className="text-green-500 ml-2">({(discountRate * 100).toFixed(1)}% 할인 적용)</span> : ""}
      <span id="loyalty-points" className="text-blue-500 ml-2">
        (포인트: {point})
      </span>
    </div>
  );
};
