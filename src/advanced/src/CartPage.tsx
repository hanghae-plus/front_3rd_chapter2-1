import React, { useState } from 'react';
import { prodList } from './constant/productList';
import {
  CartItems,
  CartTotal,
  StockStatus,
  AddToCartButton,
  ProductSelect,
  Layout,
} from './component';
import { updateCartItemQuantity } from './hooks/updateCartItemQuantity';
import { CartItem } from './types';

const findProductById = (productId: string) => {
  return prodList.find((product) => product.id === productId);
};

const CartPage = () => {
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
      findProductById(selectedProductId)
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
      findProductById(productId)
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
    <Layout>
      <h1 className="text-2xl font-bold mb-4">장바구니</h1>
      <CartItems
        cartItems={cartItems}
        handleQuantityUpdate={handleQuantityUpdate}
        handleRemoveCartItem={handleRemoveCartItem}
      />
      <CartTotal cartItems={cartItems} />
      <ProductSelect handleSelectChange={handleSelectChange} />
      <AddToCartButton handleAddCartItem={handleAddCartItem} />
      <StockStatus cartItems={cartItems} />
    </Layout>
  );
};

export default CartPage;
