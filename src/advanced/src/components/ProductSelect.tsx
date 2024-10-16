import { ChangeEvent, useState } from 'react';
import { products } from '../data/products';
import { useStore } from '../stores/store';
import { Product } from '../types/cart';

const ProductSelect = () => {
  //   let bonusPoints = 0;
  //   let lastAddedProduct = '';

  const cartItems = useStore((state) => state.cartItems);
  const updateCartItems = useStore((state) => state.updateCartItems);

  const addToCart = (targetProduct: Product) => {
    const currentCartItem = cartItems.find((item) => item.id === targetProduct.id);

    if (currentCartItem) {
      const updatedCartItems = cartItems.map((item) => {
        if (item.id === targetProduct.id) {
          return { ...item, quantity: item.quantity - 1, cartQuantity: item.cartQuantity + 1 };
        } else return item;
      });
      updateCartItems(updatedCartItems);
    } else {
      updateCartItems([...cartItems, { ...targetProduct, cartQuantity: 1, quantity: targetProduct.quantity - 1 }]);
    }

    // const currentItemQuantity = getTargetItemElementQuantity($targetCartItem);
    // const newItemQuantity = currentItemQuantity + 1;
    // BUG: 로직 개선
    // const isStockRemain = newItemQuantity <= targetProduct.quantity;
    // if (isStockRemain) {
    //   renderCartItemInfo(targetProduct, newItemQuantity, $targetCartItem);
    //   targetProduct.quantity--;
    // } else {
    //   alert('재고가 부족합니다.');
    // }
  };

  const handleAddToCart = () => {
    const targetProduct = products.find((product) => {
      return product.id === selected;
    });

    if (!targetProduct) return; // 상품 자체가 존재하지 않음

    addToCart(targetProduct);
    // if (targetProduct && targetProduct.quantity > 0) {
    //   // const $targetCartItem = document.getElementById(targetProduct.id);
    //   addToCart($targetCartItem, targetProduct);
    //   // bonusPoints = updateCartInfos(bonusPoints);
    //   // lastAddedProduct = selectedProductId;
    // }
  };

  const [selected, setSelected] = useState('p1');
  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelected(e.target.value);
  };

  return (
    <>
      <select onChange={handleSelect} value={selected} id="product-select" className="border rounded p-2 mr-2">
        <option value="p1">상품1 - 10000원</option>
        <option value="p2">상품2 - 20000원</option>
        <option value="p3">상품3 - 30000원</option>
        <option value="p4" disabled>
          상품4 - 15000원
        </option>
        <option value="p5">상품5 - 25000원</option>
      </select>

      <button onClick={handleAddToCart} id="add-to-cart" className="bg-blue-500 text-white px-4 py-2 rounded">
        추가
      </button>
    </>
  );
};

export default ProductSelect;
