import React, { useEffect } from 'react';
import {
  updateSelectOptionStatus,
  updateTotalPrice,
} from './services/render.service';
import { attatchEventListener } from './services/event.service';
import { applyExtraSale, applyLuckySale } from './services/sale.service';

const App: React.FC = () => {
  useEffect(() => {
    // 장바구니 페이지 렌더링
    updateSelectOptionStatus();
    updateTotalPrice();

    // 이벤트 리스너 추가
    attatchEventListener();

    // 할인 특가 설정
    applyLuckySale();
    applyExtraSale();
  }, []);

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items"></div>
        <div id="cart-total" className="text-xl font-bold my-4"></div>
        <select
          id="product-select"
          className="border rounded p-2 mr-2"
        ></select>
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
