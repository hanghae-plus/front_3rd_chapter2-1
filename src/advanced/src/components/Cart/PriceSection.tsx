import { useEffect, useState } from "react";

type Props = {
  totalPrice: number;
  discountRate: number;
};

export default function PriceSection({ totalPrice, discountRate }: Props) {
  const [point, setPoint] = useState(0);

  useEffect(() => {
    setPoint((p) => p + Math.floor(totalPrice / 1000));
  }, [totalPrice]);

  return (
    <div id="cart-total" className="text-xl font-bold my-4">
      {`총액: ${totalPrice}원`}
      <span id="loyalty-points" className="text-blue-500 ml-2">
        {`(포인트: ${point})`}
      </span>
      <span className="text-green-500 ml-2">{`(${Number.isNaN(discountRate) ? 0 : (discountRate * 100).toFixed(1)}% 할인 적용)`}</span>
    </div>
  );
}
