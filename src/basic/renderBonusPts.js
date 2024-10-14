import { createSpan } from './createElements';

let bonusPts = 0;

const renderBonusPts = (totalPrice, sum) => {
  bonusPts += Math.floor(totalPrice / 1000);

  let ptsTag = document.getElementById('loyalty-points');
  if (!ptsTag) {
    ptsTag = createSpan({ id: 'loyalty-points', className: 'text-blue-500 ml-2' });
    sum.appendChild(ptsTag);
  }

  ptsTag.textContent = '(포인트: ' + bonusPts + ')';
};

export default renderBonusPts;
