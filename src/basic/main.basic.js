import renderHome from './components/renderHome';
import updateSelectOptions from './components/updateSelectOptions';
import calculateCart from './utils/calculateCart';
import { activateLuckySale, activateSuggestSale } from './utils/eventManager';

function main() {
  let root = document.getElementById('app');
  root.appendChild(renderHome());

  // 화면 처음 로드 시 옵션 설정 & 총액 계산
  updateSelectOptions();
  calculateCart();

  // 랜덤 타이머 이벤트 설정
  activateLuckySale();
  activateSuggestSale();
}

main();
