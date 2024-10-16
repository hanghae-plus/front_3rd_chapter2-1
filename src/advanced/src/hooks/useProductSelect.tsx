import { ChangeEvent, useState } from 'react';
import { useCartStore, useProductStore } from '../stores';
import type { CartItemModel, ProductModel } from '../types/cart';

const useProductSelect = () => {
  const storeProducts = useProductStore((state) => state.products);
  const [selectedProduct, setSelectedProduct] = useState('p1');
  const handleSelectProduct = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedProduct(e.target.value);
  };

  const storeCartItems = useCartStore((state) => state.cartItems);
  const addStoreCartItems = useCartStore((state) => state.addStoreCartItems);
  const updateStoreCartItems = useCartStore((state) => state.updateStoreCartItems);
  const updateStoreProductQuantity = useProductStore((state) => state.updateStoreProductQuantity);

  const addToCart = (currentCartItem: CartItemModel | undefined, targetProduct: ProductModel) => {
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
      return product.id === selectedProduct;
    });

    if (!targetProduct) return; // 상품 자체가 존재하지 않음

    const currentCartItem = storeCartItems.find((item) => item.id === targetProduct.id);

    if (currentCartItem && targetProduct.quantity === 0) {
      alert('재고가 부족합니다.');
      return;
    }

    addToCart(currentCartItem, targetProduct);
  };

  return { selectedProduct, handleSelectProduct, handleAddToCart };
};

export default useProductSelect;
