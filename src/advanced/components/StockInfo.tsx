import React from 'react';
import { useAppContext } from '../context/appContext';

const StockInfo = () => {
  const { stockInfo } = useAppContext();
  return (
    <div>
      <div id="stock-status" className="text-sm text-gray-500 mt-2">
        {stockInfo}
      </div>
    </div>
  );
};

export default StockInfo;
