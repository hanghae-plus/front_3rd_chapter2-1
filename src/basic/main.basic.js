const productList = [
  { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
  { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
  { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
  { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
  { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
];

let lastAddedProduct;
let loyaltyPoints = 0;
let totalAmount = 0;
let totalQuantity = 0;
function main() {
  const $root = document.getElementById('app');

  const $container = document.createElement('div');
  $container.className = 'bg-gray-100 p-8';

  const $wrapper = document.createElement('div');
  $wrapper.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';

  const $title = document.createElement('h1');
  $title.className = 'text-2xl font-bold mb-4';
  $title.textContent = '장바구니';

  const $cartItemsDiv = document.createElement('div');
  $cartItemsDiv.id = 'cart-items';

  const $cartTotalDiv = document.createElement('div');
  $cartTotalDiv.id = 'cart-total';
  $cartTotalDiv.className = 'text-xl font-bold my-4';

  const $productSelect = document.createElement('select');
  $productSelect.id = 'product-select';
  $productSelect.className = 'border rounded p-2 mr-2';

  const $addButton = document.createElement('button');
  $addButton.id = 'add-to-cart';
  $addButton.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  $addButton.textContent = '추가';

  const $stockStatusDiv = document.createElement('div');
  $stockStatusDiv.id = 'stock-status';
  $stockStatusDiv.className = 'text-sm text-gray-500 mt-2';

  updateOptionList($productSelect);

  $wrapper.appendChild($title);
  $wrapper.appendChild($cartItemsDiv);
  $wrapper.appendChild($cartTotalDiv);
  $wrapper.appendChild($productSelect);
  $wrapper.appendChild($addButton);
  $wrapper.appendChild($stockStatusDiv);
  $container.appendChild($wrapper);
  $root.appendChild($container);

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
function updateOptionList($productSelect) {
  $productSelect.innerHTML = '';
  productList.forEach(function (item) {
    const option = document.createElement('option');
    option.value = item.id;

    option.textContent = item.name + ' - ' + item.price + '원';
    if (item.quantity === 0) option.disabled = true;
    $productSelect.appendChild(option);
  });
}
function calcCart($cartItemsDiv, $cartTotalDiv, $stockStatusDiv) {
  totalAmount = 0;
  totalQuantity = 0;
  var cartItems = $cartItemsDiv.children;
  var subTot = 0;
  for (var i = 0; i < cartItems.length; i++) {
    (function () {
      var curItem;
      for (var j = 0; j < productList.length; j++) {
        if (productList[j].id === cartItems[i].id) {
          curItem = productList[j];
          break;
        }
      }

      var q = parseInt(
        cartItems[i].querySelector('span').textContent.split('x ')[1],
      );
      var itemTot = curItem.price * q;
      var disc = 0;
      totalQuantity += q;
      subTot += itemTot;
      if (q >= 10) {
        if (curItem.id === 'p1') disc = 0.1;
        else if (curItem.id === 'p2') disc = 0.15;
        else if (curItem.id === 'p3') disc = 0.2;
        else if (curItem.id === 'p4') disc = 0.05;
        else if (curItem.id === 'p5') disc = 0.25;
      }
      totalAmount += itemTot * (1 - disc);
    })();
  }
  let discRate = 0;
  if (totalQuantity >= 30) {
    var bulkDisc = totalAmount * 0.25;
    var itemDisc = subTot - totalAmount;
    if (bulkDisc > itemDisc) {
      totalAmount = subTot * (1 - 0.25);
      discRate = 0.25;
    } else {
      discRate = (subTot - totalAmount) / subTot;
    }
  } else {
    discRate = (subTot - totalAmount) / subTot;
  }

  if (new Date().getDay() === 2) {
    totalAmount *= 1 - 0.1;
    discRate = Math.max(discRate, 0.1);
  }
  $cartTotalDiv.textContent = '총액: ' + Math.round(totalAmount) + '원';
  if (discRate > 0) {
    var span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discRate * 100).toFixed(1) + '% 할인 적용)';
    $cartTotalDiv.appendChild(span);
  }
  updateStockInfo($stockStatusDiv);
  renderBonusPts($cartTotalDiv);
}
const renderBonusPts = ($cartTotalDiv) => {
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
