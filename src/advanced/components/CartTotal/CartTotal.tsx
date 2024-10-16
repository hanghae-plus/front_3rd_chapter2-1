import { CartTotal as TCartTotal } from '../../model/cartTotal';

interface CartTotalProps {
  cartTotal: TCartTotal;
}

export const CartTotal = ({ cartTotal }: CartTotalProps) => {
  const { totalPrice, discountRate, point } = cartTotal;

  return (
    <div id="cart-total" className="text-xl font-bold my-4">
      총액: {Math.round(totalPrice)}원
      {discountRate > 0 && (
        <span className="text-green-500 ml-2">
          ({(discountRate * 100).toFixed(1)}% 할인 적용)
        </span>
      )}
      <span id="loyalty-points" className="text-blue-500 ml-2">
        (포인트: {point})
      </span>
    </div>
  );
};
