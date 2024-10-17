import { useEffect, useState } from 'react';
import useCartStore from '../store/useCartStore';

const CartItemsInfo: React.FC = () => {
  // 할인율 정의
  const discountRates: Record<string, number> = {
    p1: 0.1,
    p2: 0.15,
    p3: 0.2,
    p4: 0.05,
    p5: 0.25,
  };

  const { cartList } = useCartStore();

  // 장바구니 총 수량
  const cartTotalCount = cartList.reduce((total, item) => total + item.count, 0);
  // 장바구니 총액 (할인 적용 전)
  const cartTotalPrice = cartList.reduce((total, item) => total + item.price * item.count, 0);

  const [discTotalPrice, setDiscTotalPrice] = useState(cartTotalPrice); // 할인 적용 후 총액
  const [bonusPoint, setBonusPoint] = useState(0); // 보너스 포인트
  const [discountRate, setDiscountRate] = useState(0); // 현재 할인율

  // 장바구니 총액 및 할인 계산
  const calculateCart = () => {
    let totalDiscount = 0; // 총 할인 금액
    let maxDiscountRate = 0; // 최대 할인율

    cartList.forEach((item) => {
      const { id, price, count } = item;
      const itemTotalPrice = price * count; // 해당 품목의 총 가격

      // 10개 이상 구매 시 할인 적용
      if (count >= 10) {
        const discount = discountRates[id] || 0;
        totalDiscount += itemTotalPrice * discount; // 총 할인 금액 업데이트
        maxDiscountRate = Math.max(maxDiscountRate, discount); // 최대 할인율 업데이트
      }
    });

    const totalAfterDiscount = cartTotalPrice - totalDiscount; // 할인 적용 후 총액
    setDiscTotalPrice(totalAfterDiscount);
    return maxDiscountRate; // 최대 할인율 반환
  };

  // 보너스 포인트 계산
  const updateBonusPoint = () => {
    return Math.floor(cartTotalPrice / 1000);
  };

  // 할인율 업데이트 함수
  const updateDiscountRate = (initialDiscountRate: number) => {
    let currentDiscountRate = initialDiscountRate; // 계산된 할인율 사용

    // 30개 이상 구매 시 25% 할인 적용
    if (cartTotalCount >= 30) {
      currentDiscountRate = Math.max(currentDiscountRate, 0.25);
      const bulkDiscountedPrice = cartTotalPrice * (1 - currentDiscountRate);
      setDiscTotalPrice(bulkDiscountedPrice);
    }

    // 화요일 할인 적용 (최소 10% 할인 적용)
    if (new Date().getDay() === 2) {
      currentDiscountRate = Math.max(currentDiscountRate, 0.1); // 최소 10% 할인
    }

    setDiscountRate(currentDiscountRate); // 할인율 업데이트
  };

  useEffect(() => {
    const maxDiscountRate = calculateCart(); // 총액 및 할인 계산
    setBonusPoint(updateBonusPoint()); // 보너스 포인트 업데이트
    updateDiscountRate(maxDiscountRate); // 할인율 업데이트
  }, [cartList]);

  return (
    <div id="cart-total" className="text-xl font-bold my-4">
      총액: {Math.round(discTotalPrice)} {/* 할인 적용 후 총액 */}
      <span className="text-blue-500 ml-2" id="loyalty-points">
        (포인트: {bonusPoint}) {/* 현재 보너스 포인트 */}
      </span>
      {discountRate > 0 && (
        <span className="text-green-500 ml-2">
          ({(discountRate * 100).toFixed(1)}% 할인 적용) {/* 할인율 */}
        </span>
      )}
    </div>
  );
};

export default CartItemsInfo;
