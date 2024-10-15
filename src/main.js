var productList;
var lastProduct,
  bonusPoint = 0,
  totalAmount = 0,
  itemCount = 0;

function createElement() {
  const rootElement = document.getElementById('app');

  const container = document.createElement('div');
  const wrapElement = document.createElement('div');
  const cartContainerElement = document.createElement('div');
  const totalAmountElement = document.createElement('div');
  const stockInfoElement = document.createElement('div');

  const cartElemnet = document.createElement('h1');

  const productSelectElement = document.createElement('select');

  const addButtonElement = document.createElement('button');

  return {
    rootElement,
    container,
    wrapElement,
    cartElemnet,
    cartContainerElement,
    totalAmountElement,
    productSelectElement,
    addButtonElement,
    stockInfoElement,
  };
}

function setElementAttribute(
  container,
  wrapElement,
  cartElemnet,
  cartContainerElement,
  totalAmountElement,
  productSelectElement,
  addButtonElement,
  stockInfoElement,
) {
  cartContainerElement.id = 'cart-items';
  totalAmountElement.id = 'cart-total';
  productSelectElement.id = 'product-select';
  addButtonElement.id = 'add-to-cart';
  stockInfoElement.id = 'stock-status';

  container.className = 'bg-gray-100 p-8';
  wrapElement.className = 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  cartElemnet.className = 'text-2xl font-bold mb-4';
  totalAmountElement.className = 'text-xl font-bold my-4';
  productSelectElement.className = 'border rounded p-2 mr-2';
  addButtonElement.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  stockInfoElement.className = 'text-sm text-gray-500 mt-2';

  cartElemnet.textContent = '장바구니';
  addButtonElement.textContent = '추가';
}

function addElement(
  wrapElement,
  container,
  rootElement,
  cartElemnet,
  cartContainerElement,
  totalAmountElement,
  productSelectElement,
  addButtonElement,
  stockInfoElement,
) {
  wrapElement.appendChild(cartElemnet);
  wrapElement.appendChild(cartContainerElement);
  wrapElement.appendChild(totalAmountElement);
  wrapElement.appendChild(productSelectElement);
  wrapElement.appendChild(addButtonElement);
  wrapElement.appendChild(stockInfoElement);

  container.appendChild(wrapElement);

  rootElement.appendChild(container);
}

