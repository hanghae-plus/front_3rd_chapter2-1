import { useState, useEffect, useCallback } from 'react';
import { Product, CartItem } from '../types';
import { PRODUCT_LIST } from '../constants';
import { applyRandomFlashSale, suggestProduct } from '../utils/promotions';

export function useShoppingCart() {
  const [products, setProducts] = useState<Product[]>(PRODUCT_LIST);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [bonusPoints, setBonusPoints] = useState(0);
  const [lastSelectedProduct, setLastSelectedProduct] = useState<string | null>(null);

  /**
   * 장바구니에 상품을 추가하는 함수
   * @param productId 추가할 상품의 ID
   */
  const addToCart = useCallback((productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product && product.quantity > 0) {
      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.id === productId);
        if (existingItem) {
          return prevCart.map((item) =>
            item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          return [...prevCart, { ...product, quantity: 1 }];
        }
      });
      setProducts((prevProducts) =>
        prevProducts.map((p) => (p.id === productId ? { ...p, quantity: p.quantity - 1 } : p))
      );
      setLastSelectedProduct(productId);
    }
  }, [products]);

  /**
   * 장바구니 내 상품 수량을 업데이트하는 함수
   * @param productId 수량을 변경할 상품의 ID
   * @param change 변경할 수량 (양수: 증가, 음수: 감소)
   */
  const updateCartItemQuantity = useCallback((productId: string, change: number) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) => {
        if (item.id === productId) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      }).filter((item): item is CartItem => item !== null);

      setProducts((prevProducts) =>
        prevProducts.map((p) => (p.id === productId ? { ...p, quantity: p.quantity - change } : p))
      );

      return updatedCart;
    });
  }, []);

  /**
   * 장바구니에서 상품을 제거하는 함수
   * @param productId 제거할 상품의 ID
   */
  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => {
      const itemToRemove = prevCart.find((item) => item.id === productId);
      if (itemToRemove) {
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.id === productId ? { ...p, quantity: p.quantity + itemToRemove.quantity } : p
          )
        );
      }
      return prevCart.filter((item) => item.id !== productId);
    });
  }, []);

  useEffect(() => {
    // 30초마다 랜덤 플래시 세일 적용
    const flashSaleInterval = setInterval(() => {
      setProducts((prevProducts) => applyRandomFlashSale(prevProducts));
    }, 30000);

    // 60초마다 상품 추천
    const suggestProductInterval = setInterval(() => {
      setProducts((prevProducts) => suggestProduct(prevProducts, lastSelectedProduct));
    }, 60000);

    return () => {
      clearInterval(flashSaleInterval);
      clearInterval(suggestProductInterval);
    };
  }, [lastSelectedProduct]);

  return {
    products,
    cart,
    bonusPoints,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    setBonusPoints,
  };
}
