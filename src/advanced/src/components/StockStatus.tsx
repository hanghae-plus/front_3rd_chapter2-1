import { Product } from "../types";

interface StockStatusProps {
  productList: Product[];
}

const StockStatus = ({ productList }: StockStatusProps) => {
  const infoMessage = productList
    .filter((item) => item.quantity < 5)
    .map(
      (item) =>
        `${item.name}: ${item.quantity > 0 ? `재고 부족 (${item.quantity}개 남음)` : "품절"} `,
    );

  return (
    <div id="stock-status" className="text-sm text-gray-500 mt-2">
      {infoMessage}
    </div>
  );
};

export default StockStatus;
