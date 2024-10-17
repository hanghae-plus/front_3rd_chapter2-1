import React from 'react';

export const StockStatus = ({ productInventory }) => {
  console.log(productInventory);

  return (
    <div id="stock-status" className="mt-2 text-sm text-gray-500">
      {productInventory.map((product) => {
        if (product.quantity === 0) return `${product.name}: 품절`;
        if (product.quantity <= 5) return `${product.name}: 재고 부족 (${product.quantity}개 남음)`;
      })}
    </div>
  );
};
