import React, { useState, useEffect } from 'react';
import { PRODUCT_DATA, MESSAGE, DISCOUTNT_RULES_OF_TUESDAY, QUANTITY, DISCOUNT_RULES } from './constants';

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Cart {
  [key: string]: number;
}

function App() {
  const [productList, setProductList] = useState<Product[]>(PRODUCT_DATA);
  const [cart, setCart] = useState<Cart>({});
  const [bonusPoint, setBonusPoint] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [discountRate, setDiscountRate] = useState<number>(0);

  const handleAddToCart = (productId: string) => {
    const product = productList.find((product: Product) => product.id === productId);

    if (!product) {
      return;
    }

    if (product.quantity <= 0) {
      alert(MESSAGE.NOT_ENOUGH_PRODUCT);
      return;
    }

    setCart((prevCart: Cart) => ({
      ...prevCart,
      [productId]: (prevCart[productId] || 0) + 1,
    }));

    setProductList((prevList: Product[]) =>
      prevList.map((prev: Product) => (prev.id === productId ? { ...prev, quantity: prev.quantity - 1 } : prev)),
    );
  };

  const handleQuantityChange = (productId: string, change: number) => {
    if ((cart[productId] || 0) + change < 0) {
      return;
    }

    setCart((prevCart: Cart) => {
      const newCart = { ...prevCart, [productId]: (prevCart[productId] || 0) + change };
      if (newCart[productId] <= 0) {
        delete newCart[productId];
      }

      return newCart;
    });

    setProductList((prevList: Product[]) =>
      prevList.map((prev: Product) => (prev.id === productId ? { ...prev, quantity: prev.quantity - change } : prev)),
    );
  };

  const calculateCart = () => {
    let newTotalAmount = 0;
    let subTotal = 0;
    let itemCount = 0;
    let newDiscountRate = 0;

    Object.entries(cart).forEach(([productId, quantity]) => {
      const product = productList.find((item) => item.id === productId);

      if (!product) {
        return;
      }

      const productPrice = product.price * quantity;

      subTotal += productPrice;
      itemCount += quantity;

      const discount = quantity >= QUANTITY['10'] ? DISCOUNT_RULES[productId] : 0;

      newTotalAmount += productPrice * (1 - discount);
    });

    const bulkDiscount = newTotalAmount * DISCOUNT_RULES['bulk'];

    if (itemCount >= QUANTITY['30'] && bulkDiscount > subTotal - newTotalAmount) {
      newTotalAmount = subTotal * (1 - DISCOUNT_RULES['bulk']);
      newDiscountRate = DISCOUNT_RULES['bulk'];
    } else {
      newDiscountRate = (subTotal - newTotalAmount) / subTotal;
    }

    if (new Date().getDay() === DISCOUTNT_RULES_OF_TUESDAY.dayNumber) {
      newTotalAmount *= 1 - DISCOUTNT_RULES_OF_TUESDAY.discountRate;
      newDiscountRate = Math.max(newDiscountRate, DISCOUTNT_RULES_OF_TUESDAY.discountRate);
    }

    setTotalAmount(newTotalAmount);
    setDiscountRate(newDiscountRate);
    setBonusPoint((prev) => prev + Math.floor(newTotalAmount / 1000));
  };

  useEffect(() => {
    calculateCart();
  }, [cart]);

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items">
          {Object.entries(cart).map(([productId, quantity]) => {
            const product = productList.find((item) => item.id === productId);
            return (
              <div key={productId} className="flex justify-between items-center mb-2">
                <span>
                  {product?.name} - {product?.price}원 x {quantity}
                </span>
                <div>
                  <button
                    className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                    onClick={() => handleQuantityChange(productId, -1)}
                  >
                    -
                  </button>
                  <button
                    className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                    onClick={() => handleQuantityChange(productId, 1)}
                  >
                    +
                  </button>
                  <button
                    className="remove-item bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleQuantityChange(productId, -quantity)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div id="cart-total" className="text-xl font-bold my-4">
          총액 {Math.round(totalAmount)}원{' '}
          {discountRate > 0 && (
            <span className="text-green-500 ml-2">({(discountRate * 100).toFixed(1)}% 할인 적용)</span>
          )}
          <span id="loyalty-points" className="text-blue-500 ml-2">
            (포인트: {bonusPoint})
          </span>
        </div>
        <select
          id="product-select"
          className="border rounded p-2 mr-2"
          onChange={(e) => handleAddToCart(e.target.value)}
        >
          {productList.map((product: Product) => (
            <option key={product.id} value={product.id} disabled={product.quantity === 0}>
              {product.name} - {product.price}원
            </option>
          ))}
        </select>
        <div id="stock-status" className="text-sm text-gray-500 mt-2">
          {productList
            .filter((product: Product) => product.quantity < QUANTITY['5'])
            .map((product: Product) => (
              <div key={product.id}>
                {product.name}: {product.quantity > 0 ? `재고 부족 (${product.quantity}개 남음)` : '품절'}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;
