(function () {
  let cartItemsBox, cartTotalAmount, selectedProduct, cartAddBtn, stockInfo;
  let lastSelectOption;

  const productList = [
    { id: 'p1', name: '상품1', price: 10000, count: 50 },
    { id: 'p2', name: '상품2', price: 20000, count: 30 },
    { id: 'p3', name: '상품3', price: 30000, count: 20 },
    { id: 'p4', name: '상품4', price: 15000, count: 0 },
    { id: 'p5', name: '상품5', price: 25000, count: 10 },
  ];

  // 요소 생성
  const createElement = (tag, attr) => {
    const element = document.createElement(tag);

    if (attr) {
      Object.entries(attr).forEach(([key, value]) => {
        if (key === 'textContent') {
          element.textContent = value;
        } else {
          element.setAttribute(key, value);
        }
      });
    }

    return element;
  };
  // 초기 HTML 구조 렌더링 함수
  const renderElements = () => {
    const root = document.getElementById('app');
    const container = createElement('div', { class: 'bg-gray-100 p-8' });
    const wrap = createElement('div', {
      class: 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
    });
    const cartTitle = createElement('h1', { class: 'text-2xl font-bold mb-4', textContent: '장바구니' });

    cartItemsBox = createElement('div', { id: 'cart-items' });
    cartTotalAmount = createElement('div', { class: 'text-xl font-bold my-4', id: 'cart-total' });
    selectedProduct = createElement('select', { class: 'border rounded p-2 mr-2', id: 'product-select' });
    cartAddBtn = createElement('button', {
      class: 'bg-blue-500 text-white px-4 py-2 rounded',
      id: 'add-to-cart',
      textContent: '추가',
    });
    stockInfo = createElement('div', { class: 'text-sm text-gray-500 mt-2', id: 'stock-status' });

    updateSelectOptions();

    wrap.append(cartTitle, cartItemsBox, cartTotalAmount, selectedProduct, cartAddBtn, stockInfo);
    container.appendChild(wrap);
    root.appendChild(container);
  };



  // 제품 선택 리스트 업데이트 함수
  const updateSelectOptions = () => {
    selectedProduct.innerHTML = '';
    productList.forEach((product) => {
      const { id, name, price, count } = product;
      let opt = createElement('option', { value: id, textContent: `${name} - ${price}원` });
      // 각 제품을 옵션으로 추가하고, 재고가 없는 경우 선택할 수 없도록 비활성화
      if (count === 0) opt.disabled = true;
      selectedProduct.appendChild(opt);
    });
  };
  // 포인트 정보 업데이트 함수
  const updatePointInfo = () => {
    let point = 0;
    let pointInfo = document.getElementById('loyalty-points');
    if (!pointInfo) {
      pointInfo = createElement('span', { class: 'text-blue-500 ml-2', id: 'loyalty-points' });
      cartTotalAmount.appendChild(pointInfo);
    }
    pointInfo.textContent = `(포인트: ${point})`;
  };
  // 품절 정보 업데이트 함수
  const updateStockInfo = () => {
    let infoMsg = '';
    productList.forEach((product) => {
      const { name, count } = product;
      // 각 제품의 재고 상태를 확인하고, 5개 미만이면 재고 부족 메시지를 표시하고 그렇지 않으면 '품절' 표시
      if (product.count < 5) infoMsg += `${name}: ${count > 0 ? `재고 부족(${count}개 남음)` : '품절'}\n`;
    });
    stockInfo.textContent = infoMsg;
  };



  // 장바구니 계산 및 정보 업데이트
  const calcCart = () => {
    updatePointInfo(); // 포인트 정보 업데이트
    updateStockInfo(); // 재고 정보 업데이트
  };



  // 할인 대상 제품에 할인율을 적용하고 메시지를 출력한 후, 선택 옵션을 업데이트
  const applyDiscount = (element, discount, msg) => {
    element.price = Math.round(element.price * discount);
    alert(msg);
    updateSelectOptions();
  };
  // 일정한 간격으로 랜덤한 시간 지연 후에 콜백을 실행하는 함수
  const applyRandomInterval = (callback, interval, delay) => {
    const randomDelay = Math.random() * delay;
    setTimeout(() => {
      setInterval(callback, interval);
    }, randomDelay);
  };
  // 번개 세일 알림 함수
  const alertLuckySale = () => {
    const luckyItem = productList[Math.floor(Math.random() * productList.length)];
    if (Math.random() < 0.3 && luckyItem.count > 0) {
      applyDiscount(luckyItem, 0.8, `번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
    }
  };
  // 추천 상품 알림 함수
  const alertSuggestItem = () => {
    if (lastSelectOption) {
      const suggestItem = productList.find((item) => item.id !== lastSelectOption && item.count > 0);
      if (suggestItem) {
        applyDiscount(suggestItem, 0.95, `${suggestItem.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
      }
    }
  };



  function main() {
    renderElements(); // 기본 요소를 렌더링
    calcCart(); // 장바구니 계산 및 정보 업데이트

    // 30초마다 번개세일 알림을 주고, 0~10초 사이에 지연
    applyRandomInterval(alertLuckySale, 30000, 10000);
    // 60초마다 추천 상품 알림을 주고, 0~20초 사이에 지연
    applyRandomInterval(alertSuggestItem, 60000, 20000);
  }



  const onClickCartItems = () => {
  };



  // 장바구니 추가 버튼 클릭 시, 실행되는 함수
  const onClickCartAddBtn = () => {  
    const addItem = getAddItem();
    
    if (addItem?.count > 0) {
        const addItemElement = document.getElementById(addItem.id);
        
        if (addItemElement) {
            const currentCount = getCurrentCount(addItemElement);
            
            if (currentCount < addItem.count) {
                updateAddItemText(addItemElement, addItem, currentCount + 1);
                addItem.count--;
            } else {
                alert('재고가 부족합니다.');
            }
        } else {
            createAddItemElement(addItem);
        }
        
        calcCart(); // 장바구니 계산
        lastSelectOption = selectedProduct; // 마지막 선택한 옵션 저장
    }
  };
  // 장바구니에 추가한 상품 정보 구하는 함수
  const getAddItem = () => {
    return productList.find(product => product.id === selectedProduct.value);
  }
  // 장바구니에서 현재 수량을 가져오는 함수
  const getCurrentCount = (itemElement) => {
    return parseInt(itemElement.querySelector('span').textContent.split('x ')[1], 10);
  }
  // 장바구니에 추가한 상품의 텍스트를 업데이트하는 함수
  const updateAddItemText = (itemElement, addItem, newCount) => {
    const { name, price } = addItem;
    itemElement.querySelector('span').textContent = `${name} - ${price}원 x ${newCount}`;
  }
  // 장바구니에 추가한 상품 요소 생성 함수
  const createAddItemElement = (addItem) => {
    const { id, name, price } = addItem;
    const newItemElement = createElement('div', { class: 'flex justify-between items-center mb-2', id });
    
    newItemElement.innerHTML = `
        <span>${name} - ${price}원 x 1</span>
        <div>
            <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${id}" data-change="-1">-</button>
            <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${id}" data-change="1">+</button>
            <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${id}">삭제</button>
        </div>
    `;
    
    cartItemsBox.appendChild(newItemElement);
    addItem.count--; // 재고 감소
  };




  // DOM이 완전히 로드된 후 main 함수 실행
  document.addEventListener('DOMContentLoaded', () => {
    main();
    // 이벤트 등록
    cartAddBtn.addEventListener('click', onClickCartAddBtn);
  });
})();
