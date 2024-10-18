import { prodList } from '../constant/productList';

const RECOMMENDED_DISCOUNT_RATE = 0.95;
const RECOMMENDATION_INTERVAL_MS = 60000;

/**
 * 선택된 상품 외의 다른 상품에 할인 적용
 * @param {string} excludedProductId 선택된 상품 ID를 제외
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
 * 추천 상품 할인을 초기화
 * @param {string} selectedProductId 선택된 상품의 ID
 */
export function useRecommendPromotion(selectedProductId) {
  setTimeout(() => {
    const intervalId = setInterval(() => applyDiscountDifferentProduct(selectedProductId), RECOMMENDATION_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, Math.random() * 20000);
}
