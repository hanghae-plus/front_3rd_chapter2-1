import { QUANTITY } from '../constants';
import { Product } from '../types';

const StockStatus = ({ productList }) => {
  return (
    <div id="stock-status" className="text-sm text-gray-500 mt-2">
      {productList
        .filter((product: Product) => product.quantity < QUANTITY['5'])
        .map((product: Product) => (
          <div key={product.id}>
            {product.name}: {product.quantity > 0 ? `재고 부족 (${product.quantity}개 남음)` : '품절'}
          </div>
        ))}
    </div>
  );
};

export default StockStatus;
