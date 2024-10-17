import { useMemo } from "react";

import { ProductOption } from "@/types";
import { remainingStock } from "@/utils/stock";

type StockStatusTextProps = {
  items: ProductOption[];
  productOptions: ProductOption[];
};

const StockStatusText = ({ items, productOptions }: StockStatusTextProps) => {
  const stockStatusText = useMemo(() => {
    const stockStatus = items.map((item) => {
      const stock = remainingStock(item.id, item.quantity, productOptions);
      if (stock >= 5) return "";
      return `${item.name}: ${stock > 0 ? `재고 부족 (${stock}개 남음)` : "품절"}`;
    });

    return stockStatus.join("\n").trim();
  }, [items, productOptions]);

  return (
    <div id="stock-status" className="text-sm text-gray-500 mt-2 whitespace-pre-wrap">
      {stockStatusText}
    </div>
  );
};

export default StockStatusText;
