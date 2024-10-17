import { startLightningInterval } from './lightning';
import { startSuggestionInterval } from './suggetion';

const intervalMap = new Map();

/**
 * 할인 및 제안을 적용하는 인터벌
 */
export const startDiscountIntervals = () => {
  // 번개 할인 인터벌
  startLightningInterval();

  // 추천 할인 인터벌
  startSuggestionInterval();
};

// 인터벌을 설정하고 `Map`에 추가
export const setTrackedInterval = (
  key: string,
  callback: TimerHandler,
  delay: number
) => {
  const intervalId = setInterval(callback, delay);
  intervalMap.set(key, intervalId);
  return intervalId;
};

// 특정 인터벌 해제
export const clearInterval = (intervalId: ReturnType<typeof setInterval>) => {
  if (intervalMap.has(intervalId)) {
    clearInterval(intervalMap.get(intervalId)!);
    intervalMap.delete(intervalId); // Map에서 제거
  }
};

// 모든 인터벌 해제
export const clearAllIntervals = () => {
  intervalMap.forEach((id) => clearInterval(id));
  intervalMap.clear(); // Map 초기화
};

// 인터벌 존재 유무
export const hasIntervals = (key: string) => {
  return intervalMap.has(key);
};

// 인터벌 반환
export const getIntervals = (key: string) => {
  return intervalMap.get(key);
};
