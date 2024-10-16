import {
  initCart,
  handleClickAddToCart,
  calculatorCart,
  handleClickItem,
  scheduleDiscount,
  updateSelectOptions,
} from './utils';
import { initCartInfo } from './state';

const main = () => {
  // cartInfo 초기화
  initCartInfo();
  // 레이아웃 초기화
  initCart();
  // 장바구니 계산
  calculatorCart();
  // 할인 이벤트 스케줄링
  scheduleDiscount();
  // 이벤트 리스너 등록
  setEventListeners();
};

// 이벤트 리스너 등록
const setEventListeners = () => {
  document.querySelector('#add-to-cart').addEventListener('click', handleClickAddToCart);
  document.querySelector('#cart-items').addEventListener('click', handleClickItem);
};

main();
