import { useEffect, useRef } from "react";

import { productOptions } from "@/constants";
import { ProductOption } from "@/types";

function useAdditionalDiscountEvent(callback: (data: ProductOption) => void) {
  const lastSelectedIdRef = useRef<string | null>(null);
  useEffect(() => {
    const suggestAdditionalDiscount = () => {
      const interval = () => {
        setInterval(() => {
          if (lastSelectedIdRef.current) {
            const suggestItem: ProductOption | undefined = productOptions.find(
              (item) => item.id !== lastSelectedIdRef.current && item.q > 0,
            );
            if (suggestItem) {
              alert(suggestItem.name + "은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!");
              suggestItem.val = Math.round((suggestItem?.val ?? 0) * 0.95);
              callback(suggestItem);
            }
          }
        }, 60000);
      };
      setTimeout(interval, Math.random() * 20000);
    };

    suggestAdditionalDiscount();
  }, [callback]);

  return lastSelectedIdRef;
}

export default useAdditionalDiscountEvent;
