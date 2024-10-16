import calculateCart from './calculateCart';
import { setLuckySale, setSuggestSale } from './eventManager';
import renderHome from './renderHome';
import updateSelectOptions from './updateSelectOptions';

function main() {
  let root = document.getElementById('app');
  root.appendChild(renderHome());

  updateSelectOptions();
  calculateCart();

  // 랜덤 타이머 이벤트 설정
  setLuckySale();
  setSuggestSale();
}

main();
