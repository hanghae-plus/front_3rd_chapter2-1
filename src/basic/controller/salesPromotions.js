import { prodList } from "../constants/prodList";
import updateSelectOptions from "../views/updateSelectOptions";

/**
 * @function initiateLuckySale
 * @description 지정된 시간 간격으로 "번개세일" 이벤트를 초기화
 * prodList에서 무작위로 선택된 상품에 대해 할인을 적용하고 사용자에게 알림 전송
 * @param {HTMLElement} sel - 업데이트할 select HTML 요소
 */

export function initiateLuckySale(sel) {
  setTimeout(() => {
    setInterval(() => {
      const luckyItem = prodList[Math.floor(Math.random() * prodList.length)];
      if (Math.random() < 0.3 && luckyItem.q > 0) {
        luckyItem.val = Math.round(luckyItem.val * 0.8);
        alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        updateSelectOptions(sel, prodList);
      }
    }, 30000);
  }, Math.random() * 10000);
}

/**
 * @function initiateSuggestSale
 * @description 지정된 시간 간격으로 "제안 판매" 이벤트를 초기화
 * 사용자가 마지막으로 선택한 상품이 아닌 다른 상품 중에서 재고가 있는 상품에 대해 할인을 적용하고,
 * 사용자에게 구매를 제안하는 알림 전송
 * @param {HTMLElement} sel - 업데이트할 select HTML 요소
 * @param {string} lastSel - 마지막으로 선택된 상품의 ID
 */

export function initiateSuggestSale(sel, lastSel) {
  setTimeout(() => {
    setInterval(() => {
      if (lastSel) {
        const suggest = prodList.find(item => item.id !== lastSel && item.q > 0);
        if (suggest) {
          alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          suggest.val = Math.round(suggest.val * 0.95);
          updateSelectOptions(sel, prodList);
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}