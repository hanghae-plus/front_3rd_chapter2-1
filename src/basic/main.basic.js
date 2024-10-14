// 간결함 <<< 의미

// 1.변수 표기 통일 let | 변수명 camelCase 사용
/* 일단 역할 정의
prodList, : 상품목록 -> productList
sel, : 상품선택 드롭다운 -> productSelect
addBtn, : 상품 추가 -> addCartBtn //
cartDisp, : 장바구니 -> cartList
sum, : 총 금액을 표시할 영역 -> cartTotal
stockInfo; : 재고상태 -> stockStatus
lastSel, : 마지막으로 선택한 상품 ID 저장 -> lastProduct
bonusPts = 0, : 포인트 시스템을 위한 변수 -> pointSystem
totalAmt = 0, : 총 금액을 저장 -> totalPrice
itemCnt = 0; : 총 구매한 상품의 개수 -> totalItem
*/
// 동일한 변수 생략 cont -> containerDiv / wrap -> containerWrap / hTxt -> containerTitle

// 함수로 묶어주기..!!

var productList, productSelect, addBtn, cartList, cartTotal, stockStatus, lastProduct, pointSystem = 0, totalPrice = 0, totalItem = 0;
var root = document.getElementById('app');


let containerDiv = Object.assign(document.createElement('div'), {
    className: 'bg-gray-100 p-8',
})
root.appendChild(containerDiv);

let containerWrap = Object.assign(document.createElement('div'), {
    className: 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
});
containerDiv.appendChild(containerWrap);

let containerTitle = Object.assign(document.createElement('h1'), {
    className: 'text-2xl font-bold mb-4',
    textContent: '장바구니'
})
containerWrap.appendChild(containerTitle);


//장바구니
cartList = Object.assign(document.createElement('div'), {
    id: 'cart-items',
});
containerWrap.appendChild(cartList);

// 총 금액을 표시할 영역
cartTotal = Object.assign(document.createElement('div'), {
    id: 'cart-total',
    className: 'text-xl font-bold my-4'
});
containerWrap.appendChild(cartTotal);

// 상품선택 드롭다운
productSelect = Object.assign(document.createElement('select'), {
  id: 'product-select',
  className: 'border rounded p-2 mr-2'
});
containerWrap.appendChild(productSelect);

//상품 추가
addBtn = Object.assign(document.createElement('button'), {
  id: 'add-to-cart',
  className: 'bg-blue-500 text-white px-4 py-2 rounded',
  textContent: '추가'
});
containerWrap.appendChild(addBtn);

//재고상태
stockStatus = Object.assign(document.createElement('div'), {
    id: 'stock-status',
    className: 'text-sm text-gray-500 mt-2'
});
containerWrap.appendChild(stockStatus);

productList = [
    {id: 'p1', name: '상품1', price: 10000, stock: 50 },
    {id: 'p2', name: '상품2', price: 20000, stock: 30 },
    {id: 'p3', name: '상품3', price: 30000, stock: 20 },
    {id: 'p4', name: '상품4', price: 15000, stock: 0 },
    {id: 'p5', name: '상품5', price: 25000, stock: 10 }
];



