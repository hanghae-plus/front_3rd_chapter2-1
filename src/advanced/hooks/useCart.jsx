import { useEffect } from 'react';
import { useCartContext } from '../context/CartContext';
import { useCalculator } from './useCalculator';

export const useCart = () => {
  const {
    productList,
    updateProductList,
    selectRef,
    cartItemList,
    createCartItem,
    updateCartItemList,
    cartInfo,
    updateCartInfo,
  } = useCartContext();

  const { calculatorCart } = useCalculator();

  const handleAddToCart = () => {
    const selectedProduct = selectRef.current.value;
    const targetProduct = productList.find((product) => {
      return product.id === selectedProduct;
    });

    if (targetProduct && targetProduct.quantity > 0) {
      addToCart(targetProduct);
      updateCartInfo('lastAddedProduct', targetProduct.id);
    }
  };

  const addToCart = (targetProduct) => {
    const cartItem = cartItemList.find((item) => item.id === targetProduct.id);
    if (!cartItem) {
      // new
      createCartItem(targetProduct);
    } else {
      // update
      updateCartItemList(targetProduct.id, 'quantity', cartItem.quantity + 1);
    }
    updateProductList(targetProduct.id, 'quantity', targetProduct.quantity - 1);
  };

  return { handleAddToCart };
};
