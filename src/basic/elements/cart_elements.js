import { createElement, createButton } from '../services';
import { getCartItemsValue, getDiscountRate } from '../services';

// 새 아이템을 카트에 추가하는 함수
export const addNewItemToCart = (cartItems, prod) => {
  // 재고가 있는지 확인
  if (prod.q <= 0) {
    alert('재고가 부족합니다.');
    return;
  }

  // 새 아이템 요소 생성
  const newItem = createElement('div', '', 'flex justify-between items-center mb-2', { id: prod.id });
  newItem.innerHTML = `<span>${prod.name} - ${prod.val}원 x 1</span>`;

  // 수량 변경 및 삭제 버튼 추가
  const buttonContainer = createElement('div');
  buttonContainer.appendChild(
    createButton('-', prod.id, '-1', 'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1'),
  );
  buttonContainer.appendChild(
    createButton('+', prod.id, '1', 'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1'),
  );
  buttonContainer.appendChild(
    createButton('삭제', prod.id, null, 'remove-item bg-red-500 text-white px-2 py-1 rounded'),
  );

  // 새 아이템에 버튼 컨테이너 추가하고 카트에 추가
  newItem.appendChild(buttonContainer);
  cartItems.appendChild(newItem);

  // 재고 감소
  prod.q -= 1;
};

// 재고 정보 업데이트
const updateStockInfo = (stockStatus, products) => {
  const infoMsg = products
    .filter(({ q }) => q < 5)
    .reduce((msg, { name, q }) => `${msg}${name}: ${q > 0 ? `재고 부족 (${q}개 남음)` : '품절'}\n`, '');
  stockStatus.textContent = infoMsg;
};

// 할인율 정보 렌더링
const renderDiscRate = (cartTotal, discRate) => {
  const disc = createElement('span', `(${(discRate * 100).toFixed(1)}% 할인 적용)`, 'text-green-500 ml-2');
  cartTotal.appendChild(disc);
};

// 포인트 생성 또는 가져오기
const createLoyaltyPts = (cartTotal) => {
  let points = document.getElementById('loyalty-points');
  if (!points) {
    points = createElement('span', '', 'text-blue-500 ml-2', { id: 'loyalty-points' });
    cartTotal.appendChild(points);
  }
  return points;
};

// 포인트 렌더링
const renderLoyaltyPts = (cartTotal, currentPoints, totalAmt) => {
  const points = createLoyaltyPts(cartTotal);
  const bonusPts = +currentPoints + Math.floor(totalAmt / 1000);
  points.textContent = `(포인트: ${bonusPts})`;
};

// 카트 계산 및 화면 업데이트
export const calcCart = (cartItems, cartTotal, stockStatus, products) => {
  const cartItemEls = cartItems.children;
  const { subTot, totalAmt, itemCnt } = getCartItemsValue(cartItemEls, products);
  const discRate = getDiscountRate(subTot, totalAmt, itemCnt);

  updateStockInfo(stockStatus, products);
  const points = createLoyaltyPts(cartTotal);
  const currentPoints = points.textContent.match(/\d+/);
  cartTotal.textContent = `총액: ${Math.round(subTot * (1 - discRate))}원`;

  if (discRate > 0) renderDiscRate(cartTotal, discRate);
  renderLoyaltyPts(cartTotal, currentPoints, subTot * (1 - discRate));
};
