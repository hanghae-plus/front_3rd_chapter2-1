import {
  SUGGESTION_DISCOUNT_DELAY,
  SUGGESTION_DISCOUNT_INTERVAL,
  SUGGESTION_INTERVAL_KEY,
} from '@basic/constants/discount';
import {
  getIntervals,
  hasIntervals,
  setTrackedInterval,
} from './intervalManager';
import { applySuggestionDiscount } from '../../hooks/discount/suggestion';

// 추천 할인 인터벌
export const startSuggestionInterval = () => {
  setTimeout(() => {
    // 기존 인터벌이 있을 경우 먼저 해제
    const hasInterval = hasIntervals(SUGGESTION_INTERVAL_KEY);
    if (hasInterval) {
      const prevInterval = getIntervals(SUGGESTION_INTERVAL_KEY);
      clearInterval(prevInterval);
    }

    setTrackedInterval(
      SUGGESTION_INTERVAL_KEY,
      applySuggestionDiscount,
      SUGGESTION_DISCOUNT_INTERVAL
    );
  }, SUGGESTION_DISCOUNT_DELAY);
};
