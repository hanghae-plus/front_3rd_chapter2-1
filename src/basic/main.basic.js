const productList = [
  { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
  { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
  { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
  { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
  { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
];

let loyaltyPoints = 0;
let lastAddedProduct;

function createElement(tag, propertyObject) {
  const element = document.createElement(tag);
  for (const key in propertyObject) {
    element[key] = propertyObject[key];
  }
  return element;
}

function createContainerDiv() {
  return createElement('div', { className: 'bg-gray-100 p-8' });
}

function createWrapperDiv() {
  return createElement('div', {
    className:
      'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
  });
}

function createTitleH1() {
  return createElement('h1', {
    className: 'text-2xl font-bold mb-4',
    textContent: '장바구니',
  });
}

function createCartItemsDiv() {
  return createElement('div', { id: 'cart-items' });
}

function createCartTotalDiv() {
  return createElement('div', {
    id: 'cart-total',
    className: 'text-xl font-bold my-4',
  });
}

function createProductSelect() {
  return createElement('select', {
    id: 'product-select',
    className: 'border rounded p-2 mr-2',
  });
}

function createAddButton() {
  return createElement('button', {
    id: 'add-to-cart',
    className: 'bg-blue-500 text-white px-4 py-2 rounded',
    textContent: '추가',
  });
}

function createStockStatusDiv() {
  return createElement('div', {
    id: 'stock-status',
    className: 'text-sm text-gray-500 mt-2',
  });
}

function main() {
  const $root = document.getElementById('app');
  const $containerDiv = createContainerDiv();
  const $wrapperDiv = createWrapperDiv();
  const $titleH1 = createTitleH1();
  const $cartItemsDiv = createCartItemsDiv();
  const $cartTotalDiv = createCartTotalDiv();
  const $productSelect = createProductSelect();
  const $addButton = createAddButton();
  const $stockStatusDiv = createStockStatusDiv();

  updateOptionList($productSelect);

  $wrapperDiv.appendChild($titleH1);
  $wrapperDiv.appendChild($cartItemsDiv);
  $wrapperDiv.appendChild($cartTotalDiv);
  $wrapperDiv.appendChild($productSelect);
  $wrapperDiv.appendChild($addButton);
  $wrapperDiv.appendChild($stockStatusDiv);
  $containerDiv.appendChild($wrapperDiv);
  $root.appendChild($containerDiv);

  calcCart($cartItemsDiv, $cartTotalDiv, $stockStatusDiv);

  setTimeout(function () {
    setInterval(function () {
      var luckyItem =
        productList[Math.floor(Math.random() * productList.length)];
      if (Math.random() < 0.3 && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateOptionList($productSelect);
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(function () {
    setInterval(function () {
      if (lastAddedProduct) {
        var suggest = productList.find(function (item) {
          return item.id !== lastAddedProduct && item.quantity > 0;
        });
        if (suggest) {
          alert(
            suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!',
          );
          suggest.price = Math.round(suggest.price * 0.95);
          updateOptionList($productSelect);
        }
      }
    }, 60000);
  }, Math.random() * 20000);

  $addButton.addEventListener('click', function () {
    var selItem = $productSelect.value;
    var itemToAdd = productList.find(function (p) {
      return p.id === selItem;
    });
    if (itemToAdd && itemToAdd.quantity > 0) {
      var item = document.getElementById(itemToAdd.id);
      if (item) {
        var newQty =
          parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
        if (newQty <= itemToAdd.quantity) {
          item.querySelector('span').textContent =
            itemToAdd.name + ' - ' + itemToAdd.price + '원 x ' + newQty;
          itemToAdd.quantity--;
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
        $cartItemsDiv.appendChild(newItem);
        itemToAdd.quantity--;
      }
      calcCart($cartItemsDiv, $cartTotalDiv, $stockStatusDiv);
      lastAddedProduct = selItem;
    }
  });
  $cartItemsDiv.addEventListener('click', function (event) {
    var tgt = event.target;

    if (
      tgt.classList.contains('quantity-change') ||
      tgt.classList.contains('remove-item')
    ) {
      var prodId = tgt.dataset.productId;
      var itemElem = document.getElementById(prodId);
      var prod = productList.find(function (p) {
        return p.id === prodId;
      });
      if (tgt.classList.contains('quantity-change')) {
        var qtyChange = parseInt(tgt.dataset.change);
        var newQty =
          parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) +
          qtyChange;
        if (
          newQty > 0 &&
          newQty <=
            prod.quantity +
              parseInt(
                itemElem.querySelector('span').textContent.split('x ')[1],
              )
        ) {
          itemElem.querySelector('span').textContent =
            itemElem.querySelector('span').textContent.split('x ')[0] +
            'x ' +
            newQty;
          prod.quantity -= qtyChange;
        } else if (newQty <= 0) {
          itemElem.remove();
          prod.quantity -= qtyChange;
        } else {
          alert('재고가 부족합니다.');
        }
      } else if (tgt.classList.contains('remove-item')) {
        var remQty = parseInt(
          itemElem.querySelector('span').textContent.split('x ')[1],
        );
        prod.quantity += remQty;
        itemElem.remove();
      }
      calcCart($cartItemsDiv, $cartTotalDiv, $stockStatusDiv);
    }
  });
}
// 옵션리스트를 만드는 함수
function updateOptionList($productSelect) {
  $productSelect.innerHTML = '';
  productList.forEach((item) => {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = item.name + ' - ' + item.price + '원';
    if (item.quantity === 0) option.disabled = true;
    $productSelect.appendChild(option);
  });
}

function calcCart($cartItemsDiv, $cartTotalDiv, $stockStatusDiv) {
  let totalAmount = 0;
  let totalQuantity = 0;
  const cartItems = $cartItemsDiv.children;
  let totalAmountWithoutDiscount = 0;
  // for문. 장바구니 아이템들을 돌린다.
  // totalAmount, totalQuantity
  for (let i = 0; i < cartItems.length; i++) {
    const currentItem = productList.find((x) => x.id === cartItems[i].id);
    const quantity = parseInt(
      cartItems[i].querySelector('span').textContent.split('x ')[1],
    );
    totalQuantity += quantity;
    const itemAmount = currentItem.price * quantity;
    totalAmountWithoutDiscount += itemAmount;
    let discountRate = 0;
    if (quantity >= 10) {
      if (currentItem.id === 'p1') discountRate = 0.1;
      else if (currentItem.id === 'p2') discountRate = 0.15;
      else if (currentItem.id === 'p3') discountRate = 0.2;
      else if (currentItem.id === 'p4') discountRate = 0.05;
      else if (currentItem.id === 'p5') discountRate = 0.25;
    }
    totalAmount += itemAmount * (1 - discountRate);
  }
  let totalDiscountRate = 0;
  if (totalQuantity >= 30) {
    var bulkDisc = totalAmount * 0.25;
    var itemDisc = totalAmountWithoutDiscount - totalAmount;
    if (bulkDisc > itemDisc) {
      totalAmount = totalAmountWithoutDiscount * (1 - 0.25);
      totalDiscountRate = 0.25;
    } else {
      totalDiscountRate =
        (totalAmountWithoutDiscount - totalAmount) / totalAmountWithoutDiscount;
    }
  } else {
    totalDiscountRate =
      (totalAmountWithoutDiscount - totalAmount) / totalAmountWithoutDiscount;
  }

  if (new Date().getDay() === 2) {
    totalAmount *= 1 - 0.1;
    totalDiscountRate = Math.max(totalDiscountRate, 0.1);
  }
  $cartTotalDiv.textContent = '총액: ' + Math.round(totalAmount) + '원';
  if (totalDiscountRate > 0) {
    var span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent =
      '(' + (totalDiscountRate * 100).toFixed(1) + '% 할인 적용)';
    $cartTotalDiv.appendChild(span);
  }
  updateStockInfo($stockStatusDiv);
  renderBonusPts($cartTotalDiv, totalAmount);
}

// 포인트 문구 렌더
const renderBonusPts = ($cartTotalDiv, totalAmount) => {
  loyaltyPoints += Math.floor(totalAmount / 1000);
  var ptsTag = document.getElementById('loyalty-points');
  if (!ptsTag) {
    ptsTag = document.createElement('span');
    ptsTag.id = 'loyalty-points';
    ptsTag.className = 'text-blue-500 ml-2';
    $cartTotalDiv.appendChild(ptsTag);
  }
  ptsTag.textContent = '(포인트: ' + loyaltyPoints + ')';
};

// 상태 문구 업데이트
function updateStockInfo($stockStatusDiv) {
  var infoMsg = '';
  productList.forEach(function (item) {
    if (item.quantity < 5) {
      infoMsg +=
        item.name +
        ': ' +
        (item.quantity > 0
          ? '재고 부족 (' + item.quantity + '개 남음)'
          : '품절') +
        '\n';
    }
  });
  $stockStatusDiv.textContent = infoMsg;
}
main();
