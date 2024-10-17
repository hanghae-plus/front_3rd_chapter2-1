let productSelectDropDown, addCartBtn, renderCart, productSum, stockInfo;
const productList = [
  { id: 'p1', name: '상품1', price: 10000, stock: 50 },
  { id: 'p2', name: '상품2', price: 20000, stock: 30 },
  { id: 'p3', name: '상품3', price: 30000, stock: 20 },
  { id: 'p4', name: '상품4', price: 15000, stock: 0 },
  { id: 'p5', name: '상품5', price: 25000, stock: 10 },
];
let lastSelectedProductId,
  totalAmount = 0;

//매직 넘버 및 문자열 상수 선언
const DISCOUNT_PRODUCT_COUNT = 10;

const DISCOUNT_5_PERCENT = 0.05;
const DISCOUNT_10_PERCENT = 0.1;
const DISCOUNT_15_PERCENT = 0.15;
const DISCOUNT_20_PERCENT = 0.2;
const DISCOUNT_25_PERCENT = 0.25;

const discountRates = {
  p1: DISCOUNT_10_PERCENT,
  p2: DISCOUNT_15_PERCENT,
  p3: DISCOUNT_20_PERCENT,
  p4: DISCOUNT_5_PERCENT,
  p5: DISCOUNT_25_PERCENT,
};

const DISCOUNT_25_PERCENT_PRODUCT_COUNT = 30;
const ALERT_SHORT_STOCK = '재고가 부족합니다.';

