import { calculateCart } from './controller/calculateCart';
import renderApp from './renderApp';
import { prodList } from './constants/prodList';
import { initiateLuckySale, initiateSuggestSale } from './controller/salesPromotions';
import updateSelectOptions from './views/updateSelectOptions';
import { addItemToCart, handleCartEvent } from './controller/handleCart';

let select, addButton, cartsDiv, sumDiv, stockInfoDiv;
const lastSelect = { current: null };

function main() {
  const root = document.getElementById('app');
  root.appendChild(renderApp());

  select = document.getElementById('product-select');
  addButton = document.getElementById('add-to-cart');
  cartsDiv = document.getElementById('cart-items');
  sumDiv = document.getElementById('cart-total');
  stockInfoDiv = document.getElementById('stock-status');

  updateSelectOptions(select, prodList);

  calculateCart({ prodList, sumDiv, cartsDiv, stockInfoDiv });

  initiateLuckySale(select);
  initiateSuggestSale(select, lastSelect);
}

main();

// 장바구니 추가 버튼 클릭 이벤트
addButton.addEventListener('click', function () {
  const selectedProductId = select.value;
  addItemToCart(selectedProductId, prodList, cartsDiv, sumDiv, stockInfoDiv, lastSelect);
});

// 장바구니에서 수량 변경 및 아이템 삭제 이벤트
cartsDiv.addEventListener('click', function (event) {
  handleCartEvent(event, prodList, cartsDiv, sumDiv, stockInfoDiv);
});
