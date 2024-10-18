// DOM 요소
let sel, addBtn, cartDisp, sum, stockInfo;

//상품관련
let prodList, lastSel;

//장바구니 상태
let bonusPts = 0;
let totalAmt = 0;
let itemCnt = 0;

function main() {
  initProducts();
  createDOMElements();

  updateSelOpts();
  calcCart();
  setupTimers();
}

function initProducts() {
  prodList = [
    { id: 'p1', name: '상품1', val: 10000, q: 50 },
    { id: 'p2', name: '상품2', val: 20000, q: 30 },
    { id: 'p3', name: '상품3', val: 30000, q: 20 },
    { id: 'p4', name: '상품4', val: 15000, q: 0 },
    { id: 'p5', name: '상품5', val: 25000, q: 10 }
  ];
}

//DOM생성
function createDOMElements() {
  const root = document.getElementById('app');
  const cont = document.createElement('div');
  const wrap = document.createElement('div');
  const hTxt = document.createElement('h1');

  cartDisp = document.createElement('div');
  sum = document.createElement('div');
  sel = document.createElement('select');
  addBtn = document.createElement('button');
  stockInfo = document.createElement('div');

  cartDisp.id = 'cart-items';
  sum.id = 'cart-total';
  sel.id = 'product-select';
  addBtn.id = 'add-to-cart';

  stockInfo.id = 'stock-status';
  cont.className = 'bg-gray-100 p-8';
  wrap.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  hTxt.className = 'text-2xl font-bold mb-4';
  sum.className = 'text-xl font-bold my-4';
  sel.className = 'border rounded p-2 mr-2';
  addBtn.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  stockInfo.className = 'text-sm text-gray-500 mt-2';
  hTxt.textContent = '장바구니';
  addBtn.textContent = '추가';

  wrap.appendChild(hTxt);
  wrap.appendChild(cartDisp);
  wrap.appendChild(sum);
  wrap.appendChild(sel);
  wrap.appendChild(addBtn);
  wrap.appendChild(stockInfo);
  cont.appendChild(wrap);
  root.appendChild(cont);
}

function updateSelOpts() {
  sel.innerHTML = '';
  prodList.forEach(function (item) {
    const opt = document.createElement('option');
    opt.value = item.id;

    opt.textContent = `${item.name} - ${item.val}원`;
    if (item.q === 0) opt.disabled = true;
    sel.appendChild(opt);
  });
}

function calcCart() {
  totalAmt = 0;
  itemCnt = 0;
  const cartItems = cartDisp.children;
  let subTot = 0;
  for (let i = 0; i < cartItems.length; i++) {
    let curItem;
    for (let j = 0; j < prodList.length; j++) {
      if (prodList[j].id === cartItems[i].id) {
        curItem = prodList[j];
        break;
      }
    }

    const q = parseInt(
      cartItems[i].querySelector('span').textContent.split('x ')[1]
    );
    const itemTot = curItem.val * q;
    itemCnt += q;
    subTot += itemTot;
  }

  totalAmt = subTot;

  if (itemCnt >= 30) {
    totalAmt *= 0.75;
  }

  const isDiscountDay = true;
  if (isDiscountDay) {
    totalAmt *= 0.9;
  }

  sum.textContent = `총액: ${Math.round(totalAmt)}원`;

  if (isDiscountDay || itemCnt >= 30) {
    const span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(10.0% 할인 적용)';
    sum.appendChild(span);
  }

  updateStockInfo();
  renderBonusPts();
}

const renderBonusPts = () => {
  bonusPts = Math.floor(totalAmt / 1000) * 4.5; // 1000원당 4.5포인트
  let ptsTag = document.getElementById('loyalty-points');
  if (!ptsTag) {
    ptsTag = document.createElement('span');
    ptsTag.id = 'loyalty-points';
    ptsTag.className = 'text-blue-500 ml-2';
    sum.appendChild(ptsTag);
  }
  ptsTag.textContent = `(포인트: ${Math.round(bonusPts)})`;
};

function setupTimers() {
  setTimeout(function () {
    setInterval(luckySale, 30000);
  }, Math.random() * 10000);

  setTimeout(function () {
    setInterval(lastsale, 60000);
  }, Math.random() * 20000);
}

function luckySale() {
  const luckyItem = prodList[Math.floor(Math.random() * prodList.length)];
  if (Math.random() < 0.3 && luckyItem.q > 0) {
    luckyItem.val = Math.round(luckyItem.val * 0.8);
    alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
    updateSelOpts();
  }
}

function lastsale() {
  if (lastSel) {
    const suggest = prodList.find(function (item) {
      return item.id !== lastSel && item.q > 0;
    });
    if (suggest) {
      alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
      suggest.val = Math.round(suggest.val * 0.95);
      updateSelOpts();
    }
  }
}

function updateStockInfo() {
  let infoMsg = '';
  prodList.forEach(function (item) {
    if (item.q < 5) {
      infoMsg += `${item.name}: ${
        item.q > 0 ? `재고 부족 (${item.q}개 남음)` : '품절'
      }\n`;
    }
  });
  stockInfo.textContent = infoMsg;
}

main();
addBtn.addEventListener('click', function () {
  const selItem = sel.value;
  const itemToAdd = prodList.find(function (p) {
    return p.id === selItem;
  });
  if (itemToAdd && itemToAdd.q > 0) {
    const item = document.getElementById(itemToAdd.id);
    if (item) {
      const newQty =
        parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
      if (newQty <= itemToAdd.q) {
        item.querySelector('span').textContent =
          `${itemToAdd.name} - ${itemToAdd.val}원 x ${newQty}`;
        itemToAdd.q--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      const newItem = document.createElement('div');
      newItem.id = itemToAdd.id;
      newItem.className = 'flex justify-between items-center mb-2';
      newItem.innerHTML =
        `<span>${itemToAdd.name} - ${itemToAdd.val}원 x 1</span><div>` +
        `<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${
          itemToAdd.id
        }" data-change="-1">-</button>` +
        `<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${
          itemToAdd.id
        }" data-change="1">+</button>` +
        `<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${
          itemToAdd.id
        }">삭제</button></div>`;
      cartDisp.appendChild(newItem);
      itemToAdd.q--;
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
    const itemElem = document.getElementById(prodId);
    const prod = prodList.find(function (p) {
      return p.id === prodId;
    });
    if (tgt.classList.contains('quantity-change')) {
      const qtyChange = parseInt(tgt.dataset.change);
      const newQty =
        parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) +
        qtyChange;
      if (
        newQty > 0 &&
        newQty <=
          prod.q +
            parseInt(itemElem.querySelector('span').textContent.split('x ')[1])
      ) {
        itemElem.querySelector('span').textContent = `${
          itemElem.querySelector('span').textContent.split('x ')[0]
        }x ${newQty}`;
        prod.q -= qtyChange;
      } else if (newQty <= 0) {
        itemElem.remove();
        prod.q -= qtyChange;
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (tgt.classList.contains('remove-item')) {
      const remQty = parseInt(
        itemElem.querySelector('span').textContent.split('x ')[1]
      );
      prod.q += remQty;
      itemElem.remove();
    }
    calcCart();
  }
});
