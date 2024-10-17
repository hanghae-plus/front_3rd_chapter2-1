import { prodList } from '../constant';
import { lastSelObservable } from '../observable';
import { updateSelOpts, calcCart } from '../elements';
import { updateCartItemPrices } from '../services';

// 세일 이벤트 초기화
export const initSales = (productSel, cartItems, cartTotal, stockStatus) => {
  let lastSel = null;

  lastSelObservable.subscribe((sel) => {
    lastSel = sel;
  });

  initSaleEvent(
    productSel,
    cartItems,
    cartTotal,
    stockStatus,
    () => Math.random() < 0.3,
    (item) => {
      item.val = Math.round(item.val * 0.8);
      alert(`번개세일! ${item.name}이(가) 20% 할인 중입니다!`);
    },
    30000,
    10000,
  );

  initSaleEvent(
    productSel,
    cartItems,
    cartTotal,
    stockStatus,
    (suggest) => suggest.id !== lastSel.id && lastSel.q > 0,
    (suggest) => {
      suggest.val = Math.round(suggest.val * 0.95);
      alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
    },
    60000,
    20000,
  );
};

// 세일 이벤트 초기화 함수
const initSaleEvent = (productSel, cartItems, cartTotal, stockStatus, condition, action, interval, initialDelay) => {
  setTimeout(() => {
    setInterval(() => {
      const luckyItem = prodList[Math.floor(Math.random() * prodList.length)];
      console.log(condition(luckyItem), luckyItem.q);
      if (condition(luckyItem) && luckyItem.q > 0) {
        action(luckyItem);
        updateSelOpts(productSel, prodList);

        // 할인된 상품이 카트에 있을 경우 가격 업데이트 및 총액 재계산
        updateCartItemPrices(luckyItem);
        calcCart(cartItems, cartTotal, stockStatus, prodList);
      }
    }, interval);
  }, Math.random() * initialDelay);
};
