export const updateTotalInfo = (discountedTotalPrice, discountRate) => {
  const cartTotalInfo = document.getElementById('cart-total');

  cartTotalInfo.textContent = '총액: ' + Math.round(discountedTotalPrice) + '원';
  if (discountRate > 0) {
    const span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
    cartTotalInfo.appendChild(span);
  }
};

const createBonusPointsTag = () => {
  const pointTagElement = document.createElement('span');
  pointTagElement.id = 'loyalty-points';
  pointTagElement.className = 'text-blue-500 ml-2';

  document.getElementById('cart-total').appendChild(pointTagElement);
  return pointTagElement;
};
export const updateBonusPoints = (bonusPoints, totalPrice) => {
  const updatedBonusPoints = bonusPoints + Math.floor(totalPrice / 1000);

  const pointTagElement = document.getElementById('loyalty-points') || createBonusPointsTag();
  pointTagElement.textContent = `(포인트: ${updatedBonusPoints})`;

  return updatedBonusPoints;
};
