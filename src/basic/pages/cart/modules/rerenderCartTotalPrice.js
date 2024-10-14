import { cartTotalPriceStore } from '../store.js';

export function rerenderCartTotalPrice() {
  const { totalPrice, discountRate, rewardPoints } = cartTotalPriceStore.getState();
  const $totalPriceElement = document.getElementById('cart-total');
  let $rewardPointElement = document.getElementById('loyalty-points');

  $totalPriceElement.textContent = `총액: ${totalPrice}원`;

  if (discountRate > 0) {
    const span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
    $totalPriceElement.appendChild(span);
  }

  if (!$rewardPointElement) {
    $rewardPointElement = document.createElement('span');
    $rewardPointElement.id = 'loyalty-points';
    $rewardPointElement.className = 'text-blue-500 ml-2';
  }

  $totalPriceElement.appendChild($rewardPointElement);
  $rewardPointElement.textContent = `(포인트: ${rewardPoints})`;
}
