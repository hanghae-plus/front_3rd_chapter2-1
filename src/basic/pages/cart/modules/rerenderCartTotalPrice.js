import { cartTotalPriceStore } from '../store.js';

export function rerenderCartTotalPrice() {
  const { totalPrice, discountRate } = cartTotalPriceStore.getState();
  const $totalPriceElement = document.getElementById('cart-total');
  // const $rewardPointElement = document.getElementById('loyalty-points');

  console.log(totalPrice, discountRate, 'totalPrice, rewardPoints');
  $totalPriceElement.textContent = `총액: ${totalPrice}원`;

  if (discountRate > 0) {
    const span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
    $totalPriceElement.appendChild(span);
  }
}
