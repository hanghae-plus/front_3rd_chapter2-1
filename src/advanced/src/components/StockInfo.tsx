import React from "react";

interface StockInfoProps {
  info: string;
}

const StockInfo: React.FC<StockInfoProps> = ({ info }) => {
  if (!info) return null;

  return (
    <div id="stock-status" className="text-sm text-gray-500 mt-2">
      {info}
    </div>
  );
};

export default StockInfo;
