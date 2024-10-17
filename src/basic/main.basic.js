import { prodList } from './constant';
import { createUI, updateSelOpts, calcCart } from './elements';
import { initEvents, initSales } from './event_handlers';

// 애플리케이션 초기화
function main() {
  const root = document.getElementById('app');
  const { cont, cartItems, cartTotal, productSel, addBtn, stockStatus } = createUI();

  root.appendChild(cont);
  updateSelOpts(productSel, prodList);
  calcCart(cartItems, cartTotal, stockStatus, prodList);

  initEvents(addBtn, cartItems, productSel, cartTotal, stockStatus);
  initSales(productSel, cartItems, cartTotal, stockStatus);
}

// 메인 실행
main();
