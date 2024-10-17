import { PRODUCT_DATA, DISCOUNT_RULES, DISCOUTNT_RULES_OF_TUESDAY, MESSAGE, DURATION } from './advanced/src/constants';

let productList = PRODUCT_DATA.slice();
let lastProduct,
  bonusPoint = 0,
  totalAmount = 0,
  itemCount = 0;

function createUI() {
  const rootElement = document.getElementById('app');

  const elements = {
    container: document.createElement('div'),
    wrapElement: document.createElement('div'),
    cartElemnet: document.createElement('h1'),
    cartContainerElement: document.createElement('div'),
    totalAmountElement: document.createElement('div'),
    productSelectElement: document.createElement('select'),
    addButtonElement: document.createElement('button'),
    stockInfoElement: document.createElement('div'),
  };

  elements.cartContainerElement.id = 'cart-items';
  elements.totalAmountElement.id = 'cart-total';
  elements.productSelectElement.id = 'product-select';
  elements.addButtonElement.id = 'add-to-cart';
  elements.stockInfoElement.id = 'stock-status';

  elements.container.className = 'bg-gray-100 p-8';
  elements.wrapElement.className = 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  elements.cartElemnet.className = 'text-2xl font-bold mb-4';
  elements.totalAmountElement.className = 'text-xl font-bold my-4';
  elements.productSelectElement.className = 'border rounded p-2 mr-2';
  elements.addButtonElement.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  elements.stockInfoElement.className = 'text-sm text-gray-500 mt-2';

  elements.cartElemnet.textContent = '장바구니';
  elements.addButtonElement.textContent = '추가';

  elements.wrapElement.append(
    elements.cartElemnet,
    elements.cartContainerElement,
    elements.totalAmountElement,
    elements.productSelectElement,
    elements.addButtonElement,
    elements.stockInfoElement,
  );
  elements.container.appendChild(elements.wrapElement);
  rootElement.appendChild(elements.container);

  return elements;
}

function main() {
  const { cartContainerElement, totalAmountElement, productSelectElement, stockInfoElement } = createUI();

  document.getElementById('add-to-cart').addEventListener('click', (e) => {
    const cartData = handleAddButton(e, productSelectElement);

    if (cartData) {
      updateCartUI(cartData, cartContainerElement);

      calculateCart(totalAmountElement, stockInfoElement, cartContainerElement);
    }
  });

  cartContainerElement.addEventListener('click', (e) =>
    handleCartItem(e, totalAmountElement, stockInfoElement, cartContainerElement),
  );

  updateProductSelectOption(productSelectElement);

  calculateCart(totalAmountElement, stockInfoElement, cartContainerElement);

  setTimeout(handleSurpriseSale, Math.random() * DURATION[1000]);
  setTimeout(handleSuggest, Math.random() * DURATION[2000]);
}

function handleSurpriseSale() {
  setInterval(() => {
    const luckyItem = productList[Math.floor(Math.random() * productList.length)];

    if (Math.random() < 0.3 && luckyItem.quantity > 0) {
      luckyItem.price = Math.round(luckyItem.price * (1 - DISCOUNT_RULES['supriseSale']));

      alert(MESSAGE.SUPRISE_SALE(luckyItem.name));
    }
  }, DURATION[3000]);
}

function handleSuggest() {
  setInterval(() => {
    if (lastProduct) {
      const salesProduct = productList.find((product) => product.id !== lastProduct && product.quantity > 0);

      if (salesProduct) {
        alert(MESSAGE.ADDITIONAL_SALE(salesProduct.name));

        salesProduct.price = Math.round(salesProduct.price * (1 - DISCOUNT_RULES['salesProduct']));
      }
    }
  }, DURATION[6000]);
}

function updateProductSelectOption(productSelectElement) {
  productSelectElement.innerHTML = '';

  productList.forEach((product) => {
    const optionElement = document.createElement('option');
    optionElement.value = product.id;
    optionElement.textContent = product.name + ' - ' + product.price + '원';

    if (product.quantity === 0) optionElement.disabled = true;

    productSelectElement.appendChild(optionElement);
  });
}

function calculateCart(totalAmountElement, stockInfoElement, cartContainerElement) {
  totalAmount = 0;
  itemCount = 0;
  let subTotal = 0;

  const cartItems = cartContainerElement.children;

  for (let i = 0; i < cartItems.length; i++) {
    let currentItem;

    for (let j = 0; j < productList.length; j++) {
      if (productList[j].id === cartItems[i].id) {
        currentItem = productList[j];
        break;
      }
    }

    const quantity = parseInt(cartItems[i].querySelector('span').textContent.split('x ')[1]);

    const itemTotalAount = currentItem.price * quantity;

    let discountRateOfProduct = 0;

    itemCount += quantity;
    subTotal += itemTotalAount;

    if (quantity >= QUANTITY['10']) {
      discountRateOfProduct = DISCOUNT_RULES[currentItem.id];
    }

    totalAmount += itemTotalAount * (1 - discountRateOfProduct);
  }

  let discountRate = 0;

  const bulkDiscount = totalAmount * DISCOUNT_RULES['bulk'];
  const itemDiscount = subTotal - totalAmount;

  if (itemCount >= QUANTITY['30'] && bulkDiscount > itemDiscount) {
    totalAmount = subTotal * (1 - DISCOUNT_RULES['bulk']);
    discountRate = DISCOUNT_RULES['bulk'];
  } else {
    discountRate = (subTotal - totalAmount) / subTotal;
  }

  if (new Date().getDay() === DISCOUTNT_RULES_OF_TUESDAY.dayNumber) {
    totalAmount *= 1 - DISCOUTNT_RULES_OF_TUESDAY.discountRate;
    discountRate = Math.max(discountRate, DISCOUTNT_RULES_OF_TUESDAY.discountRate);
  }

  updateTotalAmountElement(totalAmountElement, discountRate);
  updateStockInfoElement(stockInfoElement);
  updatePointElement(totalAmountElement);
}

