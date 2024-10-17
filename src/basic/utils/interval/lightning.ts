import {
  LIGHTNING_INTERVAL_KEY,
  LIGHTNING_SALE_DELAY,
  LIGHTNING_SALE_INTERVAL,
} from '@basic/constants/discount';
import {
  getIntervals,
  hasIntervals,
  setTrackedInterval,
} from './intervalManager';
import { applyLightningSale } from '@basic/hooks/discount/lightning';

// 번개 할인 인터벌
export const startLightningInterval = () => {
  setTimeout(() => {
    // 기존 인터벌이 있을 경우 먼저 해제
    const hasInterval = hasIntervals(LIGHTNING_INTERVAL_KEY);
    if (hasInterval) {
      const prevInterval = getIntervals(LIGHTNING_INTERVAL_KEY);
      clearInterval(prevInterval);
    }

    // 인터벌 등록
    setTrackedInterval(
      LIGHTNING_INTERVAL_KEY,
      applyLightningSale,
      LIGHTNING_SALE_INTERVAL
    );
  }, LIGHTNING_SALE_DELAY);
};
