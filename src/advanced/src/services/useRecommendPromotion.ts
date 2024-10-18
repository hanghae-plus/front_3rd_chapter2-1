import { prodList } from '../constant/productList';

const RECOMMENDED_DISCOUNT_RATE = 0.95;
const RECOMMENDATION_INTERVAL_MS = 60000;

/**
 * @function applyDiscountDifferentProduct
 * @description 선택된 상품을 제외하고 재고가 있는 다른 상품에 할인을 적용하는 함수
 *
 * @param {string} excludedProductId - 할인에서 제외할 상품의 ID
 */

function applyDiscountDifferentProduct(excludedProductId) {
  const recommendedProduct = prodList.find(
    (product) => product.id !== excludedProductId && product.quantity > 0,
  );

  if (recommendedProduct) {
    recommendedProduct.price = Math.round(recommendedProduct.price * RECOMMENDED_DISCOUNT_RATE);
    alert(`${recommendedProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
  }
}

/**
 * @function useRecommendPromotion
 * @description 선택된 상품을 제외하고, 다른 상품에 주기적으로 할인을 적용하기 위한 훅
 *
 * @param {string} selectedProductId - 현재 선택된 상품의 ID이자 이 상품은 할인 적용에서 제외
 * @returns {function} 컴포넌트가 언마운트될 때 호출되어 인터벌을 정리하는 클린업 함수를 반환
 */

export function useRecommendPromotion(selectedProductId) {
  setTimeout(() => {
    const intervalId = setInterval(
      () => applyDiscountDifferentProduct(selectedProductId),
      RECOMMENDATION_INTERVAL_MS,
    );
    return () => clearInterval(intervalId);
  }, Math.random() * 20000);
}
