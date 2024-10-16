import { attatchEventListener } from './event';
import {
  setExtraSaleEvent,
  setLuckySaleEvent,
  updateSelectOptionStatus,
  updateTotalPrice,
} from './service';

function main() {
  // 장바구니 페이지 렌더링
  renderShoppingCartPage();
  updateSelectOptionStatus();
  updateTotalPrice();

  // 이벤트 리스너 추가
  attatchEventListener();

  // 할인 특가 설정
  setLuckySaleEvent();
  setExtraSaleEvent();
}

function renderShoppingCartPage() {
  const $root = document.getElementById('app');
  const $cartWrapper = document.createElement('div');
  const $cartContainer = document.createElement('div');
  const $cartTitle = document.createElement('h1');
  const $cartItemList = document.createElement('div');
  const $cartTotal = document.createElement('div');
  const $productSelectBox = document.createElement('select');
  const $addToCartBtn = document.createElement('button');
  const $stockInfo = document.createElement('div');

  $cartItemList.id = 'cart-items';
  $cartTotal.id = 'cart-total';
  $productSelectBox.id = 'product-select';
  $addToCartBtn.id = 'add-to-cart';
  $stockInfo.id = 'stock-status';

  $cartWrapper.className = 'bg-gray-100 p-8';
  $cartContainer.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  $cartTitle.className = 'text-2xl font-bold mb-4';
  $cartTotal.className = 'text-xl font-bold my-4';
  $productSelectBox.className = 'border rounded p-2 mr-2';
  $addToCartBtn.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  $stockInfo.className = 'text-sm text-gray-500 mt-2';

  $cartTitle.textContent = '장바구니';
  $addToCartBtn.textContent = '추가';

  $cartContainer.appendChild($cartTitle);
  $cartContainer.appendChild($cartItemList);
  $cartContainer.appendChild($cartTotal);
  $cartContainer.appendChild($productSelectBox);
  $cartContainer.appendChild($addToCartBtn);
  $cartContainer.appendChild($stockInfo);
  $cartWrapper.appendChild($cartContainer);
  $root.appendChild($cartWrapper);
}

main();
