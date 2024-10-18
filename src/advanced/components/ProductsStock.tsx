import React from 'react';
import { useProductsStore } from '../stores';

// 상품 재고 상태 표시 컴포넌트
const StockStatus: React.FC<{ name: string; stock: number }> = ({ name, stock }) => {
  return (
    <article>
      {name}: {stock > 0 ? `재고 부족 (${stock}개 남음)` : '품절'}
    </article>
  );
};

export const ProductsStock: React.FC = () => {
  const { products } = useProductsStore();

  return (
    <section className="text-sm text-gray-500 mt-2" id="stock-status">
      {products
        .filter((product) => product.qty < 5)
        .map((product) => (
          <StockStatus key={product.id} name={product.name} stock={product.qty} />
        ))}
    </section>
  );
};
