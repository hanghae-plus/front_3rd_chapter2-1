import { useCallback, useEffect, useState } from "react";

import { remainingStock } from "@/utils/stock";

export default function useCart<T extends { id: string; q: number }>(initialOptions: T[]) {
  const [hasNoStockOption, setHasNoStockOption] = useState(false);
  const [cartItems, setCartItems] = useState<T[]>(() => initialOptions.map((option) => ({ ...option, q: 0 })));

  const updateCartItem = useCallback(
    (id: string, updates: Partial<T>) => {
      const updatedOption = cartItems.map((item) => {
        if (item.id !== id) return item;

        const newQuantity = ("q" in updates ? updates.q! : +item.q) + item.q;
        const stock = remainingStock(id, newQuantity, initialOptions);
        const isNoStock = stock < 0 && item.q > 0;
        if (isNoStock) {
          setHasNoStockOption(true);
          return item;
        }
        return { ...item, ...updates, q: newQuantity };
      });
      setCartItems(updatedOption);
    },
    [initialOptions, cartItems],
  );

  useEffect(() => {
    if (hasNoStockOption) {
      alert("재고가 부족합니다.");
      setHasNoStockOption(false);
    }
  }, [hasNoStockOption]);

  return { cartItems, updateCartItem };
}
