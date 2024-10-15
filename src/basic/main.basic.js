import { initCart, handleClickAddToCart, calculatorCart } from "./utils"
import { initCartInfo } from "./state"

const main = () => {
  // cartInfo 초기화
  initCartInfo()
  // 레이아웃 초기화
  initCart()
  // 장바구니 계산
  calculatorCart()
  // 이벤트 리스너 등록
  setEventListeners()

  //TODO : 랜덤 할인 이벤트 추가
  //TODO : 품절 업데이트 추가  || as-is : updateStockInfo
  //TODO : 할인 상수 추가
}

// 이벤트 리스너 등록
const setEventListeners = () => {
  document.querySelector("#add-to-cart").addEventListener("click", handleClickAddToCart)
  //TODO : 카트 아이템 클릭시 이벤트 추가
}

main()
