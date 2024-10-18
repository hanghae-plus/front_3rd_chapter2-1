import { prodList } from '../constant/productList';

const PROMOTION_CHANCE = 0.3;
const PROMOTION_DISCOUNT = 0.2;
const PROMOTION_INTERVAL = 3000;

/**
 * @function applyLuckySalePromotion
 * @description 상품 목록에서 무작위로 하나의 상품을 선택하여 번개세일 프로모션을 적용하고, 알림으로 표시
 */

function applyLuckySalePromotion() {
  const randomIndex = Math.floor(Math.random() * prodList.length);
  const productForPromotion = prodList[randomIndex];

  if (Math.random() < PROMOTION_CHANCE && productForPromotion.quantity > 0) {
    const newPrice = Math.round(productForPromotion.price * (1 - PROMOTION_DISCOUNT));
    productForPromotion.price = newPrice;
    alert(
      `번개세일! ${productForPromotion.name}이(가) ${PROMOTION_DISCOUNT * 100}% 할인 중입니다!`
    );
  }
}

/**
 * @function useLuckySale
 * @description 번개세일 프로모션을 주기적으로 실행하기 위한 훅
 * @returns {function} 컴포넌트가 언마운트될 때 호출되어 인터벌을 정리하는 클린업 함수를 반환
 */

export function useLuckySale() {
  setTimeout(() => {
    const intervalId = setInterval(applyLuckySalePromotion, PROMOTION_INTERVAL);
    return () => clearInterval(intervalId);
  }, Math.random() * 1000);
}
