// prodList -> productList
const productList = [
  //val->price, q->stock
  { id: 'p1', name: '상품1', price: 10000, stock: 50 },
  { id: 'p2', name: '상품2', price: 20000, stock: 30 },
  { id: 'p3', name: '상품3', price: 30000, stock: 20 },
  { id: 'p4', name: '상품4', price: 15000, stock: 0 },
  { id: 'p5', name: '상품5', price: 25000, stock: 10 },
];
// 전역 상태관리 & 변수명 변경. reactr가 생각났다.
const state = {
  lastSelected: null,
  cart: [],
  bonusPoints: 0,
  totalAmount: 0,
  itemCnt: 0,
};

// El생성
const createElementWithHandler = (tagName, { events = {}, ...options } = {}, parent) => {
  const $element = document.createElement(tagName);

  // 속성 설정
  Object.entries(options).forEach(([key, value]) => {
    if (value) $element[key] = value;
  });

  // 이벤트 리스너 등록
  Object.entries(events).forEach(([event, handler]) => {
    $element.addEventListener(event, handler);
  });

  // 부모에 추가
  parent.appendChild($element);
  return $element;
};
`<div id="cart-items">
  <div id="p1" class="flex justify-between items-center mb-2">
    <span>상품1 - 10000원 x 1</span>
    <div>
      <button 
        class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
        data-product-id="p1" 
        data-change="-1">
        -
      </button>
      <button 
        class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
        data-product-id="p1" 
        data-change="1">
        +
      </button>
      <button 
        class="remove-item bg-red-500 text-white px-2 py-1 rounded" 
        data-product-id="p1">
        삭제
      </button>
    </div>
  </div>
</div>`;

const addToCart = () => {
  const $cart = document.getElementById('cart-items');
  createElementWithHandler(
    'div',
    {
      id: selectedItemInfo.id,
      className: 'flex justify-between items-center mb-2',
      innerHTML:
        '<span>' +
        selectedItemInfo.name +
        ' - ' +
        selectedItemInfo.price +
        '원 x 1</span><div>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        selectedItemInfo.id +
        '" data-change="-1">-</button>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        selectedItemInfo.id +
        '" data-change="1">+</button>' +
        '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
        selectedItemInfo.id +
        '">삭제</button></div>',
      events: {
        click: (e) => {},
      },
    },
    $cart
  );
};

const updateCartItem = (product) => {
  // let product = $event.target;

  // if (product.classList.contains('quantity-change') || product.classList.contains('remove-item')) {
  let prodId = product.dataset.productId;
  let itemElem = document.getElementById(prodId);
  let prod = productList.find(function (p) {
    return p.id === prodId;
  });
  if (product.classList.contains('quantity-change')) {
    let qtyChange = parseInt(product.dataset.change);
    let newQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) + qtyChange;
    if (
      newQty > 0 &&
      newQty <= prod.stock + parseInt(itemElem.querySelector('span').textContent.split('x ')[1])
    ) {
      itemElem.querySelector('span').textContent =
        itemElem.querySelector('span').textContent.split('x ')[0] + 'x ' + newQty;
      prod.stock -= qtyChange;
    } else if (newQty <= 0) {
      itemElem.remove();
      prod.stock -= qtyChange;
    } else {
      alert('재고가 부족합니다.');
    }
  } else if (product.classList.contains('remove-item')) {
    let remQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]);
    prod.stock += remQty;
    itemElem.remove();
  }
  calcCart();
  // }
};
// const cart = createElementWithHandler(
//   'div',
//   {
//     id: 'cart-items',
//     events: {
//       click: ($event) => {
//         let product = $event.target;

//         if (product.classList.contains('quantity-change') || product.classList.contains('remove-item')) {
//           let prodId = product.dataset.productId;
//           let itemElem = document.getElementById(prodId);
//           let prod = productList.find(function (p) {
//             return p.id === prodId;
//           });
//           if (product.classList.contains('quantity-change')) {
//             let qtyChange = parseInt(product.dataset.change);
//             let newQty =
//               parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) + qtyChange;
//             if (
//               newQty > 0 &&
//               newQty <=
//                 prod.stock + parseInt(itemElem.querySelector('span').textContent.split('x ')[1])
//             ) {
//               itemElem.querySelector('span').textContent =
//                 itemElem.querySelector('span').textContent.split('x ')[0] + 'x ' + newQty;
//               prod.stock -= qtyChange;
//             } else if (newQty <= 0) {
//               itemElem.remove();
//               prod.stock -= qtyChange;
//             } else {
//               alert('재고가 부족합니다.');
//             }
//           } else if (product.classList.contains('remove-item')) {
//             let remQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]);
//             prod.stock += remQty;
//             itemElem.remove();
//           }
//           calcCart();
//         }
//       },
//     },
//   },
//   wrap
// );

