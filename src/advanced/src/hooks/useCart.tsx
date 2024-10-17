import { useCallback, useEffect, useState } from "react";

import { remainingStock } from "@/utils/stock";

export default function useCart<T extends { id: string; quantity: number }>(initialOptions: T[]) {
  const [hasNoStockOption, setHasNoStockOption] = useState(false);
  const [cartItems, setCartItems] = useState<T[]>(() => initialOptions.map((option) => ({ ...option, quantity: 0 })));

  const updateCartItem = useCallback(
    (id: string, updates: Partial<T>) => {
      const updatedOption = cartItems.map((item) => {
        if (item.id !== id) return item;

        const newQuantity = ("quantity" in updates ? updates.quantity! : +item.quantity) + item.quantity;
        const stock = remainingStock(id, newQuantity, initialOptions);
        const isNoStock = stock < 0 && item.quantity > 0;
        if (isNoStock) {
          setHasNoStockOption(true);
          return item;
        }
        return { ...item, ...updates, quantity: newQuantity };
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
