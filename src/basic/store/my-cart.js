import { DECREASE } from '../shared/constants';

export const myCart = (() => {
  let cart = new Map();

  const addItem = (productId) => {
    if (!cart.has(productId)) {
      cart.set(productId, 1);
    }
  };

  const deleteItem = (productId) => {
    if (cart.has(productId)) {
      cart.delete(productId);
    }
  };

  const setItemCount = (productId, change) => {
    if (cart.has(productId)) {
      const count = cart.get(productId);
      if (change === DECREASE && count <= 1) return;
      cart.set(productId, count + change);
    }
  };

  const getItemCount = (productId) => {
    return cart.get(productId) ?? 0;
  };

  return {
    addItem,
    deleteItem,
    getItemCount,
    setItemCount,
  };
})();
