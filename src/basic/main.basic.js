let prodList, containerWrap, container, title, cartList, cartTotalPrice, cartItemSelect, addBtn, soldoutList;
var lastSelectedProduct,
  bonusPoints = 0,
  totalPrice = 0,
  itemCnt = 0;

function main() {
  prodList = [
    { id: 'p1', name: '상품1', price: 10000, count: 50 },
    { id: 'p2', name: '상품2', price: 20000, count: 30 },
    { id: 'p3', name: '상품3', price: 30000, count: 20 },
    { id: 'p4', name: '상품4', price: 15000, count: 0 },
    { id: 'p5', name: '상품5', price: 25000, count: 10 },
  ];

  var root = document.getElementById('app');

  function createElementWithAttributes(tag, attributes) {
    const element = document.createElement(tag);
    for (let key in attributes) {
      element[key] = attributes[key];
    }
    return element;
  }

  containerWrap = createElementWithAttributes('div', {
    className: 'bg-gray-100 p-8',
  });

  container = createElementWithAttributes('div', {
    className: 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
  });

  title = createElementWithAttributes('h1', {
    className: 'text-2xl font-bold mb-4',
    textContent: '장바구니',
  });

  cartList = createElementWithAttributes('div', {
    id: 'cart-items',
  });

  cartTotalPrice = createElementWithAttributes('div', {
    id: 'cart-total',
    className: 'text-xl font-bold my-4',
  });

  cartItemSelect = createElementWithAttributes('select', {
    id: 'product-select',
    className: 'border rounded p-2 mr-2',
  });

  addBtn = createElementWithAttributes('button', {
    id: 'add-to-cart',
    className: 'bg-blue-500 text-white px-4 py-2 rounded',
    textContent: '추가',
  });

  soldoutList = createElementWithAttributes('div', {
    id: 'stock-status',
    className: 'text-sm text-gray-500 mt-2',
  });

  updateProdList();

  container.append(title, cartList, cartTotalPrice, cartItemSelect, addBtn, soldoutList);
  containerWrap.appendChild(container);
  root.appendChild(container);

  caclCartPrice();

  alertSaleItem(luckySaleItem, Math.random() * 10000, 30000);
  alertSaleItem(recommendSaleItem, Math.random() * 20000, 60000);

  function alertSaleItem(callback, initialDelay, setTime) {
    setTimeout(function () {
      callback();
      setInterval(callback, setTime);
    }, initialDelay);
  }

  function luckySaleItem() {
    const selectedProduct = prodList[Math.floor(Math.random() * prodList.length)];
    const isSaleItem = Math.random() < 0.3;

    if (isSaleItem && selectedProduct.count > 0) {
      selectedProduct.price = Math.round(selectedProduct.price * 0.8);
      alert(`번개세일! ${selectedProduct.name}이(가) 20% 할인 중입니다!`);
      updateProdList();
    }
  }

  function recommendSaleItem() {
    if (lastSelectedProduct) {
      const recommendItem = prodList.find((item) => item.id !== lastSelectedProduct && item.count > 0);

      if (recommendItem) {
        recommendItem.price = Math.round(recommendItem.price * 0.95);
        alert(`${recommendItem.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
        updateProdList();
      }
    }
  }
}

// 상품 목록 (select) 업데이트
function updateProdList() {
  cartItemSelect.innerHTML = '';
  prodList.forEach(function (item) {
    var opt = document.createElement('option');
    opt.value = item.id;

    opt.textContent = item.name + ' - ' + item.price + '원';
    if (item.count === 0) opt.disabled = true;
    cartItemSelect.appendChild(opt);
  });
}

// 금액 계산 함수
function caclCartPrice() {
  console.log('caclCartPrice()');
  totalPrice = 0;
  itemCnt = 0;
  var cartItems = cartList.children;
  var initialTotal = 0;
  for (var i = 0; i < cartItems.length; i++) {
    (function () {
      var curItem;
      for (var j = 0; j < prodList.length; j++) {
        if (prodList[j].id === cartItems[i].id) {
          curItem = prodList[j];
          break;
        }
      }
      // count = 수량 / price = 금액
      var count = parseInt(cartItems[i].querySelector('span').textContent.split('x ')[1]);
      var itemTot = curItem.price * count;
      var disc = 0;
      // itemCnt = 총 수량 / initialTotal = 총 금액
      itemCnt += count;
      initialTotal += itemTot;

      //
      if (count >= 10) {
        if (curItem.id === 'p1') disc = 0.1;
        else if (curItem.id === 'p2') disc = 0.15;
        else if (curItem.id === 'p3') disc = 0.2;
        else if (curItem.id === 'p4') disc = 0.05;
        else if (curItem.id === 'p5') disc = 0.25;
      }
      totalPrice += itemTot * (1 - disc);
    })();
  }

  let totalDisc = 0;
  if (itemCnt >= 30) {
    var bulkDisc = totalPrice * 0.25;
    var itemDisc = initialTotal - totalPrice;
    if (bulkDisc > itemDisc) {
      totalPrice = initialTotal * (1 - 0.25);
      totalDisc = 0.25;
    } else {
      totalDisc = (initialTotal - totalPrice) / initialTotal;
    }
  } else {
    totalDisc = (initialTotal - totalPrice) / initialTotal;
  }

  if (new Date().getDay() === 2) {
    totalPrice *= 1 - 0.1;
    totalDisc = Math.max(totalDisc, 0.1);
  }

  cartTotalPrice.textContent = '총액: ' + Math.round(totalPrice) + '원';
  if (totalDisc > 0) {
    var span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (totalDisc * 100).toFixed(1) + '% 할인 적용)';
    cartTotalPrice.appendChild(span);
  }
  console.log('totalDisc::', totalDisc);
  updatesoldoutList();
  renderBonusPts();
}
function renderBonusPts() {
  bonusPoints += Math.floor(totalPrice / 1000);
  var ptsTag = document.getElementById('loyalty-points');
  if (!ptsTag) {
    ptsTag = document.createElement('span');
    ptsTag.id = 'loyalty-points';
    ptsTag.className = 'text-blue-500 ml-2';
    cartTotalPrice.appendChild(ptsTag);
  }

  ptsTag.textContent = '(포인트: ' + bonusPoints + ')';
}

function updatesoldoutList() {
  var infoMsg = '';
  prodList.forEach(function (item) {
    if (item.count < 5) {
      infoMsg += item.name + ': ' + (item.count > 0 ? '재고 부족 (' + item.count + '개 남음)' : '품절') + '\n';
    }
  });
  soldoutList.textContent = infoMsg;
}
main();
addBtn.addEventListener('click', function () {
  var selItem = cartItemSelect.value;
  var itemToAdd = prodList.find(function (p) {
    return p.id === selItem;
  });
  if (itemToAdd && itemToAdd.count > 0) {
    var item = document.getElementById(itemToAdd.id);
    if (item) {
      var newQty = parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
      if (newQty <= itemToAdd.count) {
        item.querySelector('span').textContent = itemToAdd.name + ' - ' + itemToAdd.price + '원 x ' + newQty;
        itemToAdd.count--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      var newItem = document.createElement('div');
      newItem.id = itemToAdd.id;
      newItem.className = 'flex justify-between items-center mb-2';
      newItem.innerHTML =
        '<span>' +
        itemToAdd.name +
        ' - ' +
        itemToAdd.price +
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
      cartList.appendChild(newItem);
      itemToAdd.count--;
    }
    caclCartPrice();
    lastSelectedProduct = selItem;
  }
});
cartList.addEventListener('click', function (event) {
  var eTarget = event.target;

  if (eTarget.classList.contains('quantity-change') || eTarget.classList.contains('remove-item')) {
    var prodId = eTarget.dataset.productId;
    var itemElem = document.getElementById(prodId);
    var prod = prodList.find(function (p) {
      return p.id === prodId;
    });
    if (eTarget.classList.contains('quantity-change')) {
      var qtyChange = parseInt(eTarget.dataset.change);
      var newQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) + qtyChange;
      if (newQty > 0 && newQty <= prod.count + parseInt(itemElem.querySelector('span').textContent.split('x ')[1])) {
        itemElem.querySelector('span').textContent =
          itemElem.querySelector('span').textContent.split('x ')[0] + 'x ' + newQty;
        prod.count -= qtyChange;
      } else if (newQty <= 0) {
        itemElem.remove();
        prod.count -= qtyChange;
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (eTarget.classList.contains('remove-item')) {
      var remQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]);
      prod.count += remQty;
      itemElem.remove();
    }
    caclCartPrice();
  }
});
