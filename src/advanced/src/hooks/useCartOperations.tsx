import { MouseEvent } from 'react';

import { useCartStore, useProductStore } from '../stores';

import type { CartItemModel } from '../types/cart';

const useCartOperations = () => {
  const storeCartItems = useCartStore((state) => state.cartItems);
  const addStoreCartItems = useCartStore((state) => state.addCartItems);
  const updateStoreCartItems = useCartStore((state) => state.updateCartItems);
  const removeStoreCartItem = useCartStore((state) => state.removeCartItem);

  const storeProducts = useProductStore((state) => state.products);
  const updateStoreProductQuantity = useProductStore((state) => state.updateProductQuantity);
  const updateLastAddedProduct = useProductStore((state) => state.updateLastAddedProduct);

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

    if (changeAmount > 0) updateLastAddedProduct(targetProduct);
    if (newQuantity <= 0) removeStoreCartItem(cartItem);
  };
  const handleAddToCart = (selectedProductId: string) => {
    const targetProduct = storeProducts.find((product) => {
      return product.id === selectedProductId;
    });
    if (!targetProduct) return; // 상품 자체가 존재하지 않음

    const currentCartItem = storeCartItems.find((item) => item.id === targetProduct.id);
    if (currentCartItem && targetProduct.quantity <= 0) {
      alert('재고가 부족합니다.');
      return;
    }

    if (!currentCartItem) {
      addStoreCartItems({
        id: targetProduct.id,
        name: targetProduct.name,
        price: targetProduct.price,
        cartQuantity: 1,
      });
    } else {
      updateCartItemQuantity(currentCartItem, currentCartItem.cartQuantity + 1);
    }

    updateStoreProductQuantity(targetProduct, targetProduct.quantity - 1);
    updateLastAddedProduct(targetProduct);
  };

  return { handleCartItemQuantity, handleAddToCart };
};

export default useCartOperations;
