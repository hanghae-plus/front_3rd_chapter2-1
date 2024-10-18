/**
 * @function useRewardPoints
 * @description 구매 총액에 따라 보상 포인트를 계산하는 훅
 * 
 * @param {number} totalPrice - 구매 총액
 * @returns {number} 적립될 포인트 수를 반환
 */

export const useRewardPoints = (totalPrice) => {
  return Math.floor(totalPrice / 1000);
};
