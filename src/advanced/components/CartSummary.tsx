import { CartSummaryType } from '../model/cartSummary';

interface CartSummaryProps {
  cartSummary: CartSummaryType;
}

export const CartSummary = ({ cartSummary }: CartSummaryProps) => {
  const { totalPrice, discountRate, point } = cartSummary;

  return (
    <div className="text-xl font-bold my-4">
      총액: {Math.round(totalPrice)}원
      {discountRate > 0 && (
        <span className="text-green-500 ml-2">
          ({(discountRate * 100).toFixed(1)}% 할인 적용)
        </span>
      )}
      <span className="text-blue-500 ml-2">(포인트: {point})</span>
    </div>
  );
};
