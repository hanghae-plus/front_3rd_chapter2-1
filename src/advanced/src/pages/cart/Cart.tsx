import React from 'react';
import { DEFAULT_PRODUCT_LIST } from './constant/defaultProducts';

const Cart = () => {
  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items">
          {DEFAULT_PRODUCT_LIST.map((item) => (
            <div key={item.id} className="flex justify-between items-center mb-2">
              <span>
                {item.name} - {item.price}원 x {item.selectQuantity || 0}
              </span>
              <div>
                <button className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1">
                  -
                </button>
                <button className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1">
                  +
                </button>
                <button className="remove-item bg-red-500 text-white px-2 py-1 rounded">
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="text-xl font-bold my-4">
          <span>총액: 0원</span>
          <span className="text-blue-500 ml-2">(포인트: 0)</span>
        </div>
        <select className="border rounded p-2 mr-2">
          {DEFAULT_PRODUCT_LIST.map((product) => (
            <option key={product.id} disabled={product.quantity === 0} value={product.id}>
              {product.name} - {product.price}원
            </option>
          ))}
        </select>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
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
