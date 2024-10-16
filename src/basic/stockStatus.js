export function updateStockStatus(productList, stockStatus) {
    let infoMsg = '';
    productList.forEach(product => {
      if (product.stock < 5) {
        infoMsg += `${product.name}: ${product.stock > 0 ? `재고 부족 (${product.stock}개 남음)` : '품절'}\n`;
      }
    });
    stockStatus.textContent = infoMsg;
  }