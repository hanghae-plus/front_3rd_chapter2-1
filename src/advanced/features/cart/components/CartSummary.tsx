export interface ICartSummaryProps {
  totalAmount: number;
  discountRate: number;
  point: number;
}

export const CartSummary = ({
  totalAmount = 0,
  discountRate = 0,
  point = 0,
}: ICartSummaryProps) => {
  const isDiscounted = discountRate > 0;

  return (
    <div className="text-xl font-bold my-4">
      총액: {totalAmount}원
      {isDiscounted && (
        <span className="text-green-500 ml-2">
          ({Number((discountRate * 100).toFixed(1))}% 할인 적용)
        </span>
      )}
      <span className="text-blue-500 ml-2">(포인트: {point})</span>
    </div>
  );
};
