import { useState, useEffect, useCallback } from "react";
import type { Product } from "../types";

interface RandomDiscountProps {
  productList: Product[];
  setProductList: (newList: Product[]) => void;
}

// 랜덤 할인
export const useRandomDiscount = ({ productList, setProductList }: RandomDiscountProps) => {
  const [discountedProduct, setDiscountedProduct] = useState<Product | null>(null);

  const applyRandomDiscount = useCallback(() => {
    const availableProducts = productList.filter((product) => product.quantity > 0);
    if (availableProducts.length === 0) return;

    const luckyItem = availableProducts[Math.floor(Math.random() * availableProducts.length)];
    if (Math.random() < 0.3) {
      const discountedPrice = Math.round(luckyItem.price * 0.8);
      const updatedProduct = { ...luckyItem, price: discountedPrice };

      setProductList(
        productList.map((product) => (product.id === luckyItem.id ? updatedProduct : product)),
      );

      setDiscountedProduct(updatedProduct);
    }
  }, [productList, setProductList]);

  // 랜덤 할인 주기
  useEffect(() => {
    const delay = Math.random() * 10000;
    const interval = 30000;

    const timeoutId = setTimeout(() => {
      applyRandomDiscount();
      const intervalId = setInterval(applyRandomDiscount, interval);
      return () => clearInterval(intervalId);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [applyRandomDiscount]);

  return discountedProduct;
};
