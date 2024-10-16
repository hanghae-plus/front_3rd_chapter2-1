import { LACK_OF_STOCK } from '../constants';
import { useProductStore } from '../stores/productStore';

const StockStatus = () => {
  const storeProducts = useProductStore((state) => state.products);

  const formatLowStocksInfo = storeProducts
    .map((product) => {
      if (product.quantity >= LACK_OF_STOCK) return;
      if (product.quantity === 0) return `${product.name}: 품절`;
      return `${product.name}: 재고 부족 (${product.quantity}개 남음)`;
    })
    .join('\n');

  return (
    <p id="stock-status" className="text-sm text-gray-500 mt-2">
      {formatLowStocksInfo}
    </p>
  );
};

export default StockStatus;
