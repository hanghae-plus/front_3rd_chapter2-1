import React, { useState } from 'react';
import { DEFAULT_PRODUCT_LIST } from './constant/defaultProducts';
import CartItemList from './component/CartItemList';
import CartTotalPriceAndPoint from './component/CartTotalPriceAndPoint';
import OutOfStockItems from './component/OutOfStockItems';
import { updateCartItemQuantity } from './module/updateCartItemQuantity';
import AddCartItemButton from './component/AddCartItemButton';
import ProductSelect from './component/ProductSelect';

export interface CartItem {
  price: number;
  id: string;
  name: string;
  quantity: number;
  selectQuantity: number;
}

const findProductById = (productId: string) => {
  return DEFAULT_PRODUCT_LIST.find((product) => product.id === productId);
};

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('p1');

  const handleAddCartItem = () => {
    const selectedProductItem = findProductById(selectedProductId);

    if (selectedProductItem.quantity === 0) {
      return;
    }

    const updatedCartItems = updateCartItemQuantity(
      cartItems,
      1,
      findProductById(selectedProductId),
    );

    setCartItems((prevState) => {
      const existingCartItem = prevState.find((cartItem) => cartItem.id === selectedProductItem.id);

      if (existingCartItem) {
        return updatedCartItems;
      }

      return [
        ...prevState,
        {
          ...selectedProductItem,
          selectQuantity: 1,
          quantity: selectedProductItem.quantity - 1,
        },
      ];
    });
  };

  const handleQuantityUpdate = (productId: string, changeDirection: 'increase' | 'decrease') => {
    const quantityChange = changeDirection === 'increase' ? 1 : -1;

    const updatedCartItems = updateCartItemQuantity(
      cartItems,
      quantityChange,
      findProductById(productId),
    );

    setCartItems(updatedCartItems);
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prevState) => {
      return prevState.filter((cartItem) => cartItem.id !== productId);
    });
  };

  const handleSelectChange = (event) => {
    setSelectedProductId(event.target.value);
  };

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <CartItemList
          cartItems={cartItems}
          handleQuantityUpdate={handleQuantityUpdate}
          handleRemoveCartItem={handleRemoveCartItem}
        />
        <CartTotalPriceAndPoint cartItems={cartItems} />
        <ProductSelect handleSelectChange={handleSelectChange} />
        <AddCartItemButton handleAddCartItem={handleAddCartItem} />
        <OutOfStockItems cartItems={cartItems} />
      </div>
    </div>
  );
};

export default Cart;
