import { getBonusPoints } from '../data/point';
import { createSpan } from '../utils/createElements';

const renderBonusPoints = () => {
  const $sum = document.getElementById('cart-total');
  let $point = document.getElementById('loyalty-points');
  const bonusPoints = getBonusPoints();

  if (!$point) {
    $point = createSpan({
      id: 'loyalty-points',
      className: 'text-blue-500 ml-2',
    });
    $sum.appendChild($point);
  }

  $point.textContent = `(포인트: ${bonusPoints})`;
};

export default renderBonusPoints;
