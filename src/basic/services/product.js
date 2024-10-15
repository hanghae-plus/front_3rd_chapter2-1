const formatLowStocksInfo = (lowStockProducts) => {
  return lowStockProducts
    .map((product) =>
      product.quantity > 0 ? `${product.name}: 재고 부족 (${product.quantity}개 남음)` : `${product.name}: 품절`,
    )
    .join('\n');
};

export { formatLowStocksInfo };
