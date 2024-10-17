import React, { useEffect } from 'react';
import useCartStore from '../store/userCartStore';

// 장바구니 할인 이벤트 컴포넌트
const CartSaleEvent: React.FC = () => {
  const products = useCartStore((state) => state.products);
  const updateProductPrice = useCartStore((state) => state.updateProductPrice);

  const luckySaleItem = () => {
    const selectedProduct = products[Math.floor(Math.random() * products.length)];
    const isSaleItem = Math.random() < 0.3;

    if (isSaleItem && selectedProduct.quantity > 0) {
      // 상품 금액 20% 할인
      updateProductPrice(selectedProduct.id, 0.2);
      alert(`번개세일! ${selectedProduct.name}이(가) 20% 할인 중입니다!`);
    }
  };

  const recommendSaleItem = () => {
    const lastSelectedProduct = products[0]?.id;
    if (lastSelectedProduct) {
      const recommendItem = products.find((item) => item.id !== lastSelectedProduct && item.quantity > 0); // 재고 기준

      if (recommendItem) {
        // 상품 금액 5% 할인
        updateProductPrice(recommendItem.id, 0.05);
        alert(`${recommendItem.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
      }
    }
  };

  // 이벤트 알림 타이머 설정 함수
  const setupSaleTimers = (delay: number, interval: number) => {
    const saleTimeout = setTimeout(() => {
      luckySaleItem();
      setInterval(luckySaleItem, interval);
    }, delay);

    const recommendInterval = setInterval(recommendSaleItem, interval + 5000);

    // 타이머 리셋 함수
    return () => {
      clearTimeout(saleTimeout);
      clearInterval(recommendInterval);
    };
  };

  // 타이머 시간 설정 후 이벤트 호출
  useEffect(() => {
    const initialDelay = 2000;
    const saleInterval = 10000;

    const cleanupTimers = setupSaleTimers(initialDelay, saleInterval);

    return () => cleanupTimers(); // useEffect cleanup으로 타이머 제거
  }, [products]);

  return null;
};
export default CartSaleEvent;
