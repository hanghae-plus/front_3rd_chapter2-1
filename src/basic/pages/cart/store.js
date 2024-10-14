import { createStore } from '../../lib/createStore.js';

export const cartItemStore = createStore({
  cartItems: [],
});

export const cartTotalPriceStore = createStore({
  totalPrice: 0,
  discountRate: 0,
  rewardPoints: 0,
});

export const selectedItemStore = createStore({
  selectedItem: null,
});
