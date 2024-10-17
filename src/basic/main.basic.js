// Observable 클래스 정의
class Observable {
  constructor() {
    this.observers = [];
  }

  // 옵저버 등록
  subscribe(observer) {
    this.observers.push(observer);
  }

  // 모든 옵저버에게 알림
  notify(data) {
    this.observers.forEach((observer) => observer(data));
  }
}

// lastSel을 관리하는 Observable 생성
const lastSelObservable = new Observable();

// 상품 데이터 배열
const prodList = [
  { id: 'p1', name: '상품1', val: 10000, q: 50 },
  { id: 'p2', name: '상품2', val: 20000, q: 30 },
  { id: 'p3', name: '상품3', val: 30000, q: 20 },
  { id: 'p4', name: '상품4', val: 15000, q: 0 },
  { id: 'p5', name: '상품5', val: 25000, q: 10 },
];
// 각 상품의 할인율을 정의한 객체
const descList = {
  p1: 0.1, // 상품1: 10% 할인
  p2: 0.15, // 상품2: 15% 할인
  p3: 0.2, // 상품3: 20% 할인
  p4: 0.05, // 상품4: 5% 할인
  p5: 0.25, // 상품5: 25% 할인
};

// 애플리케이션 초기화
function main() {
  const root = document.getElementById('app');
  const { cont, cartItems, cartTotal, productSel, addBtn, stockStatus } = createUI();

  root.appendChild(cont);
  updateSelOpts(productSel, prodList);
  calcCart(cartItems, cartTotal, stockStatus, prodList);

  initEvents(addBtn, cartItems, productSel, cartTotal, stockStatus);
  initSales(prodList, productSel, cartItems, cartTotal, stockStatus);
}

// UI 생성: 필요한 모든 UI 요소들을 생성하여 반환
const createUI = () => {
  const cont = createElement('div', '', 'bg-gray-100 p-8');
  const wrap = createElement(
    'div',
    '',
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
  );

  const hTxt = createElement('h1', '장바구니', 'text-2xl font-bold mb-4');
  const cartItems = createElement('div', '', '', { id: 'cart-items' });
  const cartTotal = createElement('div', '', 'text-xl font-bold my-4', { id: 'cart-total' });
  const productSel = createElement('select', '', 'border rounded p-2 mr-2', { id: 'product-select' });
  const addBtn = createElement('button', '추가', 'bg-blue-500 text-white px-4 py-2 rounded', { id: 'add-to-cart' });
  const stockStatus = createElement('div', '', 'text-sm text-gray-500 mt-2', { id: 'stock-status' });

  [hTxt, cartItems, cartTotal, productSel, addBtn, stockStatus].forEach((el) => wrap.appendChild(el));
  cont.appendChild(wrap);
  return { cont, cartItems, cartTotal, productSel, addBtn, stockStatus };
};

// 요소 생성 헬퍼 함수
const createElement = (tag, textContent = '', className = '', attributes = {}) => {
  const element = document.createElement(tag);
  element.textContent = textContent;
  element.className = className;
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
};

// 버튼 생성 함수 (createElement 활용)
const createButton = (text, productId, change, className) => {
  const attributes = { 'data-product-id': productId };

  // 수량 변경 버튼일 경우 `data-change` 속성 추가
  if (change) {
    attributes['data-change'] = change;
  }

  // createElement 함수 활용
  return createElement('button', text, className, attributes);
};

// 상품 선택 옵션을 업데이트
const updateSelOpts = (productSel, products) => {
  productSel.innerHTML = '';
  products.forEach(({ id, name, val, q }) => {
    const option = createElement('option', `${name} - ${val}원`, '', { value: id });
    option.disabled = q === 0;
    productSel.appendChild(option);
  });
};

// 현재 아이템의 수량을 가져오는 함수
const getCurrentQuantity = (itemEl) => {
  const qtyText = itemEl.querySelector('span').textContent.split('x ')[1];
  return parseInt(qtyText);
};

// 아이템의 수량을 설정하는 함수
const setItemQuantity = (itemEl, quantity) => {
  const nameAndPrice = itemEl.querySelector('span').textContent.split('x ')[0];
  itemEl.querySelector('span').textContent = `${nameAndPrice}x ${quantity}`;
};

// 기존 아이템의 수량을 업데이트하는 함수
const updateExistingItem = (itemEl, prod) => {
  const currentQty = getCurrentQuantity(itemEl);
  const newQty = currentQty + 1;

  // 재고 수량이 충분한지 확인
  if (newQty > prod.q + currentQty) {
    alert('재고가 부족합니다.');
    return;
  }

  // 아이템 수량 업데이트 및 재고 감소
  setItemQuantity(itemEl, newQty);
  prod.q -= 1;
};