function main() {
  updateSelOpts();
  calcCart();

  //20%할인 안내
  setTimeout(function () {
    setInterval(function () {
      var luckyItem = productList[Math.floor(Math.random() * productList.length)];
      if(Math.random() < 0.3 && luckyItem.stock > 0) {
        luckyItem.price = Math.round(luckyItem.price * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateSelOpts();
      }
    }, 30000);
  }, Math.random() * 10000);

  // 5%추가할인
  setTimeout(function () {
    setInterval(function () {
      if(lastProduct) {
        var suggest = productList.find(function (item) { return item.id !== lastProduct && item.stock > 0; });
        if(suggest) {
          alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.price = Math.round(suggest.price * 0.95);
          updateSelOpts();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
};



// 상품을 선택하고 장바구니에 추가
// 번개 이벤트 / 추천상품
function updateSelOpts() {
    productSelect.innerHTML = '';
    productList.forEach(function (item) {

    var option = Object.assign(document.createElement('option'), {
        value: item.id,
        textContent: item.name + ' - ' + item.price + '원'
    })
    productSelect.appendChild(option);

    // 재고가 0일경우 비활성화
    if(item.stock === 0) option.disabled = true;
    
  });
}

// 장바구니의 총 금액ㅇ과 상품 개수를 계산
function calcCart() {
  totalPrice = 0;
  totalItem = 0;

  var cartItems = cartList.children;
  var subTot = 0;

  for (var i=0; i < cartItems.length; i++) {
    (function () {
      var curItem;
      for (var j=0; j < productList.length; j++) {
        if(productList[j].id === cartItems[i].id) {
          curItem = productList[j];
          break;
        }
      }

      var q = parseInt(cartItems[i].querySelector('span').textContent.split('x ')[1]);
      var itemTot = curItem.price * q;
      var disc = 0;
      totalItem += q;
      subTot += itemTot;
      if(q >= 10) {
        if(curItem.id === 'p1') disc=0.1;
        else if(curItem.id === 'p2') disc=0.15;
        else if(curItem.id === 'p3') disc=0.2;
        else if(curItem.id === 'p4') disc=0.05;
        else if(curItem.id === 'p5') disc=0.25;
      }
      totalPrice += itemTot * (1 - disc);
    })();
  }

  let discRate = 0;
  if(totalItem >= 30) {
    var bulkDisc = totalPrice * 0.25;
    var itemDisc = subTot - totalPrice;
    if(bulkDisc > itemDisc) {
        totalPrice = subTot * (1 - 0.25);
      discRate = 0.25;
    } else {
      discRate = (subTot - totalPrice) / subTot;
    }
  } else {
    discRate = (subTot - totalPrice) / subTot;
  }

  // 화요일에는 10% 추가할인
  if(new Date().getDay() === 2) {
    totalPrice *= (1 - 0.1);
    discRate = Math.max(discRate, 0.1);
  }
  cartTotal.textContent='총액: ' + Math.round(totalPrice) + '원';

  if(discRate > 0) {
    var span = Object.assign(document.createElement('span'), {
        className: 'text-green-500 ml-2',
        textContent: '(' + (discRate * 100).toFixed(1) + '% 할인 적용)'
    })
    cartTotal.appendChild(span);
  }
  updateStockStatus();
  renderPointSystem();
}


// 총 금액을 기반으로 포인트를 계산하고, 이를 표시하는 함수입니다. 1000원당 1포인트가 적립
function renderPointSystem() {
  pointSystem += Math.floor(totalPrice / 1000);
  var ptsTag = document.getElementById('loyalty-points');
  if(!ptsTag) {
    ptsTag = document.createElement('span');
    ptsTag.id = 'loyalty-points';
    ptsTag.className = 'text-blue-500 ml-2';
    cartTotal.appendChild(ptsTag);
  }
  ptsTag.textContent='(포인트: ' + pointSystem + ')';
};

// 상품 재고 상태를 확인하고, 재고가 부족한 상품 또는 품절된 상품에 대한 정보를 업데이트
function updateStockStatus() {
  var infoMsg='';
  productList.forEach(function (item) {
    if(item.stock < 5) {
      infoMsg += item.name + ': ' + (item.stock > 0 ? '재고 부족 ('+item.stock+'개 남음)' : '품절') + '\n';
    }
  });
  stockStatus.textContent = infoMsg;
}

main();

// *중복로직 제거* - 상품객체를 찾는 함수
function findCartItem(productID) {
    return productList.find(product => product.id === productID);
}
// *중복로직 제거* - 카트에 상품 수량 확인 & 증감
function updateCartItem(cartItemElement, product, countChange) {
    var remQty = parseInt(cartItemElement.querySelector('span').textContent.split('x ')[1]);
    var newStock = remQty + countChange; // 기존 선택수량에 + -

    if(newStock > 0 && newStock <= product.stock + remQty) {
        cartItemElement.querySelector('span').textContent = cartItemElement.querySelector('span').textContent.split('x ')[0] + 'x ' + newStock;
        product.stock -= countChange;
      } else if(newStock <= 0) {
        cartItemElement.remove();
        product.stock -= countChange;
      } else {
        alert('재고가 부족합니다.');
      }
}

// 카트에 상품 추가
function createCartItem(item) {
    return (Object.assign(document.createElement('div'), {
        id: item.id,
        className: 'flex justify-between items-center mb-2',
        innerHTML: `<span>${item.name} - ${item.price}원 x 1</span>
                    <div><button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${item.id}" data-change="-1">-</button>
                    <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${item.id}" data-change="1">+</button>
                    <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${item.id}">삭제</button></div>`,
      })
    )
}

// 상품을 선택하여 장바구니에 추가하는 기능입니다. 선택한 상품이 이미 장바구니에 있으면 수량을 증가시키고, 새로운 상품이라면 장바구니에 새로 추가
// 카트 버튼 누를시
addBtn.addEventListener('click', function () {
    var selectedItem = findCartItem(productSelect.value);
    if (!selectedItem || selectedItem.stock <= 0) return;

    var item = document.getElementById(selectedItem.id);
    if(item) {
        updateCartItem(item, selectedItem, 1);
        // 선택한 상품이 장바구니에 없는 경우
    } else {
        cartList.appendChild(createCartItem(selectedItem));
        selectedItem.stock--; // 재고 1 감소
    }
    calcCart();
    lastProduct = selectedItem;
});

//장바구니 내의 수량 변경 또는 삭제 버튼 클릭 시, 상품 수량을 변경하거나 상품을 제거하는 로직
cartList.addEventListener('click', function (event) {
  var target = event.target;

  // 클릭요소
  if(target.classList.contains('quantity-change') || target.classList.contains('remove-item')) {
    var productId = target.dataset.productId;
    var product = findCartItem(productId);
    var cartItemElement = document.getElementById(productId);

    if(target.classList.contains('quantity-change')) {
      var countChange = parseInt(target.dataset.change); // +1인지 -1인지 값 받아오기
      updateCartItem(cartItemElement, product, countChange)

    } else if(target.classList.contains('remove-item')) {
      product.stock += parseInt(cartItemElement.querySelector('span').textContent.split('x ')[1]);
      cartItemElement.remove();
    }

    calcCart();
  }
});