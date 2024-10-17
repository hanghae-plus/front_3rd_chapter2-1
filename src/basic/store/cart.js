export const createStore = (initialState) => {
  let state = initialState;
  const listeners = [];

  const getState = () => state;

  const setState = (newState) => {
    state = newState;
    listeners.forEach((listener) => listener(state));
  };

  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  };

  return { getState, setState, subscribe };
};

const initialState = {
  products: [
    { id: "p1", name: "상품1", value: 10000, quantity: 50 },
    { id: "p2", name: "상품2", value: 20000, quantity: 30 },
    { id: "p3", name: "상품3", value: 30000, quantity: 20 },
    { id: "p4", name: "상품4", value: 15000, quantity: 0 },
    { id: "p5", name: "상품5", value: 25000, quantity: 10 },
  ],
  lastSelectItem: null,
};

export const store = createStore(initialState);
