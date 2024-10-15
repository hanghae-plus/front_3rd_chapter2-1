import React, { useState, useEffect } from "react";
// import { addCart, updateCart } from '../features/Cart';

const App: React.FC = () => {
  const [cartItems, setCartItems] = useState<JSX.Element[]>([]);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    // 장바구니 업데이트 로직 구현
    // ...
  }, [cartItems]);

  const handleAddToCart = () => {
    // addCart(selectEl, cartContainer);
    // 장바구니 상태 업데이트 로직 추가
  };

  const handleCartUpdate = (event: React.MouseEvent<HTMLDivElement>) => {
    // updateCart(event);
    // 장바구니 상태 업데이트 로직 추가
  };

  return (
    <main>
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items" onClick={handleCartUpdate}>
          {cartItems}
        </div>
        <div id="cart-total" className="text-xl font-bold my-4">
          총액: {total}원
        </div>
        <select id="product-select" className="border rounded p-2 mr-2">
          {/* 상품 옵션들을 여기에 추가 */}
        </select>
        <button
          id="add-to-cart"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleAddToCart}
        >
          추가
        </button>
        <div id="stock-status" className="text-sm text-gray-500 mt-2">
          {/* 재고 상태 정보 */}
        </div>
      </div>
    </main>
  );
};

export default App;
