let productList,
  productSelectDropDown,
  addCartBtn,
  renderCart,
  productSum,
  stockInfo;
let lastSel,
  bonusPts = 0,
  totalAmt = 0;

//매직 넘버 및 문자열 상수 선언
const DISCOUNT_5_PERCENT = 0.05;
const DISCOUNT_10_PERCENT = 0.1;
const DISCOUNT_15_PERCENT = 0.15;
const DISCOUNT_20_PERCENT = 0.2;
const DISCOUNT_25_PERCENT = 0.25;
const DISCOUNT_PRODUCT_COUNT = 10;
const DISCOUNT_25_PERCENT_PRODUCT_COUNT = 30;
const ALERT_SHORT_STOCK = '재고가 부족합니다.';

function main() {
  productList = [
    {id: 'p1', name: '상품1', price: 10000, stock: 50},
    {id: 'p2', name: '상품2', price: 20000, stock: 30},
    {id: 'p3', name: '상품3', price: 30000, stock: 20},
    {id: 'p4', name: '상품4', price: 15000, stock: 0},
    {id: 'p5', name: '상품5', price: 25000, stock: 10},
  ];

  const root = document.getElementById('app');
  const container = document.createElement('div');
  const wrap = document.createElement('div');
  const h1Text = document.createElement('h1');

  renderCart = document.createElement('div');
  productSum = document.createElement('div');
  productSelectDropDown = document.createElement('select');
  addCartBtn = document.createElement('button');
  stockInfo = document.createElement('div');

  renderCart.id = 'cart-items';
  productSum.id = 'cart-total';
  productSelectDropDown.id = 'product-select';
  addCartBtn.id = 'add-to-cart';

  stockInfo.id = 'stock-status';
  container.className = 'bg-gray-100 p-8';
  wrap.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  h1Text.className = 'text-2xl font-bold mb-4';
  productSum.className = 'text-xl font-bold my-4';
  productSelectDropDown.className = 'border rounded p-2 mr-2';
  addCartBtn.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  stockInfo.className = 'text-sm text-gray-500 mt-2';

  h1Text.textContent = '장바구니';
  addCartBtn.textContent = '추가';
  wrap.appendChild(h1Text);
  wrap.appendChild(renderCart);
  wrap.appendChild(productSum);
  wrap.appendChild(productSelectDropDown);
  wrap.appendChild(addCartBtn);
  wrap.appendChild(stockInfo);
  container.appendChild(wrap);
  root.appendChild(container);

  renderProductList();
  calcCart();

  setTimeout(function () {
    setInterval(function () {
      const timeSaleItem =
        productList[Math.floor(Math.random() * productList.length)];
      if (Math.random() < 0.3 && timeSaleItem.stock > 0) {
        timeSaleItem.price = Math.round(timeSaleItem.price * 0.8);
        alert(`번개세일! ${timeSaleItem.name}이(가) 20% 할인 중입니다!`);
        renderProductList();
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(function () {
    setInterval(function () {
      if (lastSel) {
        const suggest = productList.find(function (product) {
          return product.id !== lastSel && product.stock > 0;
        });
        if (suggest) {
          alert(
            `${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`,
          );
          suggest.price = Math.round(suggest.price * 0.95);
          renderProductList();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

function renderProductList() {
  productSelectDropDown.innerHTML = '';
  productList.forEach(function (item) {
    const option = document.createElement('option');
    option.value = item.id;

    option.textContent = `${item.name} - ${item.price}원`;
    if (item.stock === 0) {
      option.disabled = true;
    }
    productSelectDropDown.appendChild(option);
  });
}

function calcCart() {
  totalAmt = 0;
  let itemCnt = 0;
  const cartItems = renderCart.children;
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

      const stock = parseInt(
        cartItems[i].querySelector('span').textContent.split('x ')[1],
      );
      const itemTot = curItem.price * stock;
      let disc = 0;
      itemCnt += stock;
      subTot += itemTot;
      if (stock >= DISCOUNT_PRODUCT_COUNT) {
        if (curItem.id === 'p1') disc = DISCOUNT_10_PERCENT;
        else if (curItem.id === 'p2') disc = DISCOUNT_15_PERCENT;
        else if (curItem.id === 'p3') disc = DISCOUNT_20_PERCENT;
        else if (curItem.id === 'p4') disc = DISCOUNT_5_PERCENT;
        else if (curItem.id === 'p5') disc = DISCOUNT_25_PERCENT;
      }
      totalAmt += itemTot * (1 - disc);
    })();
  }
  let discRate = 0;
  if (itemCnt >= DISCOUNT_25_PERCENT_PRODUCT_COUNT) {
    const bulkDisc = totalAmt * DISCOUNT_25_PERCENT;
    const itemDisc = subTot - totalAmt;
    if (bulkDisc > itemDisc) {
      totalAmt = subTot * (1 - DISCOUNT_25_PERCENT);
      discRate = DISCOUNT_25_PERCENT;
    } else {
      discRate = (subTot - totalAmt) / subTot;
    }
  } else {
    discRate = (subTot - totalAmt) / subTot;
  }

  if (new Date().getDay() === 2) {
    totalAmt *= 1 - DISCOUNT_10_PERCENT;
    discRate = Math.max(discRate, DISCOUNT_10_PERCENT);
  }
  productSum.textContent = `총액: ${Math.round(totalAmt)}원`;
  if (discRate > 0) {
    const span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = `(${(discRate * 100).toFixed(1)}% 할인 적용)`;
    productSum.appendChild(span);
  }
  updateStockInfo();
  renderBonusPts();
}

const renderBonusPts = () => {
  bonusPts += Math.floor(totalAmt / 1000);
  let pointsTag = document.getElementById('loyalty-points');
  if (!pointsTag) {
    pointsTag = document.createElement('span');
    pointsTag.id = 'loyalty-points';
    pointsTag.className = 'text-blue-500 ml-2';
    productSum.appendChild(pointsTag);
  }
  pointsTag.textContent = `(포인트: ${bonusPts})`;
};

function updateStockInfo() {
  let infoMsg = '';
  productList.forEach(function (item) {
    if (item.stock < 5) {
      infoMsg +=
        item.name +
        ': ' +
        (item.stock > 0 ? '재고 부족 (' + item.stock + '개 남음)' : '품절') +
        '\n';
    }
  });
  stockInfo.textContent = infoMsg;
}

main();

function updateStock(productId) {
  const product = productList.find(p => p.id === productId);
  if (product) {
    product.stock--;
  }
}

function createCartProductElement(currentAddProduct, qty = 1) {
  const newItem = document.createElement('div');
  newItem.id = currentAddProduct.id;
  newItem.className = 'flex justify-between items-center mb-2';
  newItem.innerHTML = `
        <span>${currentAddProduct.name} - ${currentAddProduct.price}원 x ${qty}</span>
        <div>
            <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${currentAddProduct.id}" data-change="-1">-</button>
            <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${currentAddProduct.id}" data-change="1">+</button>
            <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${currentAddProduct.id}">삭제</button>
        </div>
    `;
  return newItem;
}

function addProductCart(currentAddProduct) {
  const item = document.getElementById(currentAddProduct.id);
  if (item) {
    const newQty =
      parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
    item.querySelector('span').textContent =
      `${currentAddProduct.name} - ${currentAddProduct.price}원 x ${newQty}`;
    updateStock(currentAddProduct.id);
  } else {
    const newItem = createCartProductElement(currentAddProduct);
    renderCart.appendChild(newItem);
    updateStock(currentAddProduct.id);
  }
  calcCart();
}
addCartBtn.addEventListener('click', function () {
  const currentAddProductValue = productSelectDropDown.value;
  const currentAddProduct = productList.find(
    product => product.id === currentAddProductValue,
  );

  if (currentAddProduct) {
    if (currentAddProduct.stock > 0) {
      addProductCart(currentAddProduct);
      lastSel = currentAddProductValue;
    } else {
      alert(ALERT_SHORT_STOCK);
    }
    renderProductList();
  }
});

renderCart.addEventListener('click', function (event) {
  const target = event.target;

  if (
    target.classList.contains('quantity-change') ||
    target.classList.contains('remove-item')
  ) {
    const productId = target.dataset.productId;
    const productIdElement = document.getElementById(productId);
    const product = productList.find(function (product) {
      return product.id === productId;
    });
    if (target.classList.contains('quantity-change')) {
      const qtyChange = parseInt(target.dataset.change);
      const newQty =
        parseInt(
          productIdElement.querySelector('span').textContent.split('x ')[1],
        ) + qtyChange;
      if (
        newQty > 0 &&
        newQty <=
          product.stock +
            parseInt(
              productIdElement.querySelector('span').textContent.split('x ')[1],
            )
      ) {
        productIdElement.querySelector('span').textContent =
          productIdElement.querySelector('span').textContent.split('x ')[0] +
          'x ' +
          newQty;
        product.stock -= qtyChange;
      } else if (newQty <= 0) {
        productIdElement.remove();
        product.stock -= qtyChange;
      } else {
        alert(ALERT_SHORT_STOCK);
      }
    } else if (target.classList.contains('remove-item')) {
      const remQty = parseInt(
        productIdElement.querySelector('span').textContent.split('x ')[1],
      );
      product.stock += remQty;
      productIdElement.remove();
    }
    calcCart();
  }
});
