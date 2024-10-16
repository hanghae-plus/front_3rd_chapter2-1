import { useCallback, useMemo } from "react";

import { ProductOption } from "../types/cart";

const useOutOfStock = (items: ProductOption[], options: ProductOption[]) => {
  const memorizedItems = useMemo(() => items, [items]);
  const memorizedOptions = useMemo(() => options, [options]);

  const remainingStock = useCallback(
    (itemId: string, quantity: number) => {
      const originalItem = memorizedOptions.find((option) => option.id === itemId);
      if (!originalItem) return 0;
      const stock = originalItem.q - quantity;
      return stock;
    },
    [memorizedOptions],
  );

  const systemAlert = useCallback(() => {
    memorizedItems.forEach((item) => {
      const stock = remainingStock(item.id, item.q);
      if (stock <= 0 && item.q > 0) {
        alert("재고가 부족합니다.");
      }
    });
  }, [memorizedItems, remainingStock]);

  return { alert: systemAlert };
};

export default useOutOfStock;
