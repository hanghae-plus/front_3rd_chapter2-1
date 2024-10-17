import React from 'react';
import { PRODUCT_LIST } from '../constants';
import { ShoppingCartProvider } from '../context/ShoppingCartContext';
import { Cart } from './Cart';
import { ProductList } from './ProductList';
import { StockInfo } from './StockInfo';
import { TotalDisplay } from './TotalDisplay';

export const App: React.FC = () => {
  return (
    <ShoppingCartProvider>
      <div className="bg-gray-100 p-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
          <h1 className="text-2xl font-bold mb-4">장바구니</h1>
          <Cart />
          <TotalDisplay />
          <ProductList />
          <StockInfo />
        </div>
      </div>
    </ShoppingCartProvider>
  );
};
