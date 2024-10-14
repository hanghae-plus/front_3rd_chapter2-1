export const createStore = (initialState = {}) => {
  let state = initialState
  const listeners = new Set()

  const getState = () => state

  const setState = (newState) => {
    state = newState
    listeners.forEach((listener) => listener())
  }

  const subscribe = (listener) => {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }
  return { getState, setState, subscribe }
}
