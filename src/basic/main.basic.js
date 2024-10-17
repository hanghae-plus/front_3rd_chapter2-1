import {
  renderShoppingCartPage,
  updateSelectOptionStatus,
  updateTotalPrice,
} from './services/render.service';
import { attatchEventListener } from './services/event.service';
import { applyExtraSale, applyLuckySale } from './services/sale.service';

function main() {
  // 장바구니 페이지 렌더링
  renderShoppingCartPage();
  updateSelectOptionStatus();
  updateTotalPrice();

  // 이벤트 리스너 추가
  attatchEventListener();

  // 할인 특가 설정
  applyLuckySale();
  applyExtraSale();
}

main();
