interface CartTotalProps {
  totalPrice: number;
  accumulatedPoints: number;
  discountRate: number; // 새로운 prop 추가
}

const CartTotal = ({ totalPrice, accumulatedPoints, discountRate }: CartTotalProps) => {
  const formattedDiscountRate = (discountRate * 100).toFixed(1);

  return (
    <div className="text-xl font-bold my-4">
      <span>총액: {totalPrice}원</span>
      {discountRate > 0 && (
        <span className="text-green-500 ml-2">({formattedDiscountRate}% 할인 적용)</span>
      )}
      <span className="text-blue-500 ml-2">(포인트: {accumulatedPoints}점)</span>
    </div>
  );
};

export default CartTotal;
