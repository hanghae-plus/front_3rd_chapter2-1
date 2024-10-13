import { createObserver } from './createObserver.js';

export function createStore(initialStore) {
  const { subscribe, notify } = createObserver();

  let state = { ...initialStore };

  const setState = (newState) => {
    state = { ...state, ...newState };
    notify();
  };

  const getState = () => ({ ...state });

  return { getState, setState, subscribe };
}
