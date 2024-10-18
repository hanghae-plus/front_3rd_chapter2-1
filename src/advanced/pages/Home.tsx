import React from 'react';
import DefaultLayout from '../layouts/DefaultLayout';
import { CartItems, CartTotal, ProductsSelection, ProductsStock } from '../components';

const Home: React.FC = () => {
  return (
    <DefaultLayout>
      <h1 className="text-2xl font-bold mb-4">장바구니</h1>
      <CartItems />
      <CartTotal />
      <ProductsSelection />
      <ProductsStock />
    </DefaultLayout>
  );
};

export default Home;
