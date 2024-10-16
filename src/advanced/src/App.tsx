import React, { useState } from 'react';

const initProductList = () => [
  { id: 'p1', name: '상품1', price: 10000, quantity: 50, discountRate: 0.1 },
  { id: 'p2', name: '상품2', price: 20000, quantity: 30, discountRate: 0.15 },
  { id: 'p3', name: '상품3', price: 30000, quantity: 20, discountRate: 0.2 },
  { id: 'p4', name: '상품4', price: 15000, quantity: 0, discountRate: 0.05 },
  { id: 'p5', name: '상품5', price: 25000, quantity: 10, discountRate: 0.25 },
];

const App: React.FC = () => {
  const [productList, setProductList] = useState(initProductList());
  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items"></div>
        <div id="cart-total" className="text-xl font-bold my-4"></div>
        <select id="product-select" className="border rounded p-2 mr-2">
          {productList.map((product) => (
            <option
              key={product.id}
              value={product.id}
              disabled={product.quantity === 0}
            >
              {`${product.name} - ${product.price}원`}
            </option>
          ))}
        </select>
        <button
          id="add-to-cart"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          추가
        </button>
        <div id="stock-status" className="text-sm text-gray-500 mt-2"></div>
      </div>
    </div>
  );
};

export default App;
