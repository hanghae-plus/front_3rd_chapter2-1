import { createSpan } from '../createElements';

let accumulatedBonusPoints = 0;
// 포인트 계산을 위한 나눗셈 상수 선언
const POINTS_DIVISOR = 1000;

/**
 * @function calculateBounsPoints
 * @description 총액을 기반으로 보너스 포인트를 계산
 * @param {number} totalPrice - 총 구매 금액
 * @returns {number} 계산된 보너스 포인트
 */
const calculateBonusPoints = (totalPrice) => {
  return Math.floor(totalPrice / POINTS_DIVISOR);
};

/**
 * @function updateLoyaltyPointsDisplay
 * @description 지정된 DOM 요소에 보너스 포인트를 표시
 * @param {HTMLElement} element - 보너스 포인트를 표시할 DOM 요소
 * @param {number} points - 표시할 보너스 포인트 수
 */

const updateLoyaltyPointsDisplay = (element, points) => {
  element.textContent = `(포인트: ${points})`;
};

/**
 * @function getOrCreateLoyaltyPointsElement
 * @description 주어진 부모 요소 내에서 'loyalty-points' ID를 가진 DOM 요소를 찾거나 생성하는 함수
 * @param {HTMLElement} parentElement - 'loyalty-points' 요소를 검색하거나 추가할 부모 DOM 요소
 * @returns {HTMLElement} 기존 또는 새로 생성된 'loyalty-points' DOM 요소
 */

const getOrCreateLoyaltyPointsElement = (parentElement) => {
  let loyaltyPointsElement = document.getElementById('loyalty-points');
  if (!loyaltyPointsElement) {
    loyaltyPointsElement = createSpan({ id: 'loyalty-points', className: 'text-blue-500 ml-2' });
    parentElement.appendChild(loyaltyPointsElement);
  }
  return loyaltyPointsElement;
};

/**
 * @function renderLoyaltyPoints
 * @description 주어진 총액을 기반으로 보너스 포인트를 계산하고 지정 영역에 표시
 * @param {number} totalPrice - 총 구매 금액
 * @param {HTMLElement} displayContainer - 보너스 포인트를 표시할 컨테이너
 */

const renderLoyaltyPoints = (totalPrice, displayContainer) => {
  const newPoints = calculateBonusPoints(totalPrice);
  accumulatedBonusPoints += newPoints;
  
  const loyaltyPointsElement = getOrCreateLoyaltyPointsElement(displayContainer);
  updateLoyaltyPointsDisplay(loyaltyPointsElement, accumulatedBonusPoints);
};

export default renderLoyaltyPoints;
