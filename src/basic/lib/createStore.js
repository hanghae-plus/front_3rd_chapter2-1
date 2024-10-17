import { createObserver } from './createObserver.js';

export function createStore(initialStore) {
  const { subscribe, notify } = createObserver();

  let state = { ...initialStore };

  const setState = (newState) => {
    if (typeof newState === 'function') {
      state = { ...state, ...newState(state) };
    } else {
      state = { ...state, ...newState };
    }
    notify();
  };

  const getState = () => ({ ...state });

  return { getState, setState, subscribe };
}
