export const products = [
  { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
  { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
  { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
  { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
  { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
];

const LACK_OF_STOCK = 5;
const formatLowStocksInfo = (lowStockProducts) => {
  return lowStockProducts
    .map((product) =>
      product.quantity > 0 ? `${product.name}: 재고 부족 (${product.quantity}개 남음)` : `${product.name}: 품절`,
    )
    .join('\n');
};
export const renderProductsStockInfo = () => {
  const $stockInfo = document.getElementById('stock-status');
  const lowStockProducts = products.filter((product) => product.quantity < LACK_OF_STOCK);

  $stockInfo.textContent = formatLowStocksInfo(lowStockProducts);
};

export const renderProductOptions = () => {
  const $productSelectDropdown = document.getElementById('product-select');
  $productSelectDropdown.innerHTML = '';

  products.forEach((item) => {
    const $option = document.createElement('option');
    $option.value = item.id;

    $option.textContent = item.name + ' - ' + item.price + '원';
    if (item.quantity === 0) $option.disabled = true;
    $productSelectDropdown.appendChild($option);
  });
};
