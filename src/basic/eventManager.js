import updateSelectOptions from './updateSelectOptions';

export function setLuckySale(productList, $select) {
  setTimeout(function () {
    setInterval(function () {
      let luckyItem = productList[Math.floor(Math.random() * productList.length)];
      if (Math.random() < 0.3 && luckyItem.q > 0) {
        luckyItem.val = Math.round(luckyItem.val * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateSelectOptions($select, productList);
      }
    }, 30000);
  }, Math.random() * 10000);
}

export function setSuggestSale(productList, $select, lastSelectedId) {
  setTimeout(function () {
    setInterval(function () {
      if (lastSelectedId) {
        let suggest = productList.find(function (item) {
          return item.id !== lastSelectedId && item.q > 0;
        });
        if (suggest) {
          alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.val = Math.round(suggest.val * 0.95);
          updateSelectOptions($select, productList);
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}
