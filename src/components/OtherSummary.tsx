import { FC, memo } from 'react'

type OtherSummaryProps = {
  totalAmount: number
  points: number
  discountRate: number
}

const OtherSummary: FC<OtherSummaryProps> = ({ totalAmount, points, discountRate }) => {
  return (
    <div id="cart-total" className="text-xl font-bold my-4">
      <span>
        총액: {totalAmount.toLocaleString()}원
        {discountRate && (
          <span id="discount-rate" className="text-green-500 ml-2">
            ({discountRate}% 할인 적용)
          </span>
        )}
        <span id="loyalty-points" className="text-blue-500 ml-2">
          (포인트: {points.toLocaleString()}점)
        </span>
      </span>
    </div>
  )
}

export default memo(OtherSummary)
