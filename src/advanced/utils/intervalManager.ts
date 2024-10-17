const createInterval = () => {
  const intervalMap = new Map();

  // interval 추가
  const addInterval = (key: string, callback: TimerHandler, delay: number) => {
    const intervalId = setInterval(callback, delay);
    intervalMap.set(key, intervalId);
    return intervalId;
  };

  // 특정 interval 해제
  const clearInterval = (key: string) => {
    if (intervalMap.has(key)) {
      clearInterval(intervalMap.get(key)!);
      intervalMap.delete(key); // Map에서 제거
    }
  };

  // 모든 interval 해제
  const clearAllIntervals = () => {
    intervalMap.forEach((id) => clearInterval(id));
    intervalMap.clear();
  };

  // interval 존재 유무
  const hasInterval = (key: string) => intervalMap.has(key);

  // interval 반환
  const getInterval = (key: string) => intervalMap.get(key);

  return {
    addInterval,
    clearInterval,
    clearAllIntervals,
    hasInterval,
    getInterval,
  };
};

const intervalManager = createInterval();
export default intervalManager;
