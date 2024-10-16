import { main } from './mmain.js';
import { createElementWithProps } from './createElement.js';


// 1.변수 표기 통일 let | 변수명 camelCase 사용
/* 일단 역할 정의
prodList, : 상품목록 -> productList
sel, : 상품선택 드롭다운 -> productSelect
addBtn, : 상품 추가 -> addCartBtn //
cartDisp, : 장바구니 -> cartList
sum, : 총 금액을 표시할 영역 -> cartTotal
stockInfo; : 재고상태 -> stockStatus
lastSel, : 마지막으로 선택한 상품 ID 저장 -> lastProduct
bonusPts = 0, : 포인트 시스템을 위한 변수 -> pointSystem
totalAmt = 0, : 총 금액을 저장 -> totalPrice
itemCnt = 0; : 총 구매한 상품의 개수 -> totalItem
*/
// 동일한 변수 생략 cont -> containerDiv / wrap -> containerWrap / hTxt -> containerTitle
// 함수로 묶어주기..!!



const root = document.getElementById('app');
const containerDiv = createElementWithProps('div', {
  className: 'bg-gray-100 p-8'
});
const containerWrap = createElementWithProps('div', {
  className: 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
});
const containerTitle = createElementWithProps('h1', {
  className: 'text-2xl font-bold mb-4',
  textContent: '장바구니'
});

const cartList = createElementWithProps('div', {
  id: 'cart-items',
});

const cartTotal = createElementWithProps('div', {
  id: 'cart-total',
  className: 'text-xl font-bold my-4'
});

const productSelect = createElementWithProps('select', {
  id: 'product-select',
  className: 'border rounded p-2 mr-2'
});

const addCartBtn = createElementWithProps('button', {
  id: 'add-to-cart',
  className: 'bg-blue-500 text-white px-4 py-2 rounded',
  textContent: '추가'
});

const stockStatus = createElementWithProps('div', {
  id: 'stock-status',
  className: 'text-sm text-gray-500 mt-2',
});


root.appendChild(containerDiv);
containerDiv.appendChild(containerWrap);
containerWrap.appendChild(containerTitle);
containerWrap.appendChild(cartList);
containerWrap.appendChild(cartTotal);
containerWrap.appendChild(productSelect);
containerWrap.appendChild(addCartBtn);
containerWrap.appendChild(stockStatus);

const productList = [
  {id: 'p1', name: '상품1', price: 10000, stock: 50},
  {id: 'p2', name: '상품2', price: 20000, stock: 30},
  {id: 'p3', name: '상품3', price: 30000, stock: 20},
  {id: 'p4', name: '상품4', price: 15000, stock: 0},
  {id: 'p5', name: '상품5', price: 25000, stock: 10}
];

main(productList, cartList, productSelect, cartTotal, stockStatus);

