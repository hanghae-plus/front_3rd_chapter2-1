import { createSpan } from '../utils/createElements';

function renderCartTotal(totalPrice, discountRate) {
  const $cartTotal = document.getElementById('cart-total');

  $cartTotal.textContent = `총액: ${Math.round(totalPrice)}원`;

  if (discountRate > 0) {
    let span = createSpan({
      text: `(${(discountRate * 100).toFixed(1)}% 할인 적용)`,
      className: 'text-green-500 ml-2',
    });
    $cartTotal.appendChild(span);
  }
}

export default renderCartTotal;
