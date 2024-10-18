import React from 'react';
import DefaultLayout from '../layouts/DefaultLayout';
import { CartItems, CartTotal, Products, StockInfo } from '../components';
const Home: React.FC = () => {
  return (
    <DefaultLayout>
      <h1 className="text-2xl font-bold mb-4">장바구니</h1>
      <CartItems />
      <CartTotal />
      <Products />
      <StockInfo />
    </DefaultLayout>
  );
};

export default Home;
