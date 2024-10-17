import React from 'react';
import { useShoppingCart } from '../context/ShoppingCartContext';

export const StockInfo: React.FC = () => {
  const { state } = useShoppingCart();
  const lowStockProducts = state.products.filter((product) => product.quantity < 5);

  return (
    <div data-testid="stock-status" className="text-sm text-gray-500 mt-2 flex gap-2">
      {lowStockProducts.map((product) => (
        <div key={product.id}>
          {product.name}: {product.quantity > 0 ? `재고 부족 (${product.quantity}개 남음)` : '품절'}
        </div>
      ))}
    </div>
  );
};
