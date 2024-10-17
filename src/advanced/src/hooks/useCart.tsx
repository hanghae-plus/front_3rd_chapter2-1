import { useCallback, useState } from "react";

export default function useCart<T extends { id: string; q: number }>(initialOptions: T[]) {
  const [cartItems, setCartItems] = useState<T[]>(() => initialOptions.map((option) => ({ ...option, q: 0 })));

  const remainingStock = useCallback((itemId: string, quantity: number, initialOptions: T[]) => {
    const originalItem = initialOptions.find((option) => option.id === itemId);
    if (!originalItem) return 0;
    const stock = originalItem.q - quantity;
    return stock;
  }, []);

  const updateCartItem = useCallback(
    (id: string, updates: Partial<T>) => {
      setCartItems((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            const newQuantity = ("q" in updates ? updates.q! : +item.q) + item.q;
            const stock = remainingStock(id, newQuantity, initialOptions);
            if (stock < 0 && item.q > 0) {
              alert("재고가 부족합니다."); //! 맘에 들지 않아
              return item;
            }

            return { ...item, ...updates, q: newQuantity };
          }
          return item;
        }),
      );
    },
    [remainingStock, initialOptions],
  );

  return { cartItems, updateCartItem };
}
