let prodList, sel, addBtn, cartDisp, sum, stockInfo;
let lastSel,
  bonusPts = 0,
  totalAmt = 0,
  itemCnt = 0;

// 메인 컴포넌트 분리
const H1 = () => {
  let h1 = document.createElement('h1');
  h1.className = 'text-2xl font-bold mb-4';
  h1.textContent = '장바구니';

  return h1;
};
const CartItems = () => {
  cartDisp = document.createElement('div');
  cartDisp.id = 'cart-items';

  return cartDisp;
};
const CartTotal = () => {
  sum = document.createElement('div');
  sum.id = 'cart-total';
  sum.className = 'text-xl font-bold my-4';

  return sum;
};
const ProductSelect = () => {
  sel = document.createElement('select');
  sel.id = 'product-select';
  sel.className = 'border rounded p-2 mr-2';

  return sel;
};
const AddToCartBtn = () => {
  addBtn = document.createElement('button');
  addBtn.id = 'add-to-cart';
  addBtn.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  addBtn.textContent = '추가';

  return addBtn;
};
const StockStatus = () => {
  stockInfo = document.createElement('div');
  stockInfo.id = 'stock-status';
  stockInfo.className = 'text-sm text-gray-500 mt-2';

  return stockInfo;
};

function main() {
  prodList = [
    { id: 'p1', name: '상품1', val: 10000, q: 50 },
    { id: 'p2', name: '상품2', val: 20000, q: 30 },
    { id: 'p3', name: '상품3', val: 30000, q: 20 },
    { id: 'p4', name: '상품4', val: 15000, q: 0 },
    { id: 'p5', name: '상품5', val: 25000, q: 10 },
  ];

  let root = document.getElementById('app');
  let cont = document.createElement('div');
  let wrap = document.createElement('div');

  cont.className = 'bg-gray-100 p-8';
  wrap.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';

  const hTxt = H1();
  cartDisp = CartItems();
  sum = CartTotal();
  sel = ProductSelect();
  addBtn = AddToCartBtn();
  stockInfo = StockStatus();

  updateSelOpts(sel, prodList);

  wrap.appendChild(hTxt);
  wrap.appendChild(cartDisp);
  wrap.appendChild(sum);
  wrap.appendChild(sel);
  wrap.appendChild(addBtn);
  wrap.appendChild(stockInfo);
  cont.appendChild(wrap);
  root.appendChild(cont);

  calcCart(sum);

  setTimeout(function () {
    setInterval(function () {
      let luckyItem = prodList[Math.floor(Math.random() * prodList.length)];
      if (Math.random() < 0.3 && luckyItem.q > 0) {
        luckyItem.val = Math.round(luckyItem.val * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateSelOpts(sel, prodList);
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(function () {
    setInterval(function () {
      if (lastSel) {
        let suggest = prodList.find(function (item) {
          return item.id !== lastSel && item.q > 0;
        });
        if (suggest) {
          alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.val = Math.round(suggest.val * 0.95);
          updateSelOpts(sel, prodList);
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

function updateSelOpts(sel, prodList) {
  if (!sel) {
    return null;
  }

  sel.innerHTML = '';
  prodList.forEach((item) => {
    const { id, name, val, q } = item;
    const opt = document.createElement('option');

    opt.value = id;
    opt.textContent = `${name} - ${val}원`;
    if (q === 0) {
      opt.disabled = true;
    }

    sel.appendChild(opt);
  });
}

// calcCart 함수 분리
const mapCartItems = (cartDisp, prodList) => {
  const elements = Array.from(cartDisp.children);
  const ids = elements.map((item) => item.id);
  const mapProducts = ids.map((id) => prodList.find((prod) => prod.id === id));
  const cartItems = mapProducts.map((item, i) => ({
    ...item,
    q: parseInt(elements[i].querySelector('span').textContent.split('x ')[1]),
  }));

  return cartItems;
};
const getDiscountRate = (cart) => {
  const { id, q } = cart;
  let rate = 0;

  if (q >= 10) {
    if (id === 'p1') {
      rate = 0.1;
    } else if (id === 'p2') {
      rate = 0.15;
    } else if (id === 'p3') {
      rate = 0.2;
    } else if (id === 'p4') {
      rate = 0.05;
    } else if (id === 'p5') {
      rate = 0.25;
    }
  }

  return rate;
};
const applyBulkDiscount = (totalCount, totalOriginPrice, totalDiscountPrice) => {
  let rate = 0;

  if (totalCount >= 30) {
    let bulkDiscount = totalDiscountPrice * 0.25;
    let itemDiscount = totalOriginPrice - totalDiscountPrice;

    if (bulkDiscount > itemDiscount) {
      totalDiscountPrice = totalOriginPrice * (1 - 0.25);
      rate = 0.25;
    } else {
      rate = (totalOriginPrice - totalDiscountPrice) / totalOriginPrice;
    }
  } else {
    rate = (totalOriginPrice - totalDiscountPrice) / totalOriginPrice;
  }

  rate = isNaN(rate) ? 0 : rate;

  return [rate, totalDiscountPrice];
};
const getSpecialDiscountRate = (rate, totalPrice) => {
  if (new Date().getDay() === 2) {
    totalPrice *= 1 - 0.1;
    rate = Math.max(rate, 0.1);
  }

  rate = isNaN(rate) ? 0 : rate;

  return [rate, totalPrice];
};

function calcCart(sum) {
  const carts = mapCartItems(cartDisp, prodList);
  const count = carts.reduce((acc, item) => acc + item.q, 0);
  const totalOriginPrice = carts.reduce((acc, item) => acc + item.val * item.q, 0);
  const totalDiscountPrice = carts.reduce(
    (acc, item) => acc + item.val * item.q * (1 - getDiscountRate(item)),
    0
  );

  let rate = 0;
  let totalPrice = 0;
  [rate, totalPrice] = applyBulkDiscount(count, totalOriginPrice, totalDiscountPrice);
  [rate, totalPrice] = getSpecialDiscountRate(rate, totalPrice);

  sum.textContent = `총액: ${Math.round(totalPrice)}원`;

  if (rate > 0) {
    let span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (rate * 100).toFixed(1) + '% 할인 적용)';
    sum.appendChild(span);
  }

  updateStockInfo(prodList);
  renderBonusPts(totalPrice, sum);
}

const renderBonusPts = (totalPrice, sum) => {
  bonusPts += Math.floor(totalPrice / 1000);

  let ptsTag = document.getElementById('loyalty-points');
  if (!ptsTag) {
    ptsTag = document.createElement('span');
    ptsTag.id = 'loyalty-points';
    ptsTag.className = 'text-blue-500 ml-2';
    sum.appendChild(ptsTag);
  }

  ptsTag.textContent = '(포인트: ' + bonusPts + ')';
};

function updateStockInfo(prodList) {
  let infoMsg = '';

  prodList.forEach(function (item) {
    if (item.q < 5) {
      infoMsg +=
        item.name + ': ' + (item.q > 0 ? '재고 부족 (' + item.q + '개 남음)' : '품절') + '\n';
    }
  });

  stockInfo.textContent = infoMsg;
}

main();

addBtn.addEventListener('click', function () {
  let selItem = sel.value;
  let itemToAdd = prodList.find(function (p) {
    return p.id === selItem;
  });
  if (itemToAdd && itemToAdd.q > 0) {
    let item = document.getElementById(itemToAdd.id);
    if (item) {
      let newQty = parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
      if (newQty <= itemToAdd.q) {
        item.querySelector('span').textContent =
          itemToAdd.name + ' - ' + itemToAdd.val + '원 x ' + newQty;
        itemToAdd.q--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      let newItem = document.createElement('div');
      newItem.id = itemToAdd.id;
      newItem.className = 'flex justify-between items-center mb-2';
      newItem.innerHTML =
        '<span>' +
        itemToAdd.name +
        ' - ' +
        itemToAdd.val +
        '원 x 1</span><div>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="-1">-</button>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="1">+</button>' +
        '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
        itemToAdd.id +
        '">삭제</button></div>';
      cartDisp.appendChild(newItem);
      itemToAdd.q--;
    }
    calcCart(sum);
    lastSel = selItem;
  }
});

cartDisp.addEventListener('click', function (event) {
  let tgt = event.target;

  if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
    let prodId = tgt.dataset.productId;
    let itemElem = document.getElementById(prodId);
    let prod = prodList.find(function (p) {
      return p.id === prodId;
    });
    if (tgt.classList.contains('quantity-change')) {
      let qtyChange = parseInt(tgt.dataset.change);
      let newQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) + qtyChange;
      if (
        newQty > 0 &&
        newQty <= prod.q + parseInt(itemElem.querySelector('span').textContent.split('x ')[1])
      ) {
        itemElem.querySelector('span').textContent =
          itemElem.querySelector('span').textContent.split('x ')[0] + 'x ' + newQty;
        prod.q -= qtyChange;
      } else if (newQty <= 0) {
        itemElem.remove();
        prod.q -= qtyChange;
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (tgt.classList.contains('remove-item')) {
      let remQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]);
      prod.q += remQty;
      itemElem.remove();
    }
    calcCart(sum);
  }
});
