let prodList, containerWrap, container, title, cartList, cartcartTotalAmount, cartItemSelect, addBtn, soldoutList;
let lastSelectedProduct,
  bonusPoints = 0,
  cartTotalAmount = 0,
  itemCnt = 0;

// 돔 생성 함수
const createElementWithAttributes = (tag, attributes) => {
  const element = document.createElement(tag);
  for (let key in attributes) {
    element[key] = attributes[key];
  }
  return element;
};

// 세일 이벤트 호출 함수
const alertSaleItem = (callback, initialDelay, setTime) => {
  setTimeout(function () {
    callback();
    setInterval(callback, setTime);
  }, initialDelay);
};

// 번개 세일 알림 함수
const luckySaleItem = () => {
  const selectedProduct = prodList[Math.floor(Math.random() * prodList.length)];
  const isSaleItem = Math.random() < 0.3;

  if (isSaleItem && selectedProduct.count > 0) {
    selectedProduct.price = Math.round(selectedProduct.price * 0.8);
    alert(`번개세일! ${selectedProduct.name}이(가) 20% 할인 중입니다!`);
    updateProdList();
  }
};

// 추천 세일 알림 함수
const recommendSaleItem = () => {
  if (lastSelectedProduct) {
    const recommendItem = prodList.find((item) => item.id !== lastSelectedProduct && item.count > 0);

    if (recommendItem) {
      recommendItem.price = Math.round(recommendItem.price * 0.95);
      alert(`${recommendItem.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
      updateProdList();
    }
  }
};

const main = () => {
  prodList = [
    { id: 'p1', name: '상품1', price: 10000, count: 50 },
    { id: 'p2', name: '상품2', price: 20000, count: 30 },
    { id: 'p3', name: '상품3', price: 30000, count: 20 },
    { id: 'p4', name: '상품4', price: 15000, count: 0 },
    { id: 'p5', name: '상품5', price: 25000, count: 10 },
  ];

  const root = document.getElementById('app');

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

  cartcartTotalAmount = createElementWithAttributes('div', {
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

  container.append(title, cartList, cartcartTotalAmount, cartItemSelect, addBtn, soldoutList);
  containerWrap.appendChild(container);
  root.appendChild(container);

  calcCartPrice();

  alertSaleItem(luckySaleItem, Math.random() * 10000, 30000);
  alertSaleItem(recommendSaleItem, Math.random() * 20000, 60000);
};

// 상품 목록 (select) 업데이트
const updateProdList = () => {
  cartItemSelect.innerHTML = '';
  prodList.forEach((item) => {
    const opt = document.createElement('option');
    opt.value = item.id;

    opt.textContent = item.name + ' - ' + item.price + '원';
    if (item.count === 0) opt.disabled = true;
    cartItemSelect.appendChild(opt);
  });
};

// 금액 계산 함수
const calcCartPrice = () => {
  let cartTotalAmount = 0;
  let totalCount = 0;
  const cartItems = cartList.children;

  let originalPrice = 0;
  for (const item of cartItems) {
    let currentItem = null;

    for (const product of prodList) {
      if (product.id === item.id) {
        currentItem = product;
        break;
      }
    }

    if (!currentItem) return;

    const quantity = parseInt(item.querySelector('span').textContent.split('x ')[1]);
    const totalPrice = currentItem.price * quantity;
    let discount = 0;

    totalCount += quantity;
    originalPrice += totalPrice;
    if (quantity >= 10) {
      if (currentItem.id === 'p1') {
        discount = 0.1;
      } else if (currentItem.id === 'p2') {
        discount = 0.15;
      } else if (currentItem.id === 'p3') {
        discount = 0.2;
      } else if (currentItem.id === 'p4') {
        discount = 0.05;
      } else if (currentItem.id === 'p5') {
        discount = 0.25;
      } else {
        discount = 0;
      }
    }

    cartTotalAmount += totalPrice * (1 - discount);
  }
  let discountRate = 0;

  if (totalCount >= 30) {
    const bulkDiscount = cartTotalAmount * 0.25;
    const itemDiscount = originalPrice - cartTotalAmount;

    if (bulkDiscount > itemDiscount) {
      cartTotalAmount = originalPrice * 0.75;
      discountRate = 0.25;
    } else {
      discountRate = (originalPrice - cartTotalAmount) / originalPrice;
    }
  } else {
    discountRate = (originalPrice - cartTotalAmount) / originalPrice;
  }

  // 화요일에 추가 할인 적용
  if (new Date().getDay() === 2) {
    cartTotalAmount *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }

  cartcartTotalAmount.textContent = '총액: ' + Math.round(cartTotalAmount) + '원';

  if (discountRate > 0) {
    const discountSpan = document.createElement('span');
    discountSpan.className = 'text-green-500 ml-2';
    discountSpan.textContent = `(${(discountRate * 100).toFixed(1)}% 할인 적용)`;
    cartcartTotalAmount.appendChild(discountSpan);
  }

  updateSoldoutList();
  renderBonusPts(cartTotalAmount);
};

const renderBonusPts = (cartTotalAmount) => {
  bonusPoints += Math.floor(cartTotalAmount / 1000);
  let ptsTag = document.getElementById('loyalty-points');
  if (!ptsTag) {
    ptsTag = createElementWithAttributes('span', {
      id: 'loyalty-points',
      className: 'text-blue-500 ml-2',
    });
    cartcartTotalAmount.appendChild(ptsTag);
  }
  ptsTag.textContent = '(포인트: ' + bonusPoints + ')';
};

const updateSoldoutList = () => {
  let infoMsg = '';
  prodList.forEach((item) => {
    if (item.count < 5) {
      infoMsg += item.name + ': ' + (item.count > 0 ? '재고 부족 (' + item.count + '개 남음)' : '품절') + '\n';
    }
  });
  soldoutList.textContent = infoMsg;
};
main();

addBtn.addEventListener('click', () => {
  const selItem = cartItemSelect.value;
  const itemToAdd = prodList.find((p) => p.id === selItem);

  if (itemToAdd && itemToAdd.count > 0) {
    const existingItem = document.getElementById(itemToAdd.id);

    if (existingItem) {
      updateCartItemQuantity(existingItem, 1, itemToAdd);
    } else {
      addNewItemToCart(itemToAdd);
    }

    calcCartPrice();
    lastSelectedProduct = selItem;
  }
});

// 장바구니 이벤트 위임 처리
cartList.addEventListener('click', (event) => {
  const eTarget = event.target;
  const prodId = eTarget.dataset.productId;

  if (prodId) {
    const itemElem = document.getElementById(prodId);
    const prod = prodList.find((p) => p.id === prodId);

    if (eTarget.classList.contains('quantity-change')) {
      const qtyChange = parseInt(eTarget.dataset.change);
      updateCartItemQuantity(itemElem, qtyChange, prod);
    } else if (eTarget.classList.contains('remove-item')) {
      removeCartItem(itemElem, prod);
    }

    calcCartPrice();
  }
});

// 장바구니 아이템 수량 업데이트 함수
const updateCartItemQuantity = (itemElem, change, prod) => {
  const currentQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]);
  const newQty = currentQty + change;

  if (newQty > 0 && newQty <= prod.count + currentQty) {
    itemElem.querySelector('span').textContent = `${prod.name} - ${prod.price}원 x ${newQty}`;
    prod.count -= change;
  } else if (newQty <= 0) {
    removeCartItem(itemElem, prod);
  } else {
    alert('재고가 부족합니다.');
  }
};

// 장바구니에 새로운 아이템 추가하는 함수
const addNewItemToCart = (item) => {
  const newItem = createElementWithAttributes('div', {
    id: item.id,
    className: 'flex justify-between items-center mb-2',
    innerHTML: `
        <span>${item.name} - ${item.price}원 x 1</span>
        <div>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${item.id}" data-change="-1">-</button>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${item.id}" data-change="1">+</button>
          <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${item.id}">삭제</button>
        </div>
      `,
  });

  cartList.appendChild(newItem);
  item.count--;
};

// 장바구니에서 아이템 제거하는 함수
const removeCartItem = (itemElem, prod) => {
  const remQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]);
  prod.count += remQty;
  itemElem.remove();
};