function main() {
  productList = [
    { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
    { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
    { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
    { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
    { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
  ];

  const handleSurpriseSale = () => {
    setInterval(() => {
      const luckyItem = productList[Math.floor(Math.random() * productList.length)];

      if (Math.random() < 0.3 && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * 0.8);

        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
      }
    }, 30000);
  };

  const handleSuggest = () => {
    setInterval(() => {
      if (lastProduct) {
        const salesProduct = productList.find((product) => product.id !== lastProduct && product.quantity > 0);

        if (salesProduct) {
          alert(salesProduct.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');

          salesProduct.price = Math.round(salesProduct.price * 0.95);
        }
      }
    }, 60000);
  };

  const {
    rootElement,
    container,
    wrapElement,
    cartElemnet,
    cartContainerElement,
    totalAmountElement,
    productSelectElement,
    addButtonElement,
    stockInfoElement,
  } = createElement();

  setElementAttribute(
    container,
    wrapElement,
    cartElemnet,
    cartContainerElement,
    totalAmountElement,
    productSelectElement,
    addButtonElement,
    stockInfoElement,
  );

  updateProductSelectOption(productSelectElement);

  addElement(
    wrapElement,
    container,
    rootElement,
    cartElemnet,
    cartContainerElement,
    totalAmountElement,
    productSelectElement,
    addButtonElement,
    stockInfoElement,
  );

  calculateCart(totalAmountElement, stockInfoElement, cartContainerElement);

  setTimeout(() => handleSurpriseSale, Math.random() * 10000);
  setTimeout(() => handleSuggest, Math.random() * 20000);

  addButtonElement.addEventListener('click', (e) =>
    handleAddButton(e, productSelectElement, cartContainerElement, totalAmountElement, stockInfoElement),
  );
  cartContainerElement.addEventListener('click', (e) =>
    handleCartItem(e, totalAmountElement, stockInfoElement, cartContainerElement),
  );
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

  const cartItems = cartContainerElement.children;

  let subTot = 0;

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
    subTot += itemTotalAount;

    if (quantity >= 10) {
      if (currentItem.id === 'p1') discountRateOfProduct = 0.1;
      else if (currentItem.id === 'p2') discountRateOfProduct = 0.15;
      else if (currentItem.id === 'p3') discountRateOfProduct = 0.2;
      else if (currentItem.id === 'p4') discountRateOfProduct = 0.05;
      else if (currentItem.id === 'p5') discountRateOfProduct = 0.25;
    }

    totalAmount += itemTotalAount * (1 - discountRateOfProduct);
  }

  let discountRate = 0;

  if (itemCount >= 30) {
    const bulkDisc = totalAmount * 0.25;
    const itemDisc = subTot - totalAmount;

    if (bulkDisc > itemDisc) {
      totalAmount = subTot * (1 - 0.25);
      discountRate = 0.25;
    } else {
      discountRate = (subTot - totalAmount) / subTot;
    }
  } else {
    discountRate = (subTot - totalAmount) / subTot;
  }

  if (new Date().getDay() === 2) {
    totalAmount *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }

  updateTotalAmountElement(totalAmountElement, discountRate);
  updateStockInfoElement(stockInfoElement);
  updatePointElement(totalAmountElement);
}

const updateTotalAmountElement = (totalAmountElement, discountRate) => {
  totalAmountElement.textContent = '총액: ' + Math.round(totalAmount) + '원';

  if (discountRate > 0) {
    const span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';

    totalAmountElement.appendChild(span);
  }
};

const updatePointElement = (totalAmountElement) => {
  bonusPoint += Math.floor(totalAmount / 1000);

  let pointElement = document.getElementById('loyalty-points');

  if (!pointElement) {
    pointElement = document.createElement('span');
    pointElement.id = 'loyalty-points';
    pointElement.className = 'text-blue-500 ml-2';

    totalAmountElement.appendChild(pointElement);
  }

  pointElement.textContent = '(포인트: ' + bonusPoint + ')';
};

function updateStockInfoElement(stockInfoElement) {
  let message = '';

  productList.forEach((product) => {
    if (product.quantity < 5) {
      message +=
        product.name + ': ' + (product.quantity > 0 ? '재고 부족 (' + product.quantity + '개 남음)' : '품절') + '\n';
    }
  });

  stockInfoElement.textContent = message;
}

const handleAddButton = (_, productSelectElement, cartContainerElement, totalAmountElement, stockInfoElement) => {
  const selItem = productSelectElement.value;
  const itemToAdd = productList.find((product) => product.id === selItem);

  if (itemToAdd && itemToAdd.quantity > 0) {
    const item = document.getElementById(itemToAdd.id);

    if (item) {
      const newQty = parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;

      if (newQty <= itemToAdd.quantity) {
        item.querySelector('span').textContent = itemToAdd.name + ' - ' + itemToAdd.price + '원 x ' + newQty;

        itemToAdd.quantity--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      const newCartItem = document.createElement('div');

      newCartItem.id = itemToAdd.id;
      newCartItem.className = 'flex justify-between items-center mb-2';
      newCartItem.innerHTML =
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

      cartContainerElement.appendChild(newCartItem);

      itemToAdd.quantity--;
    }
    calculateCart(totalAmountElement, stockInfoElement, cartContainerElement);

    lastProduct = selItem;
  }
};

const handleCartItem = (e, totalAmountElement, stockInfoElement, cartContainerElement) => {
  const target = e.target;

  if (target.classList.contains('quantity-change') || target.classList.contains('remove-item')) {
    const productId = target.dataset.productId;

    const productElement = document.getElementById(productId);

    const product = productList.find((p) => p.id === productId);

    if (target.classList.contains('quantity-change')) {
      const qtyChange = parseInt(target.dataset.change);
      const newQty = parseInt(productElement.querySelector('span').textContent.split('x ')[1]) + qtyChange;

      if (
        newQty > 0 &&
        newQty <= product.quantity + parseInt(productElement.querySelector('span').textContent.split('x ')[1])
      ) {
        productElement.querySelector('span').textContent =
          productElement.querySelector('span').textContent.split('x ')[0] + 'x ' + newQty;

        product.quantity -= qtyChange;
      } else if (newQty <= 0) {
        productElement.remove();

        product.quantity -= qtyChange;
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (target.classList.contains('remove-item')) {
      const quantityToRemove = parseInt(productElement.querySelector('span').textContent.split('x ')[1]);
      product.quantity += quantityToRemove;

      productElement.remove();
    }

    calculateCart(totalAmountElement, stockInfoElement, cartContainerElement);
  }
};

main();
