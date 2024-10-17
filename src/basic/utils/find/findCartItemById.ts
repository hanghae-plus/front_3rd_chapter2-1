import { cartStore } from '@basic/store/cart';

export const findCartItemById = (id: string) => {
  const { cartItems } = cartStore.getState();
  return cartItems.find((item: ProductType) => item.id === id);
};
