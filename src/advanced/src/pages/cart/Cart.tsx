import React, { useState } from 'react';
import { DEFAULT_PRODUCT_LIST } from './constant/defaultProducts';
import CartItemList from './component/CartItemList';
import CartTotalPriceAndPoint from './component/CartTotalPriceAndPoint';

export interface CartItems {
  price: number;
  id: string;
  name: string;
  quantity: number;
  selectQuantity: number;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItems[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('p1');

  const handleSelectChange = (event) => {
    setSelectedProductId(event.target.value);
  };

  const handleAddCartItem = () => {
    const selectedProductItem = DEFAULT_PRODUCT_LIST.find(
      (product) => product.id === selectedProductId,
    );

    setCartItems((prevState) => {
      const existingCartItem = prevState.find((cartItem) => cartItem.id === selectedProductItem.id);

      if (existingCartItem) {
        return prevState.map((cartItem) =>
          cartItem.id === selectedProductItem.id
            ? { ...cartItem, selectQuantity: cartItem.selectQuantity + 1 }
            : cartItem,
        );
      }

      return [...prevState, { ...selectedProductItem, selectQuantity: 1 }];
    });
  };

  const handleQuantityUpdate = (id: string, changeDirection: 'increase' | 'decrease') => {
    const quantityChange = changeDirection === 'increase' ? 1 : -1;

    setCartItems((prevState) => {
      return prevState
        .map((cartItem) =>
          cartItem.id === id
            ? { ...cartItem, selectQuantity: cartItem.selectQuantity + quantityChange }
            : cartItem,
        )
        .filter((cartItem) => cartItem.selectQuantity > 0);
    });
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prevState) => {
      return prevState.filter((cartItem) => cartItem.id !== id);
    });
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
        <CartTotalPriceAndPoint />
        <select className="border rounded p-2 mr-2" onChange={handleSelectChange}>
          {DEFAULT_PRODUCT_LIST.map((product) => (
            <option key={product.id} disabled={product.quantity === 0} value={product.id}>
              {product.name} - {product.price}원
            </option>
          ))}
        </select>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAddCartItem}>
          추가
        </button>
        {DEFAULT_PRODUCT_LIST.filter((product) => product.quantity === 0).map((product) => (
          <div key={product.id} className="text-sm text-gray-500 mt-2">
            {product.name}:
            {product.quantity > 0 ? '재고 부족' + ` (${product.quantity}개 남음)` : '품절'}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cart;
