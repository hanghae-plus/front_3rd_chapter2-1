export function StockInfo({ wrap }) {
  const stockInfo = document.createElement('div');
  stockInfo.id = 'stock-status';
  stockInfo.className = 'text-sm text-gray-500 mt-2';
  wrap.appendChild(stockInfo);

  this.$element = stockInfo;
}
