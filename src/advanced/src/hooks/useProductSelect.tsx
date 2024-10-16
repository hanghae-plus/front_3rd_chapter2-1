import { ChangeEvent, useState } from 'react';
import { products } from '../data/products';
import { useStore } from '../stores/store';
import { ICartItem, IProduct } from '../types/cart';

const useProductSelect = () => {
  const [selected, setSelected] = useState('p1');
  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelected(e.target.value);
  };

  const cartItems = useStore((state) => state.cartItems);
  const addStoreCartItems = useStore((state) => state.addStoreCartItems);
  const updateStoreCartItems = useStore((state) => state.updateStoreCartItems);

  const addToCart = (currentCartItem: ICartItem | undefined, targetProduct: IProduct) => {
    if (!currentCartItem) {
      addStoreCartItems({ ...targetProduct, cartQuantity: 1, quantity: targetProduct.quantity - 1 });
      return;
    }

    const updatedCartItems = cartItems.map((item) => {
      if (item.id === targetProduct.id) {
        return { ...item, quantity: item.quantity - 1, cartQuantity: item.cartQuantity + 1 };
      } else return item;
    });
    updateStoreCartItems(updatedCartItems);
  };

  const handleAddToCart = () => {
    const targetProduct = products.find((product) => {
      return product.id === selected;
    });

    if (!targetProduct) return; // 상품 자체가 존재하지 않음

    const currentCartItem = cartItems.find((item) => item.id === targetProduct.id);

    if (currentCartItem && currentCartItem.quantity === 0) {
      alert('재고가 부족합니다.');
      return;
    }

    addToCart(currentCartItem, targetProduct);
  };

  return { selected, handleSelect, handleAddToCart };
};

export default useProductSelect;
