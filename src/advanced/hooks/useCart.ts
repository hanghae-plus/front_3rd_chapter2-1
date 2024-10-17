import { useState, useCallback, useEffect } from 'react';
import { IProductList } from '../models/Product';

interface CartItem extends IProductList {
  quantity: number; // 사용자가 선택한 상품의 수량이기 때문에 stock이 아닌 quantity로 명명
}

interface DiscountResult {
  updatedTotal: number;
  updatedDiscountRate: number;
}

export function useCart(products: IProductList[], updateProductStock: (id: string, change: number) => void) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState<number>(0);
  const [discountRate, setDiscountRate] = useState<number>(0);
  const [bonusPoints, setBonusPoints] = useState<number>(0);

  const addToCart = useCallback((productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product && product.stock > 0) {
      setCartItems((prev) => {
        const existingItem = prev.find((item) => item.id === productId);
        if (existingItem) {
          return prev.map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prev, { ...product, quantity: 1 }];
        }
      });
      updateProductStock(productId, -1);
    }
  }, [products, updateProductStock]);

  const updateCartItem = useCallback((productId: string, change: number) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item.id === productId) {
          const newQuantity = item.quantity + change;
          if (newQuantity > 0) {
            updateProductStock(productId, -change);
            return { ...item, quantity: newQuantity };
          } else {
            updateProductStock(productId, item.quantity);
            return null;
          }
        }
        return item;
      });
      return updatedItems.filter((item): item is CartItem => item !== null);
    });
  }, [updateProductStock]);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems((prevItems) => {
      const itemToRemove = prevItems.find((item) => item.id === productId);
      if (itemToRemove) {
        updateProductStock(productId, itemToRemove.quantity);
      }
      return prevItems.filter((item) => item.id !== productId);
    });
  }, [updateProductStock]);

  useEffect(() => {
    const calculateCart = () => {
      let total = 0;
      let itemCount = 0;
      let subtotal = 0;

      cartItems.forEach((item) => {
        const itemTotal = item.price * item.quantity;
        const discount = calculateItemDiscount(item, item.quantity);
        itemCount += item.quantity;
        subtotal += itemTotal;
        total += itemTotal * (1 - discount);
      });

      let discountRate = subtotal > 0 ? (subtotal - total) / subtotal : 0;

      total = applyBulkDiscount(total, subtotal, itemCount);

      const { updatedTotal, updatedDiscountRate } = applyWeekdayDiscount(total, discountRate);
      total = updatedTotal;
      discountRate = updatedDiscountRate;

      setCartTotal(total);
      setDiscountRate(discountRate);
      setBonusPoints(Math.floor(total / 1000));
    };

    calculateCart();
  }, [cartItems]);

  return {
    cartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartTotal,
    discountRate,
    bonusPoints,
  };
}
const calculateItemDiscount = (item: CartItem, quantity: number): number => {
  if (quantity >= 10) {
    switch (item.id) {
      case 'p1': return 0.1;
      case 'p2': return 0.15;
      case 'p3': return 0.2;
      case 'p4': return 0.05;
      case 'p5': return 0.25;
      default: return 0;
    }
  }
  return 0;
}

const applyBulkDiscount = (totalAmt: number, subTotal: number, itemCount: number): number => {
  if (itemCount >= 30) {
    return Math.max(totalAmt * 0.75, subTotal);
  }
  return totalAmt;
}

const applyWeekdayDiscount = (totalAmt: number, discountRate: number): DiscountResult => {
  const dayOfWeek = new Date().getDay();
  if (dayOfWeek === 2) {
    totalAmt *= 0.9;
    discountRate = Math.max(discountRate, 0.1);
  }
  return { updatedTotal: totalAmt, updatedDiscountRate: discountRate };
}