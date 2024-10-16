import { createSpan } from './createElements';

let bonusPoints = 0;

const renderBonusPoints = (totalPrice, $sum) => {
  bonusPoints += Math.floor(totalPrice / 1000);

  let $point = document.getElementById('loyalty-points');
  if (!$point) {
    $point = createSpan({ id: 'loyalty-points', className: 'text-blue-500 ml-2' });
    $sum.appendChild($point);
  }

  $point.textContent = `(포인트: ${bonusPoints})`;
};

export default renderBonusPoints;