const addToCartBtn = createElementWithHandler(
  'button',
  {
    id: 'add-to-cart',
    className: 'bg-blue-500 text-white px-4 py-2 rounded',
    textContent: '추가',
    events: {
      click: () => {
        // sel->selected
        let selectedItem = productSelect.value;
        //itemToAdd->selectedItemInfo
        let selectedItemInfo = productList.find((p) => p.id === selectedItem);
        if (selectedItemInfo && selectedItemInfo.stock > 0) {
          let item = document.getElementById(selectedItemInfo.id);
          if (item) {
            let newQty = parseInt(item.querySelector('span').textContent.split('x ')[1]);
            if (selectedItemInfo.stock > 0) {
              // newQty를 여기서 +1
              item.querySelector('span').textContent =
                selectedItemInfo.name + ' - ' + selectedItemInfo.price + '원 x ' + (newQty + 1);
              selectedItemInfo.stock--;
            } else {
              alert('재고가 부족합니다.');
            }
          } else {
            createElementWithHandler(
              'div',
              {
                id: selectedItemInfo.id,
                className: 'flex justify-between items-center mb-2',
                innerHTML:
                  '<span>' +
                  selectedItemInfo.name +
                  ' - ' +
                  selectedItemInfo.price +
                  '원 x 1</span><div>' +
                  '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
                  selectedItemInfo.id +
                  '" data-change="-1">-</button>' +
                  '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
                  selectedItemInfo.id +
                  '" data-change="1">+</button>' +
                  '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
                  selectedItemInfo.id +
                  '">삭제</button></div>',
              },
              cart
            );
            selectedItemInfo.stock--;
          }
          calcCart();
          state.lastSelected = selectedItem;
        }
      },
    },
  },
  wrap
);

// element 구성
const mounted = () => {
  //상단에 Root정의
  const $root = document.getElementById('app');
  $root.innerHTML = `
  <div class="bg-gray-100 p-8">
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      <h1 class="text-2xl font-bold mb-4">장바구니</h1>
      <div id="cart-items"></div>
      <div id="cart-total" class="text-xl font-bold my-4"></div>
      <select id="product-select" class="border rounded p-2 mr-2"></select>
      <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
      <div id="stock-status" class="text-sm text-gray-500 mt-2"></div>
    </div>
  </div>`;
  document.addEventListener('DOMContentLoaded', () => {});
};

const renderbonusPoints = () => {
  state.bonusPoints += Math.floor(state.totalAmount / 1000);
  let ptsTag = document.getElementById('loyalty-points');
  if (!ptsTag) {
    createElementWithHandler(
      'span',
      {
        id: 'loyalty-points',
        className: 'text-blue-500 ml-2',
        textContent: '(포인트: ' + state.bonusPoints + ')',
      },
      cartTotal
    );
  }
};
const updateSelOpts = () => {
  productSelect.innerHTML = '';
  productList.forEach(function (item) {
    let opt = document.createElement('option');
    opt.value = item.id;

    opt.textContent = item.name + ' - ' + item.price + '원';
    if (item.stock === 0) opt.disabled = true;
    productSelect.appendChild(opt);
  });
};
const calcCart = () => {
  state.totalAmount = 0;
  state.itemCnt = 0;
  let cartItems = cart.children;
  let subTot = 0;
  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      let curItem;
      for (let j = 0; j < productList.length; j++) {
        if (productList[j].id === cartItems[i].id) {
          curItem = productList[j];
          break;
        }
      }

      let q = parseInt(cartItems[i].querySelector('span').textContent.split('x ')[1]);
      let itemTot = curItem.price * q;
      let disc = 0;
      state.itemCnt += q;
      subTot += itemTot;
      if (q >= 10) {
        if (curItem.id === 'p1') disc = 0.1;
        else if (curItem.id === 'p2') disc = 0.15;
        else if (curItem.id === 'p3') disc = 0.2;
        else if (curItem.id === 'p4') disc = 0.05;
        else if (curItem.id === 'p5') disc = 0.25;
      }
      state.totalAmount += itemTot * (1 - disc);
    })();
  }
  let discRate = 0;
  if (state.itemCnt >= 30) {
    let bulkDisc = state.totalAmount * 0.25;
    let itemDisc = subTot - state.totalAmount;
    if (bulkDisc > itemDisc) {
      state.totalAmount = subTot * (1 - 0.25);
      discRate = 0.25;
    } else {
      discRate = (subTot - state.totalAmount) / subTot;
    }
  } else {
    discRate = (subTot - state.totalAmount) / subTot;
  }

  if (new Date().getDay() === 2) {
    state.totalAmount *= 1 - 0.1;
    discRate = Math.max(discRate, 0.1);
  }
  cartTotal.textContent = '총액: ' + Math.round(state.totalAmount) + '원';
  if (discRate > 0) {
    createElementWithHandler(
      'span',
      {
        className: 'text-green-500 ml-2',
        textContent: '(' + (discRate * 100).toFixed(1) + '% 할인 적용)',
      },
      cartTotal
    );
  }
  updateStockInfo();
  renderbonusPoints();
};

const updateStockInfo = () => {
  let infoMsg = '';
  productList.forEach((item) => {
    if (item.stock < 5) {
      infoMsg +=
        item.name +
        ': ' +
        (item.stock > 0 ? '재고 부족 (' + item.stock + '개 남음)' : '품절') +
        '\n';
    }
  });
  stockStatus.textContent = infoMsg;
};

const callTimeSale = () => {
  setTimeout(function () {
    setInterval(function () {
      let luckyItem = productList[Math.floor(Math.random() * productList.length)];
      if (Math.random() < 0.3 && luckyItem.stock > 0) {
        luckyItem.val = Math.round(luckyItem.price * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateSelOpts();
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(function () {
    setInterval(function () {
      if ((state.lastSelected = null)) {
        let suggest = productList.find((item) => item.id !== state.lastSelected && item.stock > 0);
        if (suggest) {
          alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.val = Math.round(suggest.price * 0.95);
          updateSelOpts();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
};

function main() {
  mounted();
  updateSelOpts();
  calcCart();
  callTimeSale();
}

main();
