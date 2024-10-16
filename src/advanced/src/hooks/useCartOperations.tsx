import { MouseEvent } from 'react';
import { ICartItem } from '../types/cart';
import { useStore } from '../stores/store';

const useCartOperations = () => {
  const cartItems = useStore((state) => state.cartItems);
  const updateStoreCartItems = useStore((state) => state.updateStoreCartItems);
  const removeStoreCartItem = useStore((state) => state.removeStoreCartItem);

  const changeCartItemQuantity = (cartItem: ICartItem, newQuantity: number, updatedStock: number) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item.id === cartItem.id) {
        return { ...item, quantity: updatedStock, cartQuantity: newQuantity };
      } else return item;
    });
    updateStoreCartItems(updatedCartItems);
  };

  const handleCartItemQuantity = (event: MouseEvent<HTMLButtonElement>, cartItem: ICartItem) => {
    const changeAmount = Number((event.target as HTMLButtonElement).value);

    const updatedStock = cartItem.quantity - changeAmount;
    const newQuantity = cartItem.cartQuantity + changeAmount;

    if (updatedStock < 0) {
      alert('재고가 부족합니다.');
      return;
    }

    changeCartItemQuantity(cartItem, newQuantity, updatedStock);

    if (newQuantity <= 0) {
      removeStoreCartItem(cartItem);
    }
  };

  return { handleCartItemQuantity };
};

export default useCartOperations;
