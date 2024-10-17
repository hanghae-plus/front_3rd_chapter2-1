import { useEffect, useState } from "react";

type PriceSectionProps = {
  totalPrice: number;
  discountRate: number;
};

export default function PriceSection({ totalPrice, discountRate }: PriceSectionProps) {
  const [point, setPoint] = useState(0);

  useEffect(() => {
    setPoint(Math.floor(totalPrice / 1000));
  }, [totalPrice]);

  return (
    <div id="cart-total" className="text-xl font-bold my-4">
      {`총액: ${totalPrice}원`}
      <span id="loyalty-points" className="text-blue-500 ml-2">
        {`(포인트: ${point})`}
      </span>
      {Number.isNaN(discountRate) || discountRate === 0 ? null : (
        <span className="text-green-500 ml-2">{`(${discountRate * 100}% 할인 적용)`}</span>
      )}
    </div>
  );
}
