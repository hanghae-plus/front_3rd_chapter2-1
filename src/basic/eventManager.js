import updateSelOpts from './updateSelOpts';

export function setLuckySale(prodList, sel) {
  setTimeout(function () {
    setInterval(function () {
      let luckyItem = prodList[Math.floor(Math.random() * prodList.length)];
      if (Math.random() < 0.3 && luckyItem.q > 0) {
        luckyItem.val = Math.round(luckyItem.val * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateSelOpts(sel, prodList);
      }
    }, 30000);
  }, Math.random() * 10000);
}

export function setSuggestSale(prodList, sel, lastSel) {
  setTimeout(function () {
    setInterval(function () {
      if (lastSel) {
        let suggest = prodList.find(function (item) {
          return item.id !== lastSel && item.q > 0;
        });
        if (suggest) {
          alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.val = Math.round(suggest.val * 0.95);
          updateSelOpts(sel, prodList);
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}
