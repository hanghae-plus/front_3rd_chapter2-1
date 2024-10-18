// hooks/useCartHandlers.js
import { findProductById } from '../utils/findProductById';
import { updateCartItemQuantity } from '../utils/updateCartItemQuantity';

export const useCartHandlers = (cartItems, setCartItems) => {
  const handleAddCartItem = (selectedProductId) => {
    const selectedProductItem = findProductById(selectedProductId);

    if (selectedProductItem.quantity === 0) {
      return;
    }

    setCartItems((prevState) => {
      const existingCartItem = prevState.find((item) => item.id === selectedProductItem.id);
      if (existingCartItem) {
        return updateCartItemQuantity(prevState, 1, selectedProductItem);
      }

      return [
        ...prevState,
        { ...selectedProductItem, selectQuantity: 1, quantity: selectedProductItem.quantity - 1 },
      ];
    });
  };

  const handleQuantityUpdate = (productId, changeDirection) => {
    const quantityChange = changeDirection === 'increase' ? 1 : -1;
    setCartItems((prevState) => 
      updateCartItemQuantity(prevState, quantityChange, findProductById(productId))
    );
  };

  const handleRemoveCartItem = (productId) => {
    setCartItems((prevState) => prevState.filter((item) => item.id !== productId));
  };

  return {
    handleAddCartItem,
    handleQuantityUpdate,
    handleRemoveCartItem,
  };
};
