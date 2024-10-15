import { cartItemState } from '../state.js';
import { DEFAULT_PRODUCT_LIST } from '../constant/defaultProducts.js';

export function updateCartItemQuantity(productId, quantityChange) {
  const { cartItems } = cartItemState.getState();
  const setCartItemState = cartItemState.setState;

  const defaultProductItem = DEFAULT_PRODUCT_LIST.find((item) => item.id === productId);
  const selectedCartItem = cartItems.find((item) => item.id === productId);

  const updatedSelectQuantity = selectedCartItem.selectQuantity + quantityChange;
  const updatedAvailableQuantity = selectedCartItem.quantity - quantityChange;

  if (updatedSelectQuantity > defaultProductItem.quantity) {
    alert('재고가 부족합니다.');
    return;
  }

  if (updatedSelectQuantity === 0) {
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
          quantity: updatedAvailableQuantity,
          selectQuantity: updatedSelectQuantity,
        };
      }
      return item;
    });

    return { cartItems: updatedCartItems };
  });
}
