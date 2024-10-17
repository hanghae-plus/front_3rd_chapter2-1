export const createObserver = () => {
  const listeners = new Set();
  const subscribe = (fn: any) => listeners.add(fn);
  const notify = () => listeners.forEach((listener: any) => listener());

  return { subscribe, notify };
};
