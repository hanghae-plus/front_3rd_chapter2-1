export function startLightningSale(productList, updateProductSelect) {
  setTimeout(function () {
    setInterval(function () {
      const luckyItem =
        productList[Math.floor(Math.random() * productList.length)];
      if (Math.random() < 0.3 && luckyItem.stock > 0) {
        luckyItem.price = Math.round(luckyItem.price * 0.8);
        alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        updateProductSelect(productList); // 상품 선택 업데이트
      }
    }, 30000); // 30초마다 실행
  }, Math.random() * 10000); // 랜덤한 지연
}

export function startSuggestionSale(
  productList,
  lastProduct,
  updateProductSelect
) {
  setTimeout(function () {
    setInterval(function () {
      if (!lastProduct) return;
      const suggest = productList.find((item) => {
        item.id !== lastProduct.id && item.stock > 0;
      });
      if (suggest) {
        alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
        suggest.price = Math.round(suggest.price * 0.95);
        updateProductSelect(productList); // 상품 목록 업데이트
      }
    }, 60000); // 60초마다 실행
  }, Math.random() * 20000); // 랜덤한 지연
}