function updateTotalAmountElement(totalAmountElement, discountRate) {
  totalAmountElement.textContent = '총액: ' + Math.round(totalAmount) + '원';

  if (discountRate > 0) {
    const span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';

    totalAmountElement.appendChild(span);
  }
}

function updatePointElement(totalAmountElement) {
  bonusPoint += Math.floor(totalAmount / 1000);
  totalAmountElement.querySelector('#loyalty-points')?.remove();

  const pointElement = document.createElement('span');
  pointElement.id = 'loyalty-points';
  pointElement.className = 'text-blue-500 ml-2';
  pointElement.textContent = '(포인트: ' + bonusPoint + ')';

  totalAmountElement.appendChild(pointElement);
}

function updateStockInfoElement(stockInfoElement) {
  let message = '';

  productList.forEach((product) => {
    if (product.quantity < QUANTITY['5']) {
      message +=
        product.name + ': ' + (product.quantity > 0 ? '재고 부족 (' + product.quantity + '개 남음)' : '품절') + '\n';
    }
  });

  stockInfoElement.textContent = message;
}

function updateCartUI({ selectedProduct, quantity }, cartContainerElement) {
  const productElement = document.getElementById(selectedProduct.id);

  if (productElement) {
    productElement.querySelector('span').textContent =
      `${selectedProduct.name} - ${selectedProduct.price}원 x ${quantity}`;
  }

  if (!productElement) {
    const newCartElement = document.createElement('div');

    newCartElement.id = selectedProduct.id;
    newCartElement.className = 'flex justify-between items-center mb-2';
    newCartElement.innerHTML = `
    <span>${selectedProduct.name} - ${selectedProduct.price}원 x ${quantity}</span>
    <div>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
        data-product-id="${selectedProduct.id}" data-change="-1">-</button>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
        data-product-id="${selectedProduct.id}" data-change="1">+</button>
      <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" 
        data-product-id="${selectedProduct.id}">삭제</button>
    </div>
  `;
    cartContainerElement.appendChild(newCartElement);
  }
}

function handleAddButton(_, productSelectElement) {
  const selectedProductId = productSelectElement.value;
  const selectedProduct = productList.find((product) => product.id === selectedProductId);

  if (!selectedProduct || selectedProduct.quantity <= 0) return;

  const productElement = document.getElementById(selectedProduct.id);

  let quantity = 1;

  if (productElement) {
    quantity = parseInt(productElement.querySelector('span').textContent.split('x ')[1]) + quantity;

    if (quantity > selectedProduct.quantity) {
      alert(MESSAGE.NOT_ENOUGH_PRODUCT);
      return;
    }
  } else {
    selectedProduct.quantity--;
  }
  return {
    selectedProduct,
    quantity,
  };
}

function handleCartItem(e, totalAmountElement, stockInfoElement, cartContainerElement) {
  const target = e.target;

  if (target.classList.contains('quantity-change') || target.classList.contains('remove-item')) {
    const productId = target.dataset.productId;
    const product = productList.find((product) => product.id === productId);
    const productElement = document.getElementById(productId);

    if (target.classList.contains('quantity-change')) {
      const changedQuantity = parseInt(target.dataset.change);
      const currentQuantity = parseInt(productElement.querySelector('span').textContent.split('x ')[1]);
      const updatedQuantity = currentQuantity + changedQuantity;

      if (updatedQuantity > product.quantity + currentQuantity) {
        alert(MESSAGE.NOT_ENOUGH_PRODUCT);
        return;
      }

      if (updatedQuantity <= 0) {
        productElement.remove();
        product.quantity -= changedQuantity;
        return;
      }
      productElement.querySelector('span').textContent =
        productElement.querySelector('span').textContent.split('x ')[0] + 'x ' + updatedQuantity;
      product.quantity -= changedQuantity;
    }

    if (target.classList.contains('remove-item')) {
      const quantityToRemove = parseInt(productElement.querySelector('span').textContent.split('x ')[1]);
      product.quantity += quantityToRemove;

      productElement.remove();
    }

    calculateCart(totalAmountElement, stockInfoElement, cartContainerElement);
  }
}

main();
