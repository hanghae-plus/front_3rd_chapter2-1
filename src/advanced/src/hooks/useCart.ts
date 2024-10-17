// src/hooks/useCart.ts
import { useState, useEffect } from 'react';
import { Product, CartItem, AppState } from '../types';
import { discountsOfProduct } from '../data/dummy';
import { calculateTotalAmount } from '../utils/index';

interface UseCartProps {
  productList: Product[];
}

const useCart = ({ productList }: UseCartProps) => {
  const [products, setProducts] = useState<Product[]>(productList);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [lastSelected, setLastSelected] = useState<string | null>(null);

  // 상품 추가
  const addToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product && product.stock > 0) {
      const existingItem = cartItems.find((item) => item.id === productId);
      if (existingItem) {
        updateCartItem(productId, 1);
      } else {
        setCartItems([...cartItems, { ...product, quantity: 1 }]);
      }
      setLastSelected(productId);
      // setState((prev) => ({ ...prev, lastSelected: productId }));
      setProducts(products.map((p) => (p.id === productId ? { ...p, stock: p.stock - 1 } : p)));
    } else {
      alert('재고가 부족합니다.');
    }
  };

  // 장바구니 아이템 수량 변경
  const updateCartItem = (productId: string, change: number) => {
    const product = products.find((p) => p.id === productId);
  
    if (!product) {
      console.error(`Product with id ${productId} not found`);
      return;
    }
  
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.id !== productId) return item;
  
          const newQuantity = item.quantity + change;
  
          if (newQuantity < 0 || newQuantity > item.quantity + product.stock) {
            alert('재고가 부족합니다.');
            return item;
          }
  
          // 업데이트된 상품 상태 반영
          setProducts((prevProducts) =>
            prevProducts.map((p) =>
              p.id === productId ? { ...p, stock: p.stock - change } : p
            )
          );
  
          return { ...item, quantity: newQuantity };
        })
        .filter((item) => item.quantity > 0)
    );
  };
  
  // 장바구니 아이템 삭제
  const removeFromCart = (productId: string) => {
    const item = cartItems.find((item) => item.id === productId);
    if (item) {
      setCartItems(cartItems.filter((item) => item.id !== productId));
      setProducts(
        products.map((p) => (p.id === productId ? { ...p, stock: p.stock + item.quantity } : p))
      );
    }
  };

  // 장바구니 계산
  const calculateCart = () => {
    const { totalAmount, itemCount, discountRate } = calculateTotalAmount(
      cartItems,
      discountsOfProduct
    );
    const today = new Date();
    let finalTotal = totalAmount;
    let finalDiscountRate = discountRate;

    // 화요일 추가 할인
    if (today.getDay() === 2) {
      finalTotal *= 0.9;
      finalDiscountRate = Math.max(finalDiscountRate, 0.1);
    }
    // 포인트 업데이트
    const bonusPoints = Math.floor(finalTotal / 1000);

    return {
      totalAmount: Math.round(finalTotal),
      itemCount,
      discountRate: finalDiscountRate,
      bonusPoints: bonusPoints,
    }
  };
  const state = calculateCart();

  // 시간 기반 세일 설정
  useEffect(() => {
    // 번개 세일: 30초마다 발생
    const lightningSaleInterval = setInterval(() => {
      const availableProducts = products.filter((p) => p.stock > 0);
      if (availableProducts.length === 0) return;
      const luckyItem = availableProducts[Math.floor(Math.random() * availableProducts.length)];
      if (Math.random() < 0.3) {
        const discountedPrice = Math.round(luckyItem.price * 0.8);
        alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        setProducts((prev) =>
          prev.map((p) => (p.id === luckyItem.id ? { ...p, price: discountedPrice } : p))
        );
      }
    }, 30000);

    // 추가 할인 제안: 60초마다 발생
    const suggestInterval = setInterval(() => {
      if (!lastSelected) return;
      const suggest = products.find((p) => p.id !== lastSelected && p.stock > 0);
      if (suggest) {
        alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
        const discountedPrice = Math.round(suggest.price * 0.95);
        setProducts((prev) =>
          prev.map((p) => (p.id === suggest.id ? { ...p, price: discountedPrice } : p))
        );
      }
    }, 60000);

    return () => {
      clearInterval(lightningSaleInterval);
      clearInterval(suggestInterval);
    };
  }, [products, lastSelected]);


  return {
    products,
    cartItems,
    state,
    addToCart,
    updateCartItem,
    removeFromCart,
  };
};

export default useCart;
