import { productList } from '../data/product';

function updateStock() {
  const $stock = document.getElementById('stock-status');
  let infoMsg = '';

  productList.toObject().forEach(function (item) {
    const quantity = item.quantity;
    const name = item.name;

    if (quantity < 5)
      infoMsg += `${name}: ${quantity > 0 ? `재고 부족 (${quantity}개 남음)` : '품절'}\n\n`;
  });

  $stock.textContent = infoMsg;
}

export default updateStock;
