export function rerenderStockStatus(productList) {
  const $stockInfoContainer = document.getElementById('stock-status');

  // 기존 내용을 가져와서 유지
  let existingContent = $stockInfoContainer.textContent;

  // 업데이트 및 추가할 항목들을 모아놓을 변수
  let updatedContent = '';

  productList.forEach((item) => {
    // 각 상품에 대해 기존에 같은 정보가 있는지 확인
    let itemTextRegex = new RegExp(`${item.name}: .*`, 'g'); // item.name에 대한 텍스트를 찾는 정규식

    // 새로 추가할 텍스트 구성
    let newText = `${item.name}: ${
      item.quantity > 0 ? '재고 부족' + ` (${item.quantity}개 남음)` : '품절'
    }\n`;

    if (item.quantity <= 5) {
      // quantity가 5 이하인 경우, 업데이트 또는 새로 추가
      if (existingContent.match(itemTextRegex)) {
        // 이미 존재하면 해당 부분을 새 텍스트로 교체
        existingContent = existingContent.replace(itemTextRegex, newText);
      } else {
        // 존재하지 않으면 새로 추가
        updatedContent += newText;
      }
    } else {
      // quantity가 5 이상인 항목은 기존 텍스트에서 제거
      existingContent = existingContent.replace(itemTextRegex, '');
    }
  });

  // 기존 내용을 유지하면서 업데이트된 내용 추가
  $stockInfoContainer.textContent = existingContent + updatedContent;
}
