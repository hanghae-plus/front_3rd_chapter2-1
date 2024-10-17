import renderHome from './components/renderHome';
import updateSelectOptions from './components/updateSelectOptions';
import { activateLuckySale, activateSuggestSale } from './utils/eventManager';

function main() {
  let root = document.getElementById('app');
  root.appendChild(renderHome());

  // 첫 로드 시 select option 업데이트
  updateSelectOptions();

  // 랜덤 타이머 이벤트 설정
  activateLuckySale();
  activateSuggestSale();
}

main();
