import { Product } from '../types';

export default function StockInfo({ productList }: { productList: Product[] }) {
  const lowQuantityProducts = productList.filter(
    (product) => product.quantity < 5
  );

  // TODO: 순서가 바뀌지 않도록 수정
  return (
    <div id="stock-status" className="text-sm text-gray-500 mt-2">
      {lowQuantityProducts
        .map((product) => {
          if (product.quantity === 0) return `${product.name}: 품절`;
          return `${product.name}: 재고 부족 (${product.quantity}개 남음)`;
        })
        .join('\n')}
    </div>
  );
}
