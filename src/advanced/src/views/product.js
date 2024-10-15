import { LACK_OF_STOCK } from '../const/product';
import { formatLowStocksInfo, products } from '../services/product';

import { renderTextContent } from './shared';

export const renderProductOptions = () => {
  const $productSelectDropdown = document.getElementById('product-select');
  $productSelectDropdown.innerHTML = '';

  products.forEach((item) => {
    const $option = document.createElement('option');
    $option.value = item.id;

    renderTextContent($option, `${item.name} - ${item.price}원`);
    if (item.quantity === 0) $option.disabled = true;
    $productSelectDropdown.appendChild($option);
  });
};
export const renderProductsStockInfo = () => {
  const lowStockProducts = products.filter((product) => product.quantity < LACK_OF_STOCK);

  const $stockInfo = document.getElementById('stock-status');
  renderTextContent($stockInfo, formatLowStocksInfo(lowStockProducts));
};
