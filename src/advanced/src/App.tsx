import React, { useState, useEffect } from 'react';
import CartItem from './components/CartItem';
import CartTotal from './components/CartTotal';
import ProductSelect from './components/ProductSelect';
import StockStatus from './components/StockStatus';
import { PRODUCT_DATA, DISCOUTNT_RULES_OF_TUESDAY, QUANTITY, DISCOUNT_RULES } from './constants';

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Cart {
  [key: string]: number;
}

function App() {
  const [productList, setProductList] = useState<Product[]>(PRODUCT_DATA);
  const [cart, setCart] = useState<Cart>({});
  const [bonusPoint, setBonusPoint] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [discountRate, setDiscountRate] = useState<number>(0);

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
        <CartItem cart={cart} productList={productList} setCart={setCart} setProductList={setProductList} />
        <CartTotal discountRate={discountRate} totalAmount={totalAmount} bonusPoint={bonusPoint} />
        <ProductSelect setCart={setCart} productList={productList} setProductList={setProductList} />
        <StockStatus productList={productList} />
      </div>
    </div>
  );
}

export default App;
