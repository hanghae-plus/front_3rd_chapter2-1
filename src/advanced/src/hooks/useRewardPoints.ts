export const useRewardPoints = (totalPrice) => {
  return Math.floor(totalPrice / 1000);
};