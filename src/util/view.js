import { appendChildren, createElement, getElementById, setClassName, setId, setTextContent } from './element.js';
import { PROD_LIST } from '../const/PROD_LIST.js';
import { ADD_BTN_VIEW_ID, CART_VIEW_ID, SELECT_VIEW_ID, STOCK_VIEW_ID, SUM_VIEW_ID } from '../const/VIEW_ID.js';

// TODO: 기능별로 나누는 것이 좋을까? 아니면 노드별로 나누는 것이 좋을까?
export default function initView() {
  // 기본 뷰 생성
  const root = getElementById('app');
  const contents = createElement('div');
  const wrap = createElement('div');
  const headingTitle = createElement('h1');
  const cartView = createElement('div');
  const sumView = createElement('div');
  const selectView = createElement('select');
  const addBtnView = createElement('button');
  const stockView = createElement('div');

  setId(cartView, CART_VIEW_ID);
  setId(sumView, SUM_VIEW_ID);
  setId(selectView, SELECT_VIEW_ID);
  setId(addBtnView, ADD_BTN_VIEW_ID);
  setId(stockView, STOCK_VIEW_ID);

  setClassName(contents, 'bg-gray-100 p-8');
  setClassName(wrap, 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8');
  setClassName(headingTitle, 'text-2xl font-bold mb-4');
  setClassName(sumView, 'text-xl font-bold my-4');
  setClassName(selectView, 'border rounded p-2 mr-2');
  setClassName(addBtnView, 'bg-blue-500 text-white px-4 py-2 rounded');
  setClassName(stockView, 'text-sm text-gray-500 mt-2');

  setTextContent(headingTitle, '장바구니');
  setTextContent(addBtnView, '추가');

  // selectView 옵션 추가
  updateSelectViewOptions(selectView);

  appendChildren(wrap, headingTitle, cartView, sumView, selectView, addBtnView, stockView);
  appendChildren(contents, wrap);
  appendChildren(root, contents);
}

function updateSelectViewOptions(selectView) {
  selectView.innerHTML = '';

  PROD_LIST.forEach((product) => {
    const option = createElement('option');

    option.value = product.id;
    option.textContent = formatProductInfo(product);

    if (product.quantity === 0) option.disabled = true;

    appendChildren(selectView, option);
  });
}

function formatProductInfo(product) {
  return product.name + ' - ' + product.price + '원';
}