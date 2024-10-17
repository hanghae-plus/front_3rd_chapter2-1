import { calculateCart } from "./controller/calculateCart";
import renderApp from './renderApp';
import { prodList } from "./constants/prodList";
import { initiateLuckySale, initiateSuggestSale } from "./controller/salesPromotions";
import updateSelectOptions from "./views/updateSelectOptions";
import { addItemToCart, handleCartEvent } from './cartHandlers';

let sel, addBtn, cartsDiv, sumDiv, stockInfoDiv;
let lastSel = { current: null };

function main() {
  let root = document.getElementById('app');
  root.appendChild(renderApp());

  sel = document.getElementById('product-select');
  addBtn = document.getElementById('add-to-cart');
  cartsDiv = document.getElementById('cart-items');
  sumDiv = document.getElementById('cart-total');
  stockInfoDiv = document.getElementById('stock-status');

  updateSelectOptions(sel, prodList);

  calculateCart({ prodList, sumDiv, cartsDiv, stockInfoDiv });

  initiateLuckySale(sel);
  initiateSuggestSale(sel, lastSel);
}

main();

// 장바구니 추가 버튼 클릭 이벤트
addBtn.addEventListener('click', function () {
  const selectedProductId = sel.value;
  addItemToCart(selectedProductId, prodList, cartsDiv, sumDiv, stockInfoDiv, lastSel);
});

// 장바구니에서 수량 변경 및 아이템 삭제 이벤트
cartsDiv.addEventListener('click', function (event) {
  handleCartEvent(event, prodList, cartsDiv, sumDiv, stockInfoDiv);
});