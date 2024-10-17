import React, { useEffect, useState } from "react";
import { productConst } from "../const";

const StockStatus = () => {
  const { PRODUCT_LIST } = productConst;

  const [infoMessage, setInfoMessage] = useState<string>("");

  useEffect(() => {
    PRODUCT_LIST.forEach((item) => {
      if (item.quantity > 5) return;

      setInfoMessage(
        `${item.name}: ${item.quantity > 0 ? `재고 부족  ${item.quantity} 개 남음` : `품절`}`,
      );
    });
  }, [infoMessage]);

  return (
    <div id="stock-status" className="text-sm text-gray-500 mt-2">
      <span>{infoMessage}</span>
    </div>
  );
};

export default StockStatus;
