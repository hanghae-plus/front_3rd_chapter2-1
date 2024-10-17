// - 의미 있는 이름 사용
// - 함수를 작고 단일 책임을 가지도록 만들기
// - 중복 코드 제거
// - 주석 대신 자체 설명적인 코드 작성
// - 일관된 포맷팅 유지
// - 복잡한 조건문 단순화
// - 적절한 추상화 수준 유지
import {
  renderElement,
  cartDisp,
  sum,
  sel,
  addBtn,
  stockInfo,
  createElement,
  setDiscountAlert,
  renderPointTag,
  renderStockMsg,
  renderDiscountTxt,
  renderItem,
} from './element.js';

import { calcBonusPts, getAmount, getPriceTxt, calTotalAmount } from './calc';

import { DISCOUNT_RATIO, BULK_DISCOUNT_RATIO, BULK_AMOUNT } from './const';

var prodList;
var lastSel,
  bonusPts = 0,
  totalAmt = 0;

function main() {
  prodList = [
    { id: 'p1', name: '상품1', price: 10000, amount: 50 },
    { id: 'p2', name: '상품2', price: 20000, amount: 30 },
    { id: 'p3', name: '상품3', price: 30000, amount: 20 },
    { id: 'p4', name: '상품4', price: 15000, amount: 0 },
    { id: 'p5', name: '상품5', price: 25000, amount: 10 },
  ];

  //UI
  const root = document.getElementById('app');
  const app = renderElement(prodList);
  root.appendChild(app);

  addEvent();
  setDiscountAlert(prodList, lastSel);

  //Logic
  calcCart();
}

function calcCart() {
  totalAmt = 0;
  let itemCnt = 0;
  const cartItems = cartDisp.children;
  let subTot = 0;

  for (let i = 0; i < cartItems.length; i++) {
    const curItem = prodList.find((item) => item.id === cartItems[i].id);

    const amount = getAmount(cartItems[i]);
    const itemTot = curItem.price * amount;
    let disc = 0;
    itemCnt += amount;
    subTot += itemTot;

    if (amount >= 10) {
      const discount = DISCOUNT_RATIO.find((item) => item.id === curItem.id);
      disc = discount ? discount.ratio : 0;
    }
    totalAmt += calTotalAmount(itemTot, disc);
  }
  let discRate = 0;

  if (itemCnt >= BULK_AMOUNT) {
    const bulkDisc = totalAmt * BULK_DISCOUNT_RATIO;
    const itemDisc = subTot - totalAmt;
    if (bulkDisc > itemDisc) {
      totalAmt = calTotalAmount(subTot, BULK_DISCOUNT_RATIO);
      discRate = BULK_DISCOUNT_RATIO;
    } else {
      discRate = (subTot - totalAmt) / subTot;
    }
  } else {
    discRate = (subTot - totalAmt) / subTot;
  }

  if (new Date().getDay() === 2) {
    totalAmt = calTotalAmount(totalAmt, 0.1);
    discRate = Math.max(discRate, 0.1);
  }
  sum.textContent = '총액: ' + Math.round(totalAmt) + '원';

  discRate > 0 && renderDiscountTxt(discRate);
  renderStockMsg(prodList);

  bonusPts = calcBonusPts(bonusPts, totalAmt);
  renderPointTag(bonusPts);
}

main();
function applyDiscount() {}

function addEvent() {
  addBtn.addEventListener('click', function () {
    const selItem = sel.value;
    const itemToAdd = prodList.find((p) => p.id === selItem);

    if (itemToAdd && itemToAdd.amount > 0) {
      const item = document.getElementById(itemToAdd.id);
      if (item) {
        const newQty = getAmount(item) + 1;
        if (newQty <= itemToAdd.amount) {
          item.querySelector('span').textContent =
            itemToAdd.name + ' - ' + itemToAdd.price + '원 x ' + newQty;
          itemToAdd.amount--;
        } else {
          alert('재고가 부족합니다.');
        }
      } else {
        renderItem(itemToAdd);

        itemToAdd.amount--;
      }
      calcCart();
      lastSel = selItem;
    }
  });
  cartDisp.addEventListener('click', function (event) {
    const tgt = event.target;

    if (
      tgt.classList.contains('quantity-change') ||
      tgt.classList.contains('remove-item')
    ) {
      const prodId = tgt.dataset.productId;
      let itemElem = document.getElementById(prodId);
      const prod = prodList.find((p) => p.id === prodId);
      if (tgt.classList.contains('quantity-change')) {
        const qtyChange = parseInt(tgt.dataset.change);
        const newQty = getAmount(itemElem) + qtyChange;
        if (newQty > 0 && newQty <= prod.amount + getAmount(itemElem)) {
          itemElem.querySelector('span').textContent =
            getPriceTxt(itemElem) + 'x ' + newQty;
          prod.amount -= qtyChange;
        } else if (newQty <= 0) {
          itemElem.remove();
          prod.amount -= qtyChange;
        } else {
          alert('재고가 부족합니다.');
        }
      } else if (tgt.classList.contains('remove-item')) {
        const remQty = getAmount(itemElem);
        prod.amount += remQty;
        itemElem.remove();
      }
      calcCart();
    }
  });
}
