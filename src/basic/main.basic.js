import { calculateCart, updateSelectOptions } from "./features/Cart/index.js";
import { setup } from "./setup.js";
import { schedulers } from "./features/Schedulers/index.js";

function main() {
  // 초기화
  setup();

  // 상품 목록 업데이트
  updateSelectOptions();

  // 스케줄러 실행
  schedulers();

  // 장바구니 계산
  calculateCart();
}

main();
