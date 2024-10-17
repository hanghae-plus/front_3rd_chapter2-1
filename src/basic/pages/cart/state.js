import { createStore } from '../../lib/createStore.js';

export const cartItemState = createStore({
  cartItems: [],
});

export const cartTotalPriceState = createStore({
  totalPrice: 0,
  discountRate: 0,
  rewardPoints: 0,
});

export const selectedProductItemState = createStore({
  selectedProductItem: null,
});
