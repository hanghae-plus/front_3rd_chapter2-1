// * 설명
// ! 주의
// ? 궁금
// TODO 할일
// // 취소
// var -> let, const로 변경함? 호이스팅 예방
// 타입을 일일이 선언해 준 이유? 가독성 측면 때문에
// 함수 표현식 처리? 호이스팅 예방
// 화살표 함수로 처리? 비동기처리할 때 화살표 함수로 사용하고 있는 것이 기본룰처럼 여겨져서
// if 조건문 3개 이상이면 switch문으로 전환

// ### 2) **체크리스트**

// - 코드가 Prettier를 통해 일관된 포맷팅이 적용되어 있는가? O
// - 적절한 줄바꿈과 주석을 사용하여 코드의 논리적 단위를 명확히 구분했는가? O <- 함수별, 버튼별 단위 분리. 추가로 더 나눌 부분 있는지 확인할 예정
// - 변수명과 함수명이 그 역할을 명확히 나타내며, 일관된 네이밍 규칙을 따르는가?
// - 매직 넘버와 문자열을 의미 있는 상수로 추출했는가?
// - 중복 코드를 제거하고 재사용 가능한 형태로 리팩토링했는가?
// - 함수가 단일 책임 원칙을 따르며, 한 가지 작업만 수행하는가?
// - 조건문과 반복문이 간결하고 명확한가? 복잡한 조건을 함수로 추출했는가?
// - 코드의 배치가 의존성과 실행 흐름에 따라 논리적으로 구성되어 있는가?
// - 연관된 코드를 의미 있는 함수나 모듈로 그룹화했는가?
// - ES6+ 문법을 활용하여 코드를 더 간결하고 명확하게 작성했는가?
// - 전역 상태와 부수 효과(side effects)를 최소화했는가?
// - 에러 처리와 예외 상황을 명확히 고려하고 처리했는가?
// - 코드 자체가 자기 문서화되어 있어, 주석 없이도 의도를 파악할 수 있는가?
// - 비즈니스 로직과 UI 로직이 적절히 분리되어 있는가?
// - 객체지향 또는 함수형 프로그래밍 원칙을 적절히 적용했는가?
// - 코드의 각 부분이 테스트 가능하도록 구조화되어 있는가?
// - 성능 개선을 위해 불필요한 연산이나 렌더링을 제거했는가?
// - 새로운 기능 추가나 변경이 기존 코드에 미치는 영향을 최소화했는가?
// - 리팩토링 시 기존 기능을 그대로 유지하면서 점진적으로 개선했는가?
// - 코드 리뷰를 통해 다른 개발자들의 피드백을 반영하고 개선했는가?

// * 전역변수

let prodList = '';
let sel = '';
let addBtn = '';
let cartDisp = '';
let sum = '';
let stockInfo = '';
let lastSel = '';
let bonusPts = 0;
let totalAmt = 0;
let itemCnt = 0;

const createElem = (tag, attributes = {}, text = '') => {
  const element = document.createElement(tag);
  Object.keys(attributes).forEach((key) => {
    if (key === 'className') {
      element.className = attributes[key]; // className을 직접 할당
    } else {
      element.setAttribute(key, attributes[key]);
    }
  });
  if (text) element.textContent = text;
  return element;
};

const elements = {
  root: document.getElementById('app'),
  cont: createElem('div', { className: 'bg-gray-100 p-8' }),
  wrap: createElem('div', {
    className:
      'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
  }),
  hTxt: createElem('h1', { className: 'text-2xl font-bold mb-4' }, '장바구니'),
  cartDisp: createElem('div', { id: 'cart-items' }),
  sum: createElem('div', {
    id: 'cart-total',
    className: 'text-xl font-bold my-4',
  }),
  sel: createElem('select', {
    id: 'product-select',
    className: 'border rounded p-2 mr-2',
  }),
  addBtn: createElem(
    'button',
    {
      id: 'add-to-cart',
      className: 'bg-blue-500 text-white px-4 py-2 rounded',
    },
    '추가'
  ),
  stockInfo: createElem('div', {
    id: 'stock-status',
    className: 'text-sm text-gray-500 mt-2',
  }),
};

// * 메인함수

const main = function () {
  try {
    prodList = [
      {
        id: 'p1',
        name: '상품1',
        price: 10000,
        stock: 50,
      },
      {
        id: 'p2',
        name: '상품2',
        price: 20000,
        stock: 30,
      },
      {
        id: 'p3',
        name: '상품3',
        price: 30000,
        stock: 20,
      },
      {
        id: 'p4',
        name: '상품4',
        price: 15000,
        stock: 0,
      },
      {
        id: 'p5',
        name: '상품5',
        price: 25000,
        stock: 10,
      },
    ];

    updatePrice();
    const initializeElements = () => {
      elements.root.appendChild(elements.cont);
      elements.wrap.appendChild(elements.hTxt);
      elements.wrap.appendChild(elements.cartDisp);
      elements.wrap.appendChild(elements.sum);
      elements.wrap.appendChild(elements.sel);
      elements.wrap.appendChild(elements.addBtn);
      elements.wrap.appendChild(elements.stockInfo);
      elements.cont.appendChild(elements.wrap);
    };
    initializeElements();
    calcCart();
    setTimeout(() => {
      setInterval(() => {
        var luckyItem = prodList[Math.floor(Math.random() * prodList.length)];
        if (Math.random() < 0.3 && luckyItem.stock > 0) {
          luckyItem.price = Math.round(luckyItem.price * 0.8);
          alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
          updatePrice();
        }
      }, 30000);
    }, Math.random() * 10000);
    setTimeout(() => {
      setInterval(() => {
        if (lastSel) {
          var suggest = prodList.find((item) => {
            return item.id !== lastSel && item.stock > 0;
          });
          if (suggest) {
            alert(
              suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!'
            );
            suggest.price = Math.round(suggest.price * 0.95);
            updatePrice();
          }
        }
      }, 60000);
    }, Math.random() * 20000);
  } catch (e) {}
};

