export const setupIntervalWithDelay = (
  callback: () => void,
  delay: number,
  interval: number,
) => {
  setTimeout(() => {
    setInterval(callback, interval);
  }, delay);
};
