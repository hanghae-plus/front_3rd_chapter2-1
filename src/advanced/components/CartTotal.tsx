export default function CartTotal({
  totalPrice = 0,
  discountRate = 0,
  bonusPoints = 0,
}: {
  totalPrice: number;
  discountRate: number;
  bonusPoints: number;
}) {
  return (
    <div id="cart-total" className="text-xl font-bold my-4">
      총액: {totalPrice}원
      {discountRate > 0 && (
        <span className="text-green-500 ml-2">({discountRate}% 할인 적용)</span>
      )}
      <span id="loyalty-points" className="text-blue-500 ml-2">
        (포인트: {bonusPoints})
      </span>
    </div>
  );
}
