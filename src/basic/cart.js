import { prodList } from './productList.js';
import { cartDisp, renderCartDetails, sum } from './ui.js';
import { sel } from './ui.js';
import { createElement } from './utils.js';

let totalAmt = 0,
  itemCnt = 0,
  bonusPts = 0;

export function initializeCart() {
  calcCart();
}

export function calcCart() {
  totalAmt = 0;
  itemCnt = 0;
  const cartItems = cartDisp.children;
  let subTot = 0;

  Array.from(cartItems).forEach((cartItem) => {
    const curItem = prodList.find(({ id }) => id === cartItem.id);
    if (!curItem) {
      console.error('Item not found in prodList:', cartItem.id);
      return;
    }

    const curStock = parseInt(
      cartItem.querySelector('span').textContent.split('x ')[1],
    );
    if (isNaN(curStock)) {
      console.error('Invalid stock for item:', cartItem.id);
      return;
    }

    const itemTot = curItem.price * curStock;
    if (isNaN(itemTot)) {
      console.error('Invalid itemTot for item:', cartItem.id, 'price:', curItem.price, 'stock:', curStock);
      return;
    }

    let disc = calculateItemDiscount(curItem, curStock) || 0;

    itemCnt += curStock;
    subTot += itemTot;
    totalAmt += itemTot * (1 - disc);
  });

  let discountRate = subTot > 0 ? (subTot - totalAmt) / subTot : 0;

  if (itemCnt >= 30) {
    const bulkDisc = totalAmt * 0.25;
    const itemDisc = subTot - totalAmt;
    if (bulkDisc > itemDisc) {
      totalAmt = subTot * 0.75;
    }
  }

  const dayOfWeek = new Date().getDay();
  if (dayOfWeek === 2) {
    totalAmt *= 0.9;
    discountRate = Math.max(discountRate, 0.1);
  }

  if (isNaN(totalAmt) || isNaN(discountRate)) {
    console.error('NaN detected in final calculation. Using fallback values.');
    totalAmt = subTot;
    discountRate = 0;
  }

  bonusPts += Math.floor(totalAmt / 1000);

  renderCartDetails(totalAmt, discountRate);
  updateStockInfo();
  renderBonusPts();
}


function calculateItemDiscount(item, quantity) {
  if (quantity >= 10) {
    switch (item.id) {
      case 'p1': return 0.1;
      case 'p2': return 0.15;
      case 'p3': return 0.2;
      case 'p4': return 0.05;
      case 'p5': return 0.25;
      default: return 0;
    }
  }
  return 0;
}

export function updateStockInfo() {
  let infoMsg = prodList
    .filter(item => item.stock < 5)
    .map(({ name, stock }) => `${name}: ${stock > 0 ? '재고 부족 (' + stock + '개 남음)' : '품절'}`)
    .join('\n');

  document.getElementById('stock-status').textContent = infoMsg;
}

export function renderBonusPts() {
  let ptsTag = document.getElementById('loyalty-points')
  if (!ptsTag) {
    ptsTag = document.createElement('span')
    ptsTag.id = 'loyalty-points'
    ptsTag.className = 'text-blue-500 ml-2'
    sum.appendChild(ptsTag)
  }
  ptsTag.textContent = `(포인트: ${bonusPts})`
}

export function handleAddToCart() {
  const selItem = sel.value; // 선택된 상품 ID를 가져옵니다.
  const itemToAdd = prodList.find(stock => stock.id === selItem); // 상품 목록에서 선택된 상품을 찾습니다.

  if (itemToAdd && itemToAdd.stock > 0) { // 상품이 존재하고 재고가 있는 경우
    // 장바구니에서 해당 상품이 이미 존재하는지 확인합니다.
    let item = document.getElementById(itemToAdd.id);
    if (item) {
      // 이미 있는 경우, 수량을 증가시킵니다.
      const currentQty = parseInt(item.querySelector('span').textContent.split('x ')[1]);
      const newQty = currentQty + 1;

      if (newQty <= itemToAdd.stock) { // 재고가 충분한 경우
        item.querySelector('span').textContent = `${itemToAdd.name} - ${itemToAdd.price}원 x ${newQty}`;
        itemToAdd.stock--; // 재고 감소
      } else {
        alert('재고가 부족합니다.'); // 재고가 부족한 경우 경고
      }
    } else {
      // 장바구니에 새로운 상품 항목을 추가합니다.
      item = document.createElement('div');
      item.id = itemToAdd.id; // 상품 ID로 Div의 ID를 설정합니다.
      item.className = 'flex justify-between items-center mb-2';
      item.innerHTML = `
        <span>${itemToAdd.name} - ${itemToAdd.price}원 x 1</span>
        <div>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="-1">-</button>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="1">+</button>
          <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${itemToAdd.id}">삭제</button>
        </div>`;
        
      cartDisp.appendChild(item); // 장바구니 디스플레이에 추가
      itemToAdd.stock--; // 재고 감소
    }
    calcCart(); // 장바구니 계산
    updateStockInfo()
  } else {
    alert('재고가 부족합니다.'); // 상품이 없거나 이미 품절일 때 경고
  }
}

export function handleCartInteraction(event) {
  const tgt = event.target; // 이벤트 발생 요소를 가져옵니다.

  // 수량 변경 또는 삭제 버튼 클릭 여부를 확인합니다.
  if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
    const prodId = tgt.dataset.productId; // 버튼 클릭 시, 상품 ID를 가져옵니다.
    const itemElem = document.getElementById(prodId); // 장바구니에서 해당 상품 요소를 찾습니다.
    const prod = prodList.find(p => p.id === prodId); // 상품 목록에서 해당 상품 객체를 찾습니다.

    if (tgt.classList.contains('quantity-change')) {
      const qtyChange = parseInt(tgt.dataset.change); // 버튼 데이터에서 수량 변경 값을 가져옵니다.
      const currentQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]); // 현재 수량을 가져옵니다.
      const newQty = currentQty + qtyChange; // 새로운 수량을 계산합니다.

      // 새로운 수량이 유효한지 체크합니다.
      if (newQty > 0 && newQty <= (prod.stock + currentQty)) { 
        itemElem.querySelector('span').textContent = `${prod.name} - ${prod.price}원 x ${newQty}`; // 화면에 수량 업데이트
        prod.stock -= qtyChange; // 상품 재고를 업데이트
      } else if (newQty <= 0) {
        itemElem.remove(); // 수량이 0 이하가 되면 장바구니에서 해당 상품 항목을 제거합니다.
        prod.stock += currentQty; // 장바구니에서 제거한 상품의 재고를 복구합니다.
      } else {
        alert('재고가 부족합니다.'); // 재고가 부족하는 경우 경고
      }
    } else if (tgt.classList.contains('remove-item')) {
      const remQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]); // 제거할 상품의 현재 수량을 가져옵니다.
      prod.stock += remQty; // 장바구니에서 제거한 수량만큼 상품 재고를 증가시킵니다.
      itemElem.remove(); // 항목을 장바구니에서 제거합니다.
    }

    calcCart(); // 장바구니 계산
    updateStockInfo(); // 재고 정보 업데이트
  }
}