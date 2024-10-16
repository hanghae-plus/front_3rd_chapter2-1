// src/components/App.tsx
import React, { useState, useEffect } from 'react';
import ProductSelect from './components/ProductSelect';
import Cart from './components/cart';
import CartTotal from './components/CartTotal';
import StockStatus from './components/stock-status';
import { productList as initialProductList, discountsOfProduct } from './data/dummy';
import { Product, CartItem, AppState } from './types';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProductList);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [state, setState] = useState<AppState>({
    lastSelected: null,
    bonusPoints: 0,
    totalAmount: 0,
    itemCount: 0,
    discountRate: 0,
  });

  // Handle adding product to cart
  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product && product.stock > 0) {
      const existingItem = cartItems.find((item) => item.id === productId);
      if (existingItem) {
        updateCartItem(productId, 1);
      } else {
        setCartItems([...cartItems, { ...product, quantity: 1 }]);
      }
      setProducts(products.map((p) => (p.id === productId ? { ...p, stock: p.stock - 1 } : p)));
      setState((prev) => ({ ...prev, lastSelected: productId }));
    } else {
      alert('재고가 부족합니다.');
    }
  };

  // Handle updating cart item quantity
  const updateCartItem = (productId: string, change: number) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.id === productId) {
            const newQuantity = item.quantity + change;
            const product = products.find((p) => p.id === productId);
            if (product && newQuantity > 0 && newQuantity <= item.quantity + product.stock) {
              setProducts(
                products.map((p) => (p.id === productId ? { ...p, stock: p.stock - change } : p))
              );
              return { ...item, quantity: newQuantity };
            } else {
              alert('재고가 부족합니다.');
              return item;
            }
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  // Handle removing item from cart
  const removeCartItem = (productId: string) => {
    const item = cartItems.find((item) => item.id === productId);
    if (item) {
      setProducts(
        products.map((p) => (p.id === productId ? { ...p, stock: p.stock + item.quantity } : p))
      );
      setCartItems(cartItems.filter((item) => item.id !== productId));
    }
  };

  // Calculate cart totals and discounts
  const calculateCart = () => {
    let totalAmount = 0;
    let itemCount = 0;
    let subTotal = 0;

    cartItems.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      let discount = item.quantity >= 10 ? discountsOfProduct[item.id] || 0 : 0;
      totalAmount += itemTotal * (1 - discount);
      itemCount += item.quantity;
      subTotal += itemTotal;
    });

    let discountRate = 0;
    if (itemCount >= 30) {
      const bulkDiscount = totalAmount * 0.25;
      const itemDiscount = subTotal - totalAmount;
      if (bulkDiscount > itemDiscount) {
        totalAmount = subTotal * (1 - 0.25);
        discountRate = 0.25;
      } else {
        discountRate = (subTotal - totalAmount) / subTotal;
      }
    } else {
      discountRate = subTotal > 0 ? (subTotal - totalAmount) / subTotal : 0;
    }

    // Apply discount rate processing
    const today = new Date();
    if (today.getDay() === 2) {
      // 화요일 (0: 일요일, 1: 월요일, 2: 화요일, ...)
      totalAmount *= 0.9;
      discountRate = Math.max(discountRate, 0.1);
    }

    // Update bonus points
    const bonusPoints = state.bonusPoints + Math.floor(totalAmount / 1000);

    // Update state
    setState((prev) => ({
      ...prev,
      totalAmount: Math.round(totalAmount),
      itemCount,
      discountRate,
      bonusPoints,
    }));
  };

  // Update stock options and handle time sales
  useEffect(() => {
    calculateCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems, products]);

  // Time Sale Setup
  // useEffect(() => {
  //   // 번개세일: 30초마다 확률적으로 발생
  //   const lightningSaleInterval = setInterval(() => {
  //     const availableProducts = products.filter((p) => p.stock > 0);
  //     if (availableProducts.length === 0) return;
  //     const luckyItem = availableProducts[Math.floor(Math.random() * availableProducts.length)];
  //     if (Math.random() < 0.3) {
  //       const discountedPrice = Math.round(luckyItem.price * 0.8);
  //       alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
  //       setProducts((prev) =>
  //         prev.map((p) => (p.id === luckyItem.id ? { ...p, price: discountedPrice } : p))
  //       );
  //     }
  //   }, 30000);

  //   // 추가 할인 제안: 60초마다 발생
  //   const suggestInterval = setInterval(() => {
  //     if (!state.lastSelected) return;
  //     const suggest = products.find((p) => p.id !== state.lastSelected && p.stock > 0);
  //     if (suggest) {
  //       alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
  //       const discountedPrice = Math.round(suggest.price * 0.95);
  //       setProducts((prev) =>
  //         prev.map((p) => (p.id === suggest.id ? { ...p, price: discountedPrice } : p))
  //       );
  //     }
  //   }, 60000);

  //   return () => {
  //     clearInterval(lightningSaleInterval);
  //     clearInterval(suggestInterval);
  //   };
  // }, [products, state.lastSelected]);

  return (
    <div className="bg-gray-100 p-8 min-h-screen">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <Cart
          cartItems={cartItems}
          onQuantityChange={updateCartItem}
          onRemoveItem={removeCartItem}
        />
        <CartTotal
          totalAmount={state.totalAmount}
          discountRate={state.discountRate}
          bonusPoints={state.bonusPoints}
        />
        <ProductSelect products={products} onAddToCart={handleAddToCart} />
        <StockStatus products={products} />
      </div>
    </div>
  );
};

export default App;
