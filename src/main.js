var itemList, sel, addBtn, cartDisp, sum, stockInfo;
var g_LastSel, g_bonusPts=0; //전역변수명은 어떻게?
let g_TotalAmt=0;
let itemCnt=0;

function main() {
   itemList = [
        { id: 'p1', name: '상품1', price: 10000, stock: 50 },
        { id: 'p2', name: '상품2', price: 20000, stock: 30 },
        { id: 'p3', name: '상품3', price: 30000, stock: 20 },
        { id: 'p4', name: '상품4', price: 15000, stock: 0 },
        { id: 'p5', name: '상품5', price: 25000, stock: 10 }
    ];

    let root = document.getElementById('app');
    let htmlContent = `
        <div class="bg-gray-100 p-8">
            <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
                <h1 class="text-2xl font-bold mb-4">장바구니</h1>
                <div id="cart-items"></div>
                <div id="cart-total" class="text-xl font-bold my-4"></div>
                <select id="product-select" class="border rounded p-2 mr-2"></select>
                <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
                <div id="stock-status" class="text-sm text-gray-500 mt-2"></div>
            </div>
        </div>
    `;
    // HTML을 DOM에 추가
    root.innerHTML = htmlContent;
    
  updateSelOpts(); //상품 업데이트
  calcCart(); //장바구니 상품 가격 계산

  showSaleAlert(); //할인 알림
  showSuggestAlert(); //제안 알림
};

/**
 * 상품 할인 알림
 */