const main = () => {
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
  wrap.className = 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
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

  setTimeout(() => {
    setInterval(() => {
      const timeSaleProduct = productList[Math.floor(Math.random() * productList.length)];
      if (Math.random() < 0.3 && timeSaleProduct.stock > 0) {
        timeSaleProduct.price = Math.round(timeSaleProduct.price * 0.8);
        alert(`번개세일! ${timeSaleProduct.name}이(가) 20% 할인 중입니다!`);
        renderProductList();
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(() => {
    setInterval(() => {
      if (lastSelectedProductId) {
        const productSuggest = productList.find((product) => {
          return product.id !== lastSelectedProductId && product.stock > 0;
        });
        if (productSuggest) {
          alert(`${productSuggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          productSuggest.price = Math.round(productSuggest.price * 0.95);
          renderProductList();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
};

const renderProductList = () => {
  productSelectDropDown.innerHTML = '';
  productList.forEach((product) => {
    const option = document.createElement('option');
    option.value = product.id;

    option.textContent = `${product.name} - ${product.price}원`;
    if (product.stock === 0) {
      option.disabled = true;
    }
    productSelectDropDown.appendChild(option);
  });
};

const getBulkDiscount = (stockCnt, totalAmount, discountPrevAmount) => {
  if (stockCnt >= DISCOUNT_25_PERCENT_PRODUCT_COUNT) {
    const bulkDisc = totalAmount * DISCOUNT_25_PERCENT;
    const itemDisc = discountPrevAmount - totalAmount;
    return bulkDisc > itemDisc ? DISCOUNT_25_PERCENT : (discountPrevAmount - totalAmount) / discountPrevAmount;
  }
  return (discountPrevAmount - totalAmount) / discountPrevAmount;
};

const getCurrentProduct = (id) => {
  return productList.find((product) => product.id === id);
};

const getProductStock = (cartProduct) => {
  return parseInt(cartProduct.querySelector('span').textContent.split('x ')[1]);
};

const getDiscountRate = (stock, currentProduct) => {
  return stock >= DISCOUNT_PRODUCT_COUNT ? discountRates[currentProduct.id] : 0;
};

const calcCart = () => {
  totalAmount = 0;
  let stockCnt = 0;
  const cartProductList = renderCart.children;
  let discountPrevAmount = 0;

  for (let i = 0; i < cartProductList.length; i++) {
    const currentProduct = getCurrentProduct(cartProductList[i].id);
    const stock = getProductStock(cartProductList[i]);
    const productAmount = currentProduct.price * stock;
    const discountRate = getDiscountRate(stock, currentProduct);

    stockCnt += stock;
    discountPrevAmount += productAmount;
    totalAmount += productAmount * (1 - discountRate);
  }

  let discountRate = getBulkDiscount(stockCnt, totalAmount, discountPrevAmount);

  const isTuesday = new Date().getDay() === 2;
  if (isTuesday) {
    totalAmount *= 1 - DISCOUNT_10_PERCENT;
    discountRate = Math.max(discountRate, DISCOUNT_10_PERCENT);
  }

  productSum.textContent = `총액: ${Math.round(totalAmount)}원`;
  if (discountRate > 0) {
    const discountSpan = document.createElement('span');
    discountSpan.className = 'text-green-500 ml-2';
    discountSpan.textContent = `(${(discountRate * 100).toFixed(1)}% 할인 적용)`;
    productSum.appendChild(discountSpan);
  }

  updateStockInfo();
  renderBonusPoints();
};

const renderBonusPoints = () => {
  let pointsTag = document.getElementById('loyalty-points');
  if (!pointsTag) {
    pointsTag = document.createElement('span');
    pointsTag.id = 'loyalty-points';
    pointsTag.className = 'text-blue-500 ml-2';
    productSum.appendChild(pointsTag);
  }
  pointsTag.textContent = `(포인트: ${Math.floor(totalAmount / 1000)})`;
};

const updateStockInfo = () => {
  let infoMsg = '';
  productList.forEach(function (product) {
    if (product.stock < 5) {
      infoMsg += product.name + ': ' + (product.stock > 0 ? '재고 부족 (' + product.stock + '개 남음)' : '품절') + '\n';
    }
  });
  stockInfo.textContent = infoMsg;
};

main();

const updateStock = (productId) => {
  const product = productList.find((p) => p.id === productId);
  if (product) {
    product.stock--;
  }
};

const renderCartProductElement = (productToAdd, qty = 1) => {
  const newProduct = document.createElement('div');
  newProduct.id = productToAdd.id;
  newProduct.className = 'flex justify-between items-center mb-2';
  newProduct.innerHTML = `
        <span>${productToAdd.name} - ${productToAdd.price}원 x ${qty}</span>
        <div>
            <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${productToAdd.id}" data-change="-1">-</button>
            <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${productToAdd.id}" data-change="1">+</button>
            <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${productToAdd.id}">삭제</button>
        </div>
    `;
  return newProduct;
};

const addProductCart = (productToAdd) => {
  const product = document.getElementById(productToAdd.id);
  if (product) {
    const newQty = parseInt(product.querySelector('span').textContent.split('x ')[1]) + 1;
    product.querySelector('span').textContent = `${productToAdd.name} - ${productToAdd.price}원 x ${newQty}`;
    updateStock(productToAdd.id);
  } else {
    const newProduct = renderCartProductElement(productToAdd);
    renderCart.appendChild(newProduct);
    updateStock(productToAdd.id);
  }
  calcCart();
};

addCartBtn.addEventListener('click', () => {
  const productToAddId = productSelectDropDown.value;
  const productToAdd = productList.find((product) => product.id === productToAddId);

  if (productToAdd) {
    if (productToAdd.stock > 0) {
      addProductCart(productToAdd);
      lastSelectedProductId = productToAddId;
    } else {
      alert(ALERT_SHORT_STOCK);
      renderProductList();
    }
  }
});

renderCart.addEventListener('click', (event) => {
  const target = event.target;

  if (!target.classList.contains('quantity-change') && !target.classList.contains('remove-item')) {
    return;
  }

  const productId = target.dataset.productId;
  const productIdElement = document.getElementById(productId);
  const product = productList.find((product) => product.id === productId);
  const currentQty = parseInt(productIdElement.querySelector('span').textContent.split('x ')[1]);

  if (target.classList.contains('quantity-change')) {
    const qtyChange = parseInt(target.dataset.change);
    const newQty = currentQty + qtyChange;

    if (newQty > 0 && newQty <= product.stock + currentQty) {
      productIdElement.querySelector('span').textContent =
        `${productIdElement.querySelector('span').textContent.split('x ')[0]}x ${newQty}`;
      product.stock -= qtyChange;
    } else if (newQty <= 0) {
      productIdElement.remove();
      product.stock -= qtyChange;
    } else {
      alert(ALERT_SHORT_STOCK);
    }
  } else if (target.classList.contains('remove-item')) {
    product.stock += currentQty;
    productIdElement.remove();
  }

  calcCart();
});
