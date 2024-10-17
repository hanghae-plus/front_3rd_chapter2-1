import { useCallback, useEffect, useRef } from "react";

import { ProductOption } from "@/types";

const DISCOUNT_RATE = 0.05;
const INTERVAL_TIME = 60000;
const MAX_RANDOM_DELAY = 20000;

function useAdditionalDiscountEvent(
  targetList: ProductOption[],
  callback: (id: string, data: Partial<ProductOption>) => void,
) {
  const lastSelectedIdRef = useRef<string | null>(null);
  const suggestAdditionalDiscount = useCallback(() => {
    setInterval(() => {
      if (lastSelectedIdRef.current) {
        const suggestItem: ProductOption | undefined = targetList.find(
          (item) => item.id !== lastSelectedIdRef.current && item.quantity > 0,
        );
        if (suggestItem) {
          alert(suggestItem.name + "은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!");
          suggestItem.price = Math.round((suggestItem?.price ?? 0) * (1 - DISCOUNT_RATE));
          callback(suggestItem.id, { price: suggestItem.price });
        }
      }
    }, INTERVAL_TIME);
  }, [callback, targetList]);

  useEffect(() => {
    const timer = setTimeout(suggestAdditionalDiscount, MAX_RANDOM_DELAY);
    return () => {
      clearTimeout(timer);
    };
  }, [suggestAdditionalDiscount]);

  return lastSelectedIdRef;
}

export default useAdditionalDiscountEvent;
