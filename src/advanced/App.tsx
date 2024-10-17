import React, { useState, useEffect, useCallback } from "react";

import {
  DISCOUNT_RATES,
  BULK_DISCOUNT_THRESHOLD,
  BULK_DISCOUNT_RATE,
  TUESDAY_DISCOUNT_RATE,
  POINTS_PER_1000_WON,
  FLASH_SALE_INTERVAL,
  FLASH_SALE_DISCOUNT,
  FLASH_SALE_PROBABILITY,
  SUGGESTION_INTERVAL,
  SUGGESTION_DISCOUNT,
} from "../constants/index";
import { Product, CartItem } from "../types/types";
import { CartItemSelect } from "../components/CartItemSelect";
import { ProductSelect } from "../components/ProductSelect";

const initialProducts: Product[] = [
  { id: "p1", name: "상품1", value: 10000, quantity: 50 },
  { id: "p2", name: "상품2", value: 20000, quantity: 30 },
  { id: "p3", name: "상품3", value: 30000, quantity: 20 },
  { id: "p4", name: "상품4", value: 15000, quantity: 0 },
  { id: "p5", name: "상품5", value: 25000, quantity: 10 },
];

const ShoppingApp: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [bonusPoints, setBonusPoints] = useState<number>(0);
  const [lastSelectedProduct, setLastSelectedProduct] = useState<string | null>(
    null
  );

  const calculateCart = useCallback(() => {
    let subtotal = 0;
    let itemCount = 0;
    let newTotalAmount = 0;

    cart.forEach((item) => {
      const itemTotal = item.value * item.cartQuantity;
      itemCount += item.cartQuantity;
      subtotal += itemTotal;

      const discount =
        item.cartQuantity >= 10 ? DISCOUNT_RATES[item.id] || 0 : 0;
      newTotalAmount += itemTotal * (1 - discount);
    });

    if (itemCount >= BULK_DISCOUNT_THRESHOLD) {
      const bulkDiscount = newTotalAmount * BULK_DISCOUNT_RATE;
      const itemDiscount = subtotal - newTotalAmount;
      if (bulkDiscount > itemDiscount) {
        newTotalAmount = subtotal * (1 - BULK_DISCOUNT_RATE);
      }
    }

    if (new Date().getDay() === 2) {
      newTotalAmount *= 1 - TUESDAY_DISCOUNT_RATE;
    }

    setTotalAmount(newTotalAmount);
    setBonusPoints(
      (prev) => prev + Math.floor(newTotalAmount / 1000) * POINTS_PER_1000_WON
    );
  }, [cart]);

  useEffect(() => {
    calculateCart();
  }, [cart, calculateCart]);

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product && product.quantity > 0) {
      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.id === productId);
        if (existingItem) {
          return prevCart.map((item) =>
            item.id === productId
              ? { ...item, cartQuantity: item.cartQuantity + 1 }
              : item
          );
        } else {
          return [...prevCart, { ...product, cartQuantity: 1 }];
        }
      });
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === productId ? { ...p, quantity: p.quantity - 1 } : p
        )
      );
      setLastSelectedProduct(productId);
    }
  };

  const handleQuantityChange = (productId: string, change: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === productId) {
            const newQuantity = item.cartQuantity + change;
            if (newQuantity <= 0) {
              return null;
            }
            return { ...item, cartQuantity: newQuantity };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === productId ? { ...p, quantity: p.quantity - change } : p
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    const removedItem = cart.find((item) => item.id === productId);
    if (removedItem) {
      setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === productId
            ? { ...p, quantity: p.quantity + removedItem.cartQuantity }
            : p
        )
      );
    }
  };

  useEffect(() => {
    const flashSaleInterval = setInterval(() => {
      const luckyItem = products[Math.floor(Math.random() * products.length)];
      if (Math.random() < FLASH_SALE_PROBABILITY && luckyItem.quantity > 0) {
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.id === luckyItem.id
              ? { ...p, value: Math.round(p.value * (1 - FLASH_SALE_DISCOUNT)) }
              : p
          )
        );
        alert(
          `번개세일! ${luckyItem.name}이(가) ${
            FLASH_SALE_DISCOUNT * 100
          }% 할인 중입니다!`
        );
      }
    }, FLASH_SALE_INTERVAL);

    return () => clearInterval(flashSaleInterval);
  }, [products]);

  useEffect(() => {
    const suggestionInterval = setInterval(() => {
      if (lastSelectedProduct) {
        const suggestedProduct = products.find(
          (item) => item.id !== lastSelectedProduct && item.quantity > 0
        );
        if (suggestedProduct) {
          alert(
            `${suggestedProduct.name}은(는) 어떠세요? 지금 구매하시면 ${
              SUGGESTION_DISCOUNT * 100
            }% 추가 할인!`
          );
          setProducts((prevProducts) =>
            prevProducts.map((p) =>
              p.id === suggestedProduct.id
                ? {
                    ...p,
                    value: Math.round(p.value * (1 - SUGGESTION_DISCOUNT)),
                  }
                : p
            )
          );
        }
      }
    }, SUGGESTION_INTERVAL);

    return () => clearInterval(suggestionInterval);
  }, [lastSelectedProduct, products]);

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items">
          {cart.map((item) => (
            <CartItemSelect
              key={item.id}
              item={item}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemoveItem}
            />
          ))}
        </div>
        <div className="text-xl font-bold my-4">
          총액: {Math.round(totalAmount)}원
          <span className="text-blue-500 ml-2">(포인트: {bonusPoints})</span>
        </div>
        <ProductSelect products={products} onAddToCart={handleAddToCart} />
        <div className="text-sm text-gray-500 mt-2">
          {products
            .filter((item) => item.quantity < 5)
            .map((item) => (
              <div key={item.id}>
                {item.name}:{" "}
                {item.quantity > 0
                  ? `재고 부족 (${item.quantity}개 남음)`
                  : "품절"}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ShoppingApp;
