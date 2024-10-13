import {
  calcDiscounts,
  getProductBulkDiscountRate,
  updateBonusPoints,
  updateProductsStockInfo,
  updateTotalInfo,
} from './utils/cart';
import { PRODUCTS } from './utils/const';

let productSelectDropdown, addToCartBtn, cartItemsDisplay, cartTotalInfo, productsStockInfo;
let lastSel,
  bonusPoints = 0;

const main = () => {
  renderCartUI();
  renderProductOptions();

  calcCart();
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

  PRODUCTS.forEach((item) => {
    const opt = document.createElement('option');
    opt.value = item.id;

    opt.textContent = item.name + ' - ' + item.price + '원';
    if (item.quantity === 0) opt.disabled = true;
    productSelectDropdown.appendChild(opt);
  });
};
const scheduleRandomSales = () => {
  setTimeout(() => {
    setInterval(() => {
      const luckyItem = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
      if (Math.random() < 0.3 && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        renderProductOptions();
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(() => {
    setInterval(() => {
      if (lastSel) {
        const suggest = PRODUCTS.find((item) => {
          return item.id !== lastSel && item.quantity > 0;
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
const calcCart = () => {
  let totalPrice = 0;
  let discountedTotalPrice = 0;
  let itemCnt = 0;

  // 장바구니에 담긴 상품들을 순회하며 총액 계산 + 상품개수에 따른 할인 적용
  const cartItems = cartItemsDisplay.children;
  for (let i = 0; i < cartItems.length; i++) {
    let curItem;
    for (let j = 0; j < PRODUCTS.length; j++) {
      if (PRODUCTS[j].id === cartItems[i].id) {
        curItem = PRODUCTS[j];
        break;
      }
    }

    const quantity = parseInt(cartItems[i].querySelector('span').textContent.split('x ')[1]);
    const productTotalPrice = curItem.price * quantity;
    itemCnt += quantity;
    totalPrice += productTotalPrice;

    const productBulkDiscountRate = getProductBulkDiscountRate(curItem.id, quantity);
    discountedTotalPrice += productTotalPrice * (1 - productBulkDiscountRate);
  }

  const { updatedTotalPrice, discRate } = calcDiscounts(itemCnt, totalPrice, discountedTotalPrice);

  updateTotalInfo(updatedTotalPrice, discRate);
  updateProductsStockInfo();
  bonusPoints = updateBonusPoints(bonusPoints, updatedTotalPrice);
};

main();

addToCartBtn.addEventListener('click', () => {
  const selItem = productSelectDropdown.value;
  const itemToAdd = PRODUCTS.find((p) => {
    return p.id === selItem;
  });
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
      const newItem = document.createElement('div');
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
      cartItemsDisplay.appendChild(newItem);
      itemToAdd.quantity--;
    }
    calcCart();
    lastSel = selItem;
  }
});
cartItemsDisplay.addEventListener('click', (event) => {
  const tgt = event.target;

  if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
    const prodId = tgt.dataset.productId;
    const itemElem = document.getElementById(prodId);
    const prod = PRODUCTS.find((p) => {
      return p.id === prodId;
    });
    if (tgt.classList.contains('quantity-change')) {
      const qtyChange = parseInt(tgt.dataset.change);
      const newQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) + qtyChange;
      if (newQty > 0 && newQty <= prod.quantity + parseInt(itemElem.querySelector('span').textContent.split('x ')[1])) {
        itemElem.querySelector('span').textContent =
          itemElem.querySelector('span').textContent.split('x ')[0] + 'x ' + newQty;
        prod.quantity -= qtyChange;
      } else if (newQty <= 0) {
        itemElem.remove();
        prod.quantity -= qtyChange;
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (tgt.classList.contains('remove-item')) {
      const remQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]);
      prod.quantity += remQty;
      itemElem.remove();
    }
    calcCart();
  }
});
