import React, { useState } from 'react';
import { Layout, ProductSelect, AddToCartButton } from './component/atoms';
import { CartItems, CartTotal, StockStatus } from './component/organisms';
import { useCartHandlers } from './hooks/useCartHandlers';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('p1');
  const { handleAddCartItem, handleQuantityUpdate, handleRemoveCartItem } = useCartHandlers(cartItems, setCartItems);

  const handleSelectChange = (event) => {
    setSelectedProductId(event.target.value);
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">장바구니</h1>
      <CartItems cartItems={cartItems} handleQuantityUpdate={handleQuantityUpdate} handleRemoveCartItem={handleRemoveCartItem} />
      <CartTotal cartItems={cartItems} />
      <ProductSelect handleSelectChange={handleSelectChange} />
      <AddToCartButton handleAddCartItem={() => handleAddCartItem(selectedProductId)} />
      <StockStatus cartItems={cartItems} />
    </Layout>
  );
};

export default CartPage;