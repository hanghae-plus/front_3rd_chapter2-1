// 10.0% 할인으로 표기해야 해서 string으로 반환
export const rateToPercent = (rate: number): string => {
  return Math.floor(rate * 100).toFixed(1);
};
