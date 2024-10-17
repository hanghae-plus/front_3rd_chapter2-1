import { useEffect } from "react";
import { Product } from "../types";

interface RecommendationProps {
  productList: Product[];
  selectProductId: string;
}

// 추천 상품 커스텀 훅
export const useRecommendation = ({ productList, selectProductId }: RecommendationProps) => {
  useEffect(() => {
    const delay = Math.random() * 20000;
    const interval = 60000;

    const timeoutId = setTimeout(() => {
      const intervalId = setInterval(recommendationInterval, interval);

      // 컴포넌트 언마운트 시 정리
      return () => clearInterval(intervalId);
    }, delay);

    // 컴포넌트 언마운트 시 정리
    return () => clearTimeout(timeoutId);
  }, []);

  // 추천 상품 주기
  const recommendationInterval = () => {
    let suggest = productList.find((item) => item.id !== selectProductId && item.quantity > 0);
    if (suggest) {
      alert(suggest.name + "은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!");
      suggest.price = Math.round(suggest.price * 0.95);
    }
  };
};
