import { cartItemState } from '../state.js';
import { DEFAULT_PRODUCT_LIST } from '../constant/defaultProducts.js';

export function updateCartItemQuantity(productId, quantityChange) {
  const { cartItems } = cartItemState.getState();
  const setCartItemState = cartItemState.setState;

  const prevProduct = DEFAULT_PRODUCT_LIST.find((item) => item.id === productId);
  const selectedCartItem = cartItems.find((item) => item.id === productId);

  const newSelectQuantity = selectedCartItem.selectQuantity + quantityChange;
  const newQuantity = selectedCartItem.quantity - quantityChange;

  if (newSelectQuantity > prevProduct.quantity) {
    alert('재고가 부족합니다.');
    return;
  }

  if (newSelectQuantity === 0) {
    setCartItemState((prevState) => {
      const updatedCartItems = prevState.cartItems.filter((item) => item.id !== productId);

      return { cartItems: updatedCartItems };
    });
  }

  setCartItemState((prevState) => {
    const updatedCartItems = prevState.cartItems.map((item) => {
      if (item.id === productId) {
        return {
          ...item,
          quantity: newQuantity,
          selectQuantity: newSelectQuantity,
        };
      }
      return item;
    });

    return { cartItems: updatedCartItems };
  });
}
