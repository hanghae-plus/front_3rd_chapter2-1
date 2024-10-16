import { CartItem } from '../Cart';

export const updateCartItemQuantity = (
  cartItems: CartItem[],
  quantityChange: number,
  selectedProductItem: Omit<CartItem, 'selectQuantity'>,
) => {
  return cartItems
    .map((cartItem) => {
      if (cartItem.id !== selectedProductItem.id) {
        return cartItem;
      }

      const updatedSelectQuantity = cartItem.selectQuantity + quantityChange;
      const updatedAvailableQuantity = cartItem.quantity - quantityChange;

      if (updatedSelectQuantity > selectedProductItem.quantity) {
        alert('재고가 부족합니다.');
        return cartItem;
      }

      if (updatedSelectQuantity === 0) {
        return null;
      }

      return {
        ...cartItem,
        selectQuantity: updatedSelectQuantity,
        quantity: updatedAvailableQuantity,
      };
    })
    .filter(Boolean);
};
