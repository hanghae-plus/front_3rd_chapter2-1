import App from '@basic/app';
import {
  SUGGESTION_DISCOUNT_DELAY,
  SUGGESTION_DISCOUNT_INTERVAL,
  SUGGESTION_DISCOUNT_RATE,
} from '@basic/constants/discount';
import { productStore, updateProductList } from '@basic/store/product';
import {
  getIntervals,
  hasIntervals,
  setTrackedInterval,
} from '@basic/utils/interval/intervalManager';
import { applyDiscount } from './applyDiscount';

const INTERVAL_KEY = 'suggestion-interval';

// 추천 할인 인터벌
export const startSuggestionInterval = () => {
  setTimeout(() => {
    // 기존 인터벌이 있을 경우 먼저 해제
    const hasInterval = hasIntervals(INTERVAL_KEY);
    if (hasInterval) {
      const prevInterval = getIntervals(INTERVAL_KEY);
      clearInterval(prevInterval);
    }

    setTrackedInterval(
      INTERVAL_KEY,
      applySuggestionDiscount,
      SUGGESTION_DISCOUNT_INTERVAL
    );
  }, SUGGESTION_DISCOUNT_DELAY);
};

/**
 * 추천 할인 적용
 */
export const applySuggestionDiscount = () => {
  const { lastItemId, selectBox } = App.getInstance();
  if (!lastItemId) return; // 마지막 선택 아이템이 없으면 return

  const { productList } = productStore.getState();

  // 마지막 선택 아이템과 다르고 재고가 있는 추천 상품 찾기
  const suggestedItem = productList.find(
    ({ id, quantity }: ProductType) => id !== lastItemId && quantity > 0
  );

  // 추천 상품이 없으면 return
  if (!suggestedItem) return;

  const { id, name, price } = suggestedItem;

  // 할인 적용
  const updatePrice = applyDiscount(price, SUGGESTION_DISCOUNT_RATE);
  updateProductList(id, { price: updatePrice });

  // 할인 팝업
  alert(`${name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);

  // 셀렉트박스 업데이트
  selectBox.update();
};
