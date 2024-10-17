import React, { useEffect, useState } from 'react';
import { filter } from 'lodash-es';

const StockLabel: React.FC<{ productList: ItemType[] }> = ({ productList }) => {
  const [status, setStatus] = useState('');

  useEffect(() => {
    let statusText = '';

    // 5개 미만 품목만 가져오기
    const stockList = filter(productList, (item) => item.quantity < 5);

    // 5개 미만 품목 텍스트 업데이트
    stockList.forEach(({ name, quantity }) => {
      statusText += `${name}: ${quantity > 0 ? `(${quantity}개 남음)` : '품절'} `;
    });

    setStatus(statusText);
  }, [productList]);

  return (
    <div className="mt-2">
      <span
        id="stock-status"
        data-testid="stock-status"
        className="text-sm text-gray-500"
      >
        {status}
      </span>
    </div>
  );
};

export default StockLabel;
