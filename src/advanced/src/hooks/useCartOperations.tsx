import { MouseEvent } from 'react';
import type { CartItemModel } from '../types/cart';
import { useCartStore, useProductStore } from '../stores';

const useCartOperations = () => {
  const storeCartItems = useCartStore((state) => state.cartItems);
  const updateStoreCartItems = useCartStore((state) => state.updateStoreCartItems);
  const removeStoreCartItem = useCartStore((state) => state.removeStoreCartItem);
  const updateStoreProductQuantity = useProductStore((state) => state.updateStoreProductQuantity);
  const storeProducts = useProductStore((state) => state.products);

  const updateCartItemQuantity = (cartItem: CartItemModel, newQuantity: number) => {
    const updatedCartItems = storeCartItems.map((item) => {
      if (item.id === cartItem.id) {
        return { ...item, cartQuantity: newQuantity };
      } else return item;
    });
    updateStoreCartItems(updatedCartItems);
  };

  const handleCartItemQuantity = (event: MouseEvent<HTMLButtonElement>, cartItem: CartItemModel) => {
    const targetProduct = storeProducts.find((product) => product.id === cartItem.id)!;
    const changeAmount = Number((event.target as HTMLButtonElement).value);

    const updatedStock = targetProduct.quantity - changeAmount;
    const newQuantity = cartItem.cartQuantity + changeAmount;

    if (updatedStock < 0) {
      alert('재고가 부족합니다.');
      return;
    }

    updateCartItemQuantity(cartItem, newQuantity);
    updateStoreProductQuantity(targetProduct, updatedStock);

    if (newQuantity <= 0) {
      removeStoreCartItem(cartItem);
    }
  };

  return { handleCartItemQuantity };
};

export default useCartOperations;
