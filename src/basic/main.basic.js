import renderHome from './components/renderHome';
import updateSelectOptions from './components/updateSelectOptions';
import calculateCart from './utils/calculateCart';
import { setLuckySale, setSuggestSale } from './utils/eventManager';

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
