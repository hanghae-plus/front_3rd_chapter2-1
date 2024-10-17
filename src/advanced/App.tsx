import { createContext } from 'react';

import './App.css';
import HeaderTitle from './components/HeaderTitle';
import CartInfo from './components/CartInfo';
import TotalPrice from './components/TotalPrice';
import ProductSelect from './components/ProductSelect';
import CartAddButton from './components/CartAddButton';
import StockStatus from './components/StockStatus';
import { CartContext } from './contexts/CartContext';
import { ProductContext } from './contexts/ProductContext';

function App() {
  const productList = [
    { id: 'p1', name: '상품1', price: 10000, stock: 50 },
    { id: 'p2', name: '상품2', price: 20000, stock: 30 },
    { id: 'p3', name: '상품3', price: 30000, stock: 20 },
    { id: 'p4', name: '상품4', price: 15000, stock: 0 },
    { id: 'p5', name: '상품5', price: 25000, stock: 10 },
  ];

  const cartItemList = [
    { id: 'p1', name: '상품1', price: 10000, stock: 50 },
    { id: 'p2', name: '상품2', price: 20000, stock: 30 },
    { id: 'p3', name: '상품3', price: 30000, stock: 20 },
    { id: 'p4', name: '상품4', price: 15000, stock: 0 },
    { id: 'p5', name: '상품5', price: 25000, stock: 10 },
  ];

  return (
    <CartContext.Provider value={{ items: cartItemList }}>
      <ProductContext.Provider value={{ products: productList }}>
        <div className="bg-gray-100 p-8">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
            <HeaderTitle />
            <CartInfo />
            <TotalPrice />
            <ProductSelect />
            <CartAddButton />
            <StockStatus />
          </div>
        </div>
      </ProductContext.Provider>
    </CartContext.Provider>
  );
}

export default App;
