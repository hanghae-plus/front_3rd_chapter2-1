import { ChangeEvent, useState } from 'react';
import { useStore } from '../stores/cartStore';
import { ICartItem, IProduct } from '../types/cart';
import { useProductStore } from '../stores/productStore';

const useProductSelect = () => {
  const storeProducts = useProductStore((state) => state.products);
  const [selected, setSelected] = useState('p1');
  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelected(e.target.value);
  };

  const storeCartItems = useStore((state) => state.cartItems);
  const addStoreCartItems = useStore((state) => state.addStoreCartItems);
  const updateStoreCartItems = useStore((state) => state.updateStoreCartItems);
  const updateStoreProductQuantity = useProductStore((state) => state.updateStoreProductQuantity);

  const addToCart = (currentCartItem: ICartItem | undefined, targetProduct: IProduct) => {
    if (!currentCartItem) {
      addStoreCartItems({
        id: targetProduct.id,
        name: targetProduct.name,
        price: targetProduct.price,
        cartQuantity: 1,
      });
      updateStoreProductQuantity(targetProduct, targetProduct.quantity - 1);
      return;
    }

    const updatedCartItems = storeCartItems.map((item) => {
      if (item.id === targetProduct.id) {
        return { ...item, cartQuantity: item.cartQuantity + 1 };
      } else return item;
    });
    updateStoreCartItems(updatedCartItems);
    updateStoreProductQuantity(targetProduct, targetProduct.quantity - 1);
  };

  const handleAddToCart = () => {
    const targetProduct = storeProducts.find((product) => {
      return product.id === selected;
    });

    if (!targetProduct) return; // 상품 자체가 존재하지 않음

    const currentCartItem = storeCartItems.find((item) => item.id === targetProduct.id);

    if (currentCartItem && targetProduct.quantity === 0) {
      alert('재고가 부족합니다.');
      return;
    }

    addToCart(currentCartItem, targetProduct);
  };

  return { selected, handleSelect, handleAddToCart };
};

export default useProductSelect;
