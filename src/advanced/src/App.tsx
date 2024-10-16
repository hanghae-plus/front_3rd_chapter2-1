import React, { useState, useEffect, useMemo } from "react";
import { Product } from "./types";
// import { addCart, updateCart } from '../features/Cart';

const initialProductList = [
  { id: "p1", name: "상품1", price: 10000, quantity: 50 },
  { id: "p2", name: "상품2", price: 20000, quantity: 30 },
  { id: "p3", name: "상품3", price: 30000, quantity: 20 },
  { id: "p4", name: "상품4", price: 15000, quantity: 0 },
  { id: "p5", name: "상품5", price: 25000, quantity: 10 },
];

const App: React.FC = () => {
  const [productList, setProductList] = useState<Product[]>(initialProductList);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [accumulatedPoints, setAccumulatedPoints] = useState<number>(0);
  const [selectProductId, setSelectProductId] = useState<string>(productList[0].id);

  const AddToCart = () => {
    const product = productList.find((product) => product.id === selectProductId);

    if (product && product.quantity <= 0) return;

    if (product) {
      const updatedCart = [...cartItems];
      const existingItem = updatedCart.find((item) => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        updatedCart.push({ ...product, quantity: 1 });
      }
      setCartItems(updatedCart);

      setTotal(updatedCart.reduce((acc, curr) => acc + curr.price * curr.quantity, 0));

      const updatedProductList = productList.map((p) =>
        p.id === product.id ? { ...p, quantity: p.quantity - 1 } : p,
      );
      setProductList(updatedProductList);
    }
  };

  const removeCartItem = (productId: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== productId);
    setCartItems(updatedCart);
    setProductList((prevProductList) => {
      return prevProductList.map((product) =>
        product.id === productId
          ? {
              ...product,
              quantity: initialProductList.find((p) => p.id === productId)?.quantity || 0,
            }
          : product,
      );
    });
    setTotal(updatedCart.reduce((acc, curr) => acc + curr.price * curr.quantity, 0));
  };

  const updateCartItemQuantity = (productId: string, change: number) => {
    const product = cartItems.find((product) => product.id === productId);
    if (!product) return;
    console.log(product.quantity, change);
    if (product.quantity === 1 && change === -1) {
      removeCartItem(productId);
      return;
    }

    const updatedCart = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + change } : item,
    );
    setCartItems(updatedCart);
    setProductList((prevProductList) => {
      return prevProductList.map((product) =>
        product.id === productId ? { ...product, quantity: product.quantity - change } : product,
      );
    });
    setTotal(updatedCart.reduce((acc, curr) => acc + curr.price * curr.quantity, 0));
  };

  useEffect(() => {
    const newPoints = Math.floor(total / 1000);

    setAccumulatedPoints((prevPoints) => prevPoints + newPoints);
  }, [total]);

  const infoMessage = useMemo(() => {
    return productList
      .filter((item) => item.quantity < 5)
      .map(
        (item) =>
          `${item.name}: ${item.quantity > 0 ? `재고 부족 (${item.quantity}개 남음)` : "품절"} `,
      );
  }, [productList]);

  return (
    <main>
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center mb-2">
              <span>
                {item.name} - {item.price}원 x {item.quantity}
              </span>
              <div>
                <button
                  className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                  data-product-id={item.id}
                  onClick={() => updateCartItemQuantity(item.id, -1)}
                >
                  -
                </button>
                <button
                  className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                  data-product-id={item.id}
                  onClick={() => updateCartItemQuantity(item.id, +1)}
                >
                  +
                </button>
                <button
                  className="remove-item bg-red-500 text-white px-2 py-1 rounded"
                  data-product-id={item.id}
                  onClick={() => removeCartItem(item.id)}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
        <div id="cart-total" className="text-xl font-bold my-4">
          <span>총액: {total}원</span>
          <span className="text-blue-500 ml-2">(포인트: {accumulatedPoints}점)</span>
        </div>
        <select
          id="product-select"
          className="border rounded p-2 mr-2"
          value={selectProductId}
          onChange={(e) => setSelectProductId(e.target.value)}
        >
          {productList.map((product) => (
            <option key={product.id} value={product.id} disabled={product.quantity <= 0}>
              {product.name} - {product.price}원
            </option>
          ))}
        </select>
        <button
          id="add-to-cart"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={AddToCart}
        >
          추가
        </button>
        <div id="stock-status" className="text-sm text-gray-500 mt-2">
          {infoMessage}
        </div>
      </div>
    </main>
  );
};

export default App;
