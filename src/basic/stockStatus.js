export function updateStockStatus(productList, stockStatus) {
    let infoMsg = '';
    productList.forEach(item => {
      if (item.stock < 5) {
        infoMsg += `${item.name}: ${item.stock > 0 ? `재고 부족 (${item.stock}개 남음)` : '품절'}\n`;
      }
    });
    stockStatus.textContent = infoMsg;
  }