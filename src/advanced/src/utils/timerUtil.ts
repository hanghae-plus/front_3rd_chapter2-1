type Callback = () => void;

export function createDelayedIntervalFunction(
  callback: Callback,
  delay: number,
  interval: number,
) {
  return function (): void {
    setTimeout(function () {
      setInterval(callback, interval);
    }, delay);
  };
}