function showSaleAlert(){
  setTimeout(function () {
    setInterval(function () {
      let luckyItem=itemList[Math.floor(Math.random() * itemList.length)];
      if(Math.random() < 0.3 && luckyItem.stock > 0) {
        luckyItem.price=Math.round(luckyItem.price * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateSelOpts();
      }
    }, 30000);
  }, Math.random() * 10000);
}

/**
 * 상품 제안 알림
 */
function showSuggestAlert(){
  setTimeout(function () {
    setInterval(function () {
      if(g_LastSel) {
        var suggest=itemList.find(function (item) { return item.id !== g_LastSel && item.stock > 0; });
        if(suggest) {
          alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.price=Math.round(suggest.price * 0.95);
          updateSelOpts();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

/**
 * select 옵션 상품들을 업데이트 
 */
function updateSelOpts() {
  let $itemSel = document.getElementById('product-select');
  $itemSel.innerHTML=''; //select 옵션 초기화

  let $itemOpts = itemList.map(function (item) {
    return `<option value="${item.id}"${item.stock === 0 ? ' disabled' : ''}>${item.name} - ${item.price}원</option>`;
  }).join('');
  
  $itemSel.innerHTML = $itemOpts;
}

/**
 * 재고 수량을 업데이트
 */
function updateStockInfo() {
  const $stockInfo = document.getElementById('stock-status'); //재고 수량을 보여주는 div
  
  const stockMsg = itemList.map(item => {
    if (item.stock < 5) {
      return `${item.name}: ${item.stock > 0 ? `재고 부족 (${item.stock}개 남음)` : '품절'}`;
    }
    return null; // 재고가 5 이상인 경우 null 반환
  })
  .filter(Boolean) 
  .join('\n');

  $stockInfo.textContent = stockMsg;
}

/**
 * 포인트 업데이트
 */
function renderBonusPts () {
  const $cartTotal = document.getElementById('cart-total'); //장바구니 총액 div
  g_bonusPts += Math.floor(g_TotalAmt / 1000);
  
  let $pointsDisplay = document.getElementById('loyalty-points');

  if (!$pointsDisplay) {
    // 포인트 정보를 기존의 총액 텍스트 바로 뒤에 추가
    const pointHTML = `<span id="loyalty-points" class="text-blue-500 ml-2">(포인트: ${g_bonusPts})</span>`;
    $cartTotal.insertAdjacentHTML('beforeend', pointHTML);
  } else {
    $pointsDisplay.textContent = `(포인트: ${g_bonusPts})`; // 기존 포인트 업데이트
  }
};

main();

/**
 * 장바구니 추가
 */
function handleAddCart() {
  let $itemSel = document.getElementById('product-select');
  let selectedItem = $itemSel.value; //선택된 상품

  //item 리스트에서 선택된 상품의 id와 매칭된 item 데이터를 가져옴
  let targetItem = itemList.find(function (item) { return item.id === selectedItem; });

  if (targetItem && targetItem.stock > 0) {
    let $existingItem = document.getElementById(targetItem.id);
    
    if ($existingItem) { // 장바구니에 해당 상품이 있는지 확인
      updateCartItem($existingItem, targetItem);
    } else { // 장바구니에 담겨 있지 않다면 새로 추가
      addItemToCart(targetItem);
    }

    calcCart(); // 장바구니 상품 계산
    g_LastSel = selectedItem;
  }
}

/**
 * 장바구니 상품 목록 업데이트
 * @param {HTMLElement} $item 장바구니에 추가되어있는 상품 (div)
 * @param {Object} targetItem 선택된 상품 데이터
 */
function updateCartItem($item, targetItem) {
  let updatedQty = parseInt($item.querySelector('span').textContent.split('x ')[1]) + 1; // 장바구니 추가되는 상품 수

  if (updatedQty <= targetItem.stock) {
    $item.querySelector('span').textContent = `${targetItem.name} - ${targetItem.price}원 x ${updatedQty}`;
    targetItem.stock--;
  } else {
    alert('재고가 부족합니다.');
  }
}

/**
 * 장바구니 상품 새로 추가
 * @param {Object} targetItem 선택된 상품 데이터 
 */
function addItemToCart(targetItem) {
  let $addItem = `
    <div id="${targetItem.id}" class="flex justify-between items-center mb-2">
      <span>${targetItem.name} - ${targetItem.price}원 x 1</span>
      <div>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${targetItem.id}" data-change="-1">-</button>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${targetItem.id}" data-change="1">+</button>
        <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${targetItem.id}">삭제</button>
      </div>
    </div>
  `;
  $cartItems.innerHTML += $addItem;
  targetItem.stock--;
}

let $addBtn = document.getElementById('add-to-cart');
$addBtn.addEventListener('click', handleAddCart); //장바구니 추가

/**
 * 장바구니 상품 재고 추가/빼기, 상품 삭제
 * @param event
 */
function handleChangeCart(event) {
  const target = event.target;
  const productId = target.dataset.productId;
  const $existingItem = document.getElementById(productId);
  const targetItem = itemList.find(item => item.id === productId);

  if (target.classList.contains('quantity-change')) { // 재고 추가/빼기
    const qtyChange = parseInt(target.dataset.change);
    handleQtyChange(qtyChange, $existingItem, targetItem);
  } else if (target.classList.contains('remove-item')) { // 상품 삭제
    removeCartItem($existingItem, targetItem);
  }

  calcCart(); // 장바구니 상품 금액 계산
}

/**
 * 장바구니 상품 재고 추가/빼기
 * @param {Number} qtyChange 재고 수량 추가/빼기
 * @param {HTMLElement} $existingItem 장바구니에 추가되어있는 상품 (div)
 * @param {Object} targetItem 선택된 상품 데이터 
 */
function handleQtyChange(qtyChange, $existingItem, targetItem) {
  const currentQty = parseInt($existingItem.querySelector('span').textContent.split('x ')[1]);
  const updatedQty = currentQty + qtyChange;

  if (isQtyValid(targetItem, currentQty, updatedQty)) {
    updateCartItemDisplay($existingItem, updatedQty);
    targetItem.stock -= qtyChange; // 재고 조정
  } else if (updatedQty <= 0) {
    removeCartItem($existingItem, targetItem);
  } else {
    alert('재고가 부족합니다.');
  }
}

/**
 * 장바구니 상품 재고 유효성 검사
 * @param {Object} targetItem 선택된 상품 데이터
 * @param {Number} currentQty 현재 재고 수량
 * @param {Number} updatedQty 바뀌어야하는 재고 수량
 * @returns {boolean} 유효성 검사 결과
 */
function isQtyValid(targetItem, currentQty, updatedQty) {
  return updatedQty > 0 && updatedQty <= targetItem.stock + currentQty;
}

/**
 * 장바구니 상품 수량 업데이트
 * @param {HTMLElement} $existingItem 장바구니에 추가되어있는 상품 (div)
 * @param {Number} updatedQty 바뀌어야하는 재고 수량
 */
function updateCartItemDisplay($existingItem, updatedQty) {
  const itemName = $existingItem.querySelector('span').textContent.split('x')[0].trim();
  $existingItem.querySelector('span').textContent = `${itemName} x ${updatedQty}`;
}

/**
 * 장바구니 상품 삭제
 * @param {HTMLElement} $existingItem 장바구니에 추가되어있는 상품 (div)
 * @param {Object} targetItem 선택된 상품 데이터
 */
function removeCartItem($existingItem, targetItem) {
  const removedQty = parseInt($existingItem.querySelector('span').textContent.split('x ')[1]);
  targetItem.stock += removedQty; // 재고 복원
  $existingItem.remove(); // 장바구니에 있는 상품 삭제
}

const $cartItems = document.getElementById('cart-items');
$cartItems.addEventListener('click', handleChangeCart); // 장바구니 상품 재고 추가/빼기, 상품 삭제

/**
 * 장바구니 담긴 상품들 가격 계산
 */
function calcCart() {
  g_TotalAmt = 0; // 초기화

  const $cartItems = document.getElementById('cart-items');
  const $cartItemList = $cartItems.children; // 장바구니 담긴 상품들
  
  let subTotal = 0; //할인 적용 안한 총 가격
  let itemCount = 0; //장바구니 담긴 수량

  Array.from($cartItemList).forEach(item => {
    const targetItem = itemList.find(product => product.id === item.id);
    const targetQty = parseInt(item.querySelector('span').textContent.split('x ')[1]);
    const itemTotal = targetItem.price * targetQty;

    subTotal += itemTotal;
    itemCount += targetQty;

    const discountRate = getDiscountRate(targetItem, targetQty);
    g_TotalAmt += itemTotal * (1 - discountRate);
  });

  applyBulkDiscount(itemCount, subTotal);

  updateCartDisplay(subTotal);
  updateStockInfo();
  renderBonusPts();
}

/**
 * 상품의 할인율을 계산하는 함수
 * @param {Object} item - 현재 상품 데이터
 * @param {Number} quantity - 상품 수량
 * @returns {Number} 할인율
 */
function getDiscountRate(item, quantity) {
  if (quantity < 10) return 0;

  const discountRates = {
    p1: 0.1,
    p2: 0.15,
    p3: 0.2,
    p4: 0.05,
    p5: 0.25
  };

  return discountRates[item.id] || 0;
}

/**
 * 총액에 대해 벌크 할인 적용
 * @param {Number} itemCount - 장바구니 내 아이템 수
 * @param {Number} subTotal - 총 합계 (할인적용X)
 */
function applyBulkDiscount(itemCount, subTotal) {
  if (itemCount < 30) return;

  const bulkDiscount = g_TotalAmt * 0.25;
  const itemDiscount = subTotal - g_TotalAmt;

  if (bulkDiscount > itemDiscount) {
    g_TotalAmt = subTotal * (1 - 0.25);
  }
}

/**
 * 장바구니 총액 및 할인 표시
 * @param {Number} subTotal - 총 합계 (할인적용X)
 */
function updateCartDisplay(subTotal) {

  let discountRate = (subTotal - g_TotalAmt) / subTotal;

  if (new Date().getDay() === 2) { //요일에 따라 추가 할인 적용
    discountRate = Math.max(discountRate, 0.1);
    g_TotalAmt  = g_TotalAmt  * (1 - 0.1);
  }
  
  const $cartTotal = document.getElementById('cart-total');
  $cartTotal.textContent = `총액: ${Math.round(g_TotalAmt)}원`;

  if (discountRate > 0) {
    const discountHTML = `
      <span class="text-green-500 ml-2">
        (${(discountRate * 100).toFixed(1)}% 할인 적용)
      </span>`;
    $cartTotal.insertAdjacentHTML('beforeend', discountHTML);
  }
}