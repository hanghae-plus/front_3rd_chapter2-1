import {
  calculateDayDiscount,
  calculateTotalProductsBulkDiscount,
  getProductBulkDiscountRate,
  products,
  renderProductsStockInfo,
  updateBonusPoints,
  updateTotalInfo,
} from './utils/cart';

let productSelectDropdown, addToCartBtn, cartItemsDisplay, cartTotalInfo, productsStockInfo;
let lastAddedProduct,
  bonusPoints = 0;

const main = () => {
  renderCartUI();
  renderProductOptions();

  updateCartInfos();
  scheduleRandomSales();
};

const renderCartUI = () => {
  const root = document.getElementById('app');
  const cartWrapper = document.createElement('div');
  const cartContainer = document.createElement('div');
  const cartTitle = document.createElement('h1');
  cartItemsDisplay = document.createElement('div');
  cartTotalInfo = document.createElement('div');
  productSelectDropdown = document.createElement('select');
  addToCartBtn = document.createElement('button');
  productsStockInfo = document.createElement('div');

  cartItemsDisplay.id = 'cart-items';
  cartTotalInfo.id = 'cart-total';
  productSelectDropdown.id = 'product-select';
  addToCartBtn.id = 'add-to-cart';
  productsStockInfo.id = 'stock-status';

  cartWrapper.className = 'bg-gray-100 p-8';
  cartContainer.className = 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  cartTitle.className = 'text-2xl font-bold mb-4';
  cartTotalInfo.className = 'text-xl font-bold my-4';
  productSelectDropdown.className = 'border rounded p-2 mr-2';
  addToCartBtn.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  productsStockInfo.className = 'text-sm text-gray-500 mt-2';
  cartTitle.textContent = '장바구니';
  addToCartBtn.textContent = '추가';

  cartContainer.appendChild(cartTitle);
  cartContainer.appendChild(cartItemsDisplay);
  cartContainer.appendChild(cartTotalInfo);
  cartContainer.appendChild(productSelectDropdown);
  cartContainer.appendChild(addToCartBtn);
  cartContainer.appendChild(productsStockInfo);

  cartWrapper.appendChild(cartContainer);
  root.appendChild(cartWrapper);
};
const renderProductOptions = () => {
  const productSelectDropdown = document.getElementById('product-select');
  productSelectDropdown.innerHTML = '';

  products.forEach((item) => {
    const opt = document.createElement('option');
    opt.value = item.id;

    opt.textContent = item.name + ' - ' + item.price + '원';
    if (item.quantity === 0) opt.disabled = true;
    productSelectDropdown.appendChild(opt);
  });
};
const updateCartInfos = () => {
  let totalItems = 0;
  let totalPrice = 0;
  let discountedTotalPrice = 0;

  const cartItems = cartItemsDisplay.children;
  for (let cartItem of cartItems) {
    const currentProduct = products.find((product) => product.id === cartItem.id);
    const quantity = parseInt(cartItem.querySelector('span').textContent.split('x ')[1]);
    const productTotalPrice = currentProduct.price * quantity;

    totalItems += quantity;
    totalPrice += productTotalPrice;

    const productBulkDiscountRate = getProductBulkDiscountRate(currentProduct.id, quantity);
    discountedTotalPrice += productTotalPrice * (1 - productBulkDiscountRate);
  }

  const updatedTotalPriceAndDiscountRate = calculateTotalProductsBulkDiscount(
    totalItems,
    totalPrice,
    discountedTotalPrice,
  );
  const { updatedTotalPrice, discountRate } = calculateDayDiscount(updatedTotalPriceAndDiscountRate);

  updateTotalInfo(updatedTotalPrice, discountRate);
  bonusPoints = updateBonusPoints(bonusPoints, updatedTotalPrice);
  renderProductsStockInfo();
};
const scheduleRandomSales = () => {
  setTimeout(() => {
    setInterval(() => {
      const luckyItem = products[Math.floor(Math.random() * products.length)];
      if (Math.random() < 0.3 && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        renderProductOptions();
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(() => {
    setInterval(() => {
      if (lastAddedProduct) {
        const suggest = products.find((product) => {
          return product.id !== lastAddedProduct && product.quantity > 0;
        });
        if (suggest) {
          alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.price = Math.round(suggest.price * 0.95);
          renderProductOptions();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
};

main();

const createNewItem = (targetProduct) => {
  const newItem = document.createElement('div');
  newItem.id = targetProduct.id;
  newItem.className = 'flex justify-between items-center mb-2';
  newItem.innerHTML =
    '<span>' +
    targetProduct.name +
    ' - ' +
    targetProduct.price +
    '원 x 1</span><div>' +
    '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
    targetProduct.id +
    '" data-change="-1">-</button>' +
    '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
    targetProduct.id +
    '" data-change="1">+</button>' +
    '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
    targetProduct.id +
    '">삭제</button></div>';
  cartItemsDisplay.appendChild(newItem);
};
const addToCart = (targetCartItem, targetProduct) => {
  if (!targetCartItem) {
    createNewItem(targetProduct);
    targetProduct.quantity--;
    return;
  }

  const currentItemQuantity = parseInt(targetCartItem.querySelector('span').textContent.split('x ')[1]);
  const newItemQuantity = currentItemQuantity + 1;

  // BUG: 로직 개선
  const isStockRemain = newItemQuantity <= targetProduct.quantity;
  if (isStockRemain) {
    const newCartItemInfo = `${targetProduct.name} - ${targetProduct.price}원 x ${newItemQuantity}`;

    targetCartItem.querySelector('span').textContent = newCartItemInfo;
    targetProduct.quantity--;
  } else {
    alert('재고가 부족합니다.');
  }
};
const handleAddToCart = () => {
  const selectedProductId = productSelectDropdown.value;
  const targetProduct = products.find((product) => {
    return product.id === selectedProductId;
  });

  if (targetProduct && targetProduct.quantity > 0) {
    const targetCartItem = document.getElementById(targetProduct.id);

    addToCart(targetCartItem, targetProduct);
    updateCartInfos();
    lastAddedProduct = selectedProductId;
  }
};
addToCartBtn.addEventListener('click', handleAddToCart);

// TODO: handleAddToCart랑 중복되는 부분 합칠 수 있는 지 확인
const removeCartItem = (targetProduct, itemElement, restoreQuantity) => {
  targetProduct.quantity += restoreQuantity;
  itemElement.remove();
};
const changeCartItemQuantity = (clickedElement, itemElement, targetProduct) => {
  const quantityChangeAmount = parseInt(clickedElement.dataset.change);
  const currentItemQuantity = parseInt(itemElement.querySelector('span').textContent.split('x ')[1]);
  const newItemQuantity = currentItemQuantity + quantityChangeAmount;

  const isStockRemain = newItemQuantity <= targetProduct.quantity + currentItemQuantity;

  if (!isStockRemain) {
    alert('재고가 부족합니다.');
  } else if (newItemQuantity > 0) {
    itemElement.querySelector('span').textContent =
      itemElement.querySelector('span').textContent.split('x ')[0] + 'x ' + newItemQuantity;
    targetProduct.quantity -= quantityChangeAmount;
  } else {
    removeCartItem(targetProduct, itemElement, 1);
  }
};
const handleCartItemsDisplay = (event) => {
  const clickedElement = event.target;
  const isRelatedQuantityChange =
    clickedElement.classList.contains('quantity-change') || clickedElement.classList.contains('remove-item');

  if (!isRelatedQuantityChange) return;

  const productId = clickedElement.dataset.productId;
  const itemElement = document.getElementById(productId);
  const targetProduct = products.find((product) => {
    return product.id === productId;
  });

  if (clickedElement.classList.contains('quantity-change')) {
    changeCartItemQuantity(clickedElement, itemElement, targetProduct);
  } else if (clickedElement.classList.contains('remove-item')) {
    const currentItemQuantity = parseInt(itemElement.querySelector('span').textContent.split('x ')[1]);
    removeCartItem(targetProduct, itemElement, currentItemQuantity);
  }

  updateCartInfos();
};
cartItemsDisplay.addEventListener('click', handleCartItemsDisplay);