// 새 아이템을 카트에 추가하는 함수
const addNewItemToCart = (cartItems, prod) => {
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

// 이벤트 초기화
const initEvents = (addBtn, cartItems, productSel, cartTotal, stockStatus) => {
  addBtn.addEventListener('click', () => {
    const selItem = productSel.value;
    const prod = prodList.find((p) => p.id === selItem);
    if (!prod) return alert('상품을 찾을 수 없습니다.');

    const itemEl = document.getElementById(prod.id);

    if (itemEl) {
      updateExistingItem(itemEl, prod);
    } else {
      addNewItemToCart(cartItems, prod);
    }

    lastSelObservable.notify(selItem);

    calcCart(cartItems, cartTotal, stockStatus, prodList);
  });

  cartItems.addEventListener('click', (event) => {
    const tgt = event.target;
    if (tgt.classList.contains('quantity-change')) {
      handleQuantityChange(tgt, cartItems, cartTotal, stockStatus);
    } else if (tgt.classList.contains('remove-item')) {
      removeItem(tgt, cartItems, cartTotal, stockStatus);
    }
  });
};

// 수량 변경 처리
const handleQuantityChange = (target, cartItems, cartTotal, stockStatus) => {
  const prodId = target.dataset.productId;
  const qtyChange = parseInt(target.dataset.change);
  const itemEl = document.getElementById(prodId);
  const prod = prodList.find((p) => p.id === prodId);

  const newQty = getCurrentQuantity(itemEl) + qtyChange;
  if (newQty >= 0 && newQty <= prod.q + getCurrentQuantity(itemEl)) {
    setItemQuantity(itemEl, newQty);
    if (newQty === 0) itemEl.remove();

    prod.q -= qtyChange;
  } else {
    alert('재고가 부족합니다.');
  }
  console.table(prodList);

  calcCart(cartItems, cartTotal, stockStatus, prodList);
};

// 카트에서 아이템 제거
const removeItem = (target, cartItems, cartTotal, stockStatus) => {
  const prodId = target.dataset.productId;
  const itemEl = document.getElementById(prodId);
  const prod = prodList.find((p) => p.id === prodId);
  const remQty = getCurrentQuantity(itemEl);

  prod.q += remQty;
  itemEl.remove();

  calcCart(cartItems, cartTotal, stockStatus, prodList);
};

// 카트 계산 및 화면 업데이트
const calcCart = (cartItems, cartTotal, stockStatus, products) => {
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

// 재고 정보 업데이트
const updateStockInfo = (stockStatus, products) => {
  const infoMsg = products
    .filter(({ q }) => q < 5)
    .reduce((msg, { name, q }) => `${msg}${name}: ${q > 0 ? `재고 부족 (${q}개 남음)` : '품절'}\n`, '');
  stockStatus.textContent = infoMsg;
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

// 할인율 정보 렌더링
const renderDiscRate = (cartTotal, discRate) => {
  const disc = createElement('span', `(${(discRate * 100).toFixed(1)}% 할인 적용)`, 'text-green-500 ml-2');
  cartTotal.appendChild(disc);
};

// 포인트 렌더링
const renderLoyaltyPts = (cartTotal, currentPoints, totalAmt) => {
  const points = createLoyaltyPts(cartTotal);
  const bonusPts = +currentPoints + Math.floor(totalAmt / 1000);
  points.textContent = `(포인트: ${bonusPts})`;
};

// 카트 아이템 값 계산
const getCartItemsValue = (cartItems, products) => {
  return [...cartItems].reduce(
    ({ subTot, totalAmt, itemCnt }, cartItem) => {
      const curItem = products.find((p) => p.id === cartItem.id);
      const qty = getCurrentQuantity(cartItem);
      const curItemTotalValue = curItem.val * qty;
      const discPerItem = qty < 10 ? 0 : descList[curItem.id];

      return {
        subTot: subTot + curItemTotalValue,
        totalAmt: totalAmt + curItemTotalValue * (1 - discPerItem),
        itemCnt: itemCnt + qty,
      };
    },
    { subTot: 0, totalAmt: 0, itemCnt: 0 },
  );
};

// 할인율 계산
const getDiscountRate = (subTot, totalAmt, itemCnt) => {
  const bulkDisc = itemCnt >= 30 ? 0.25 : 0;
  const itemDisc = (subTot - totalAmt) / subTot || 0;
  const discRate = Math.max(bulkDisc, itemDisc);
  return new Date().getDay() === 2 ? Math.max(discRate, 0.1) : discRate;
};

// 세일 이벤트 초기화
const initSales = (products, productSel, cartItems, cartTotal, stockStatus) => {
  let lastSel = null;

  lastSelObservable.subscribe((sel) => {
    lastSel = sel;
  });

  initSaleEvent(
    products,
    productSel,
    cartItems,
    cartTotal,
    stockStatus,
    () => Math.random() < 0.3,
    (item) => {
      item.val = Math.round(item.val * 0.8);
      alert(`번개세일! ${item.name}이(가) 20% 할인 중입니다!`);
    },
    30000,
    10000,
  );

  initSaleEvent(
    products,
    productSel,
    cartItems,
    cartTotal,
    stockStatus,
    (suggest) => suggest.id !== lastSel.id && lastSel.q > 0,
    (suggest) => {
      suggest.val = Math.round(suggest.val * 0.95);
      alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
    },
    60000,
    20000,
  );
};

// 할인된 상품의 가격을 카트에 반영하는 함수
const updateCartItemPrices = (discountedProduct) => {
  const itemEl = document.getElementById(discountedProduct.id);
  if (itemEl) {
    const qty = getCurrentQuantity(itemEl);

    // 할인된 가격으로 텍스트 업데이트
    const nameAndPrice = `${discountedProduct.name} - ${discountedProduct.val}원`;
    itemEl.querySelector('span').textContent = `${nameAndPrice} x ${qty}`;
  }
};

// 세일 이벤트 초기화 함수
const initSaleEvent = (
  products,
  productSel,
  cartItems,
  cartTotal,
  stockStatus,
  condition,
  action,
  interval,
  initialDelay,
) => {
  setTimeout(() => {
    setInterval(() => {
      const luckyItem = products[Math.floor(Math.random() * products.length)];
      console.log(condition(luckyItem), luckyItem.q);
      if (condition(luckyItem) && luckyItem.q > 0) {
        action(luckyItem);
        updateSelOpts(productSel, products);

        // 할인된 상품이 카트에 있을 경우 가격 업데이트 및 총액 재계산
        updateCartItemPrices(luckyItem);
        calcCart(cartItems, cartTotal, stockStatus, products);
      }
    }, interval);
  }, Math.random() * initialDelay);
};

// 메인 실행
main();
