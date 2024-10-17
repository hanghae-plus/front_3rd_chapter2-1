import { createStore } from '@basic/lib/store';
import { deepClone } from '@basic/utils';
import { findIndexById } from '@basic/utils/find';

export const cartStore = createStore({
  cartItems: [],
});

export const addItemToCart = (product: CartProductType) => {
  const { cartItems } = cartStore.getState();
  const cloneCartItems = deepClone(cartItems);
  const itemIndex = findIndexById(cloneCartItems, product.id);

  if (itemIndex > -1) {
    // 장바구니에 이미 제품이 있으면 수량 + 1
    increaseItemInCart(product.id);
  } else {
    // 장바구니에 제품 추가
    const { id, name, price } = product;
    cloneCartItems.push({ id, name, price, quantity: 1 });
    cartStore.setState({ cartItems: cloneCartItems });
  }
};

export const increaseItemInCart = (productId: string) => {
  const { cartItems } = cartStore.getState();
  const cloneCartItems = deepClone(cartItems);
  const itemIndex = findIndexById(cloneCartItems, productId);

  // 장바구니에 해당 제품이 없으면 return
  if (itemIndex < 0) return;

  // 수량 + 1
  const item = cloneCartItems[itemIndex];
  item.quantity += 1;

  cartStore.setState({ cartItems: cloneCartItems });
};

export const decreaseItemInCart = (productId: string) => {
  const { cartItems } = cartStore.getState();
  const cloneCartItems = deepClone(cartItems);
  const itemIndex = findIndexById(cloneCartItems, productId);

  // 장바구니에 해당 제품이 없으면 return
  if (itemIndex < 0) return;

  // 수량 - 1
  const item = cloneCartItems[itemIndex];
  if (item.quantity - 1 <= 0) cloneCartItems.splice(itemIndex, 1);
  else item.quantity -= 1;

  cartStore.setState({ cartItems: cloneCartItems });
};

export const removeItemToCart = (productId: string) => {
  const { cartItems } = cartStore.getState();
  const cloneCartItems = deepClone(cartItems);
  const itemIndex = findIndexById(cloneCartItems, productId);

  cloneCartItems.splice(itemIndex, 1);

  cartStore.setState({ cartItems: cloneCartItems });
};