// * 가격정보 업데이트

const updatePrice = () => {
  elements.sel.innerHTML = '';
  prodList.forEach((item) => {
    var opt = document.createElement('option');
    opt.value = item.id;
    opt.textContent = item.name + ' - ' + item.price + '원';
    if (item.stock === 0) opt.disabled = true;
    elements.sel.appendChild(opt);
  });
};

// * 카트계산

const calcCart = () => {
  totalAmt = 0;
  itemCnt = 0;
  var cartItems = elements.cartDisp.children;
  var subTot = 0;
  for (var i = 0; i < cartItems.length; i++) {
    (() => {
      var curItem;
      for (var j = 0; j < prodList.length; j++) {
        if (prodList[j].id === cartItems[i].id) {
          curItem = prodList[j];
          break;
        }
      }
      var stock = parseInt(
        cartItems[i].querySelector('span').textContent.split('x ')[1]
      );
      var itemTot = curItem.price * stock;
      var disc = 0;
      itemCnt += stock;
      subTot += itemTot;

      if (stock >= 10) {
        switch (curItem.id) {
          case 'p1':
            disc = 0.1;
            break;
          case 'p2':
            disc = 0.15;
            break;
          case 'p3':
            disc = 0.2;
            break;
          case 'p4':
            disc = 0.05;
            break;
          case 'p5':
            disc = 0.25;
            break;
        }
      }
      totalAmt += itemTot * (1 - disc);
    })();
  }
  let discRate = 0;
  if (itemCnt >= 30) {
    var bulkDisc = totalAmt * 0.25;
    var itemDisc = subTot - totalAmt;
    if (bulkDisc > itemDisc) {
      totalAmt = subTot * (1 - 0.25);
      discRate = 0.25;
    } else {
      discRate = (subTot - totalAmt) / subTot;
    }
  } else {
    discRate = (subTot - totalAmt) / subTot;
  }

  if (new Date().getDay() === 2) {
    totalAmt *= 1 - 0.1;
    discRate = Math.max(discRate, 0.1);
  }
  elements.sum.textContent = '총액: ' + Math.round(totalAmt) + '원';
  if (discRate > 0) {
    var span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discRate * 100).toFixed(1) + '% 할인 적용)';
    elements.sum.appendChild(span);
  }
  updateStock();
  renderBonusPts();
};

// * 보너스포인트 계산

const renderBonusPts = () => {
  bonusPts += Math.floor(totalAmt / 1000);
  var ptsTag = document.getElementById('loyalty-points');
  if (!ptsTag) {
    ptsTag = document.createElement('span');
    ptsTag.id = 'loyalty-points';
    ptsTag.className = 'text-blue-500 ml-2';
    elements.sum.appendChild(ptsTag);
  }
  ptsTag.textContent = '(포인트: ' + bonusPts + ')';
};

// * 잔고수량계산

const updateStock = function () {
  var infoMsg = '';
  prodList.forEach((item) => {
    if (item.stock < 5) {
      infoMsg +=
        item.name +
        ': ' +
        (item.stock > 0 ? '재고 부족 (' + item.stock + '개 남음)' : '품절') +
        '\n';
    }
  });
  elements.stockInfo.textContent = infoMsg;
};

// * 메인함수

main();

// * 추가버튼 클릭시 발생하는 이벤트

elements.addBtn.addEventListener('click', () => {
  var selItem = elements.sel.value;
  var itemToAdd = prodList.find((p) => {
    return p.id === selItem;
  });
  if (itemToAdd && itemToAdd.stock > 0) {
    var item = document.getElementById(itemToAdd.id);
    if (item) {
      var newQty =
        parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
      if (newQty <= itemToAdd.stock) {
        item.querySelector('span').textContent =
          itemToAdd.name + ' - ' + itemToAdd.price + '원 x ' + newQty;
        itemToAdd.stock--;
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
      elements.cartDisp.appendChild(newItem);
      itemToAdd.stock--;
    }
    calcCart();
    lastSel = selItem;
  }
});

// * - + 삭제 버튼 클릭시 발생하는 이벤트

elements.cartDisp.addEventListener('click', (event) => {
  var tgt = event.target;

  if (
    tgt.classList.contains('quantity-change') ||
    tgt.classList.contains('remove-item')
  ) {
    var prodId = tgt.dataset.productId;
    var itemElem = document.getElementById(prodId);
    var prod = prodList.find((p) => {
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
          prod.stock +
            parseInt(itemElem.querySelector('span').textContent.split('x ')[1])
      ) {
        itemElem.querySelector('span').textContent =
          itemElem.querySelector('span').textContent.split('x ')[0] +
          'x ' +
          newQty;
        prod.stock -= qtyChange;
      } else if (newQty <= 0) {
        itemElem.remove();
        prod.stock -= qtyChange;
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (tgt.classList.contains('remove-item')) {
      var remQty = parseInt(
        itemElem.querySelector('span').textContent.split('x ')[1]
      );
      prod.stock += remQty;
      itemElem.remove();
    }
    calcCart();
  }
});
