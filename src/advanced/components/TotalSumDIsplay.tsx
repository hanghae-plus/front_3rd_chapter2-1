import React from "react";
import { useCart } from "../context/CartContext";

const TotalSumDisplay: React.FC = () => {
  const { state } = useCart();

  return (
    <div id="cart-total" className="text-xl font-bold my-4">
      {state.totalPrice > 0 && <span>총액: {state.totalPrice}원</span>}
      {state.bonusPoints > 0 && <span className="text-blue-500 ml-2">(포인트: {state.bonusPoints})</span>}
      {state.discountRate > 0 && (
        <span className="text-green-500 ml-2">({(state.discountRate * 100).toFixed(1)}% 할인 적용)</span>
      )}
    </div>
  );
};

export default TotalSumDisplay;
