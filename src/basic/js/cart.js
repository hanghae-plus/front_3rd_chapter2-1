import {
  PRODUCT_LIST,
  DISCOUNT_PRODUCT_COUNT,
  DISCOUNT_RATES,
  DISCOUNT_10_PERCENT,
  DISCOUNT_25_PERCENT,
  DISCOUNT_25_PERCENT_PRODUCT_COUNT,
  ALERT_SHORT_STOCK,
} from './constants.js';
import { addCartBtn, productSelectDropDown, productSum, renderCart, stockInfo } from './layout.js';
import { renderProductList, renderCartProductElement, renderBonusPoints } from './render.js';

let lastSelectedProductId;

const getBulkDiscount = (stockCnt, totalAmount, discountPrevAmount) => {
  if (stockCnt >= DISCOUNT_25_PERCENT_PRODUCT_COUNT) {
    const bulkDisc = totalAmount * DISCOUNT_25_PERCENT;
    const itemDisc = discountPrevAmount - totalAmount;
    return bulkDisc > itemDisc ? DISCOUNT_25_PERCENT : (discountPrevAmount - totalAmount) / discountPrevAmount;
  }
  return (discountPrevAmount - totalAmount) / discountPrevAmount;
};

const getCurrentProduct = (id) => {
  return PRODUCT_LIST.find((product) => product.id === id);
};

const getProductStock = (cartProduct) => {
  return parseInt(cartProduct.querySelector('span').textContent.split('x ')[1]);
};

const getDiscountRate = (stock, currentProduct) => {
  return stock >= DISCOUNT_PRODUCT_COUNT ? DISCOUNT_RATES[currentProduct.id] : 0;
};

const updateStockInfo = () => {
  let infoMsg = '';
  PRODUCT_LIST.forEach(function (product) {
    if (product.stock < 5) {
      infoMsg += product.name + ': ' + (product.stock > 0 ? '재고 부족 (' + product.stock + '개 남음)' : '품절') + '\n';
    }
  });
  stockInfo.textContent = infoMsg;
};

const calcCart = () => {
  let totalAmount = 0;
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
  renderBonusPoints(totalAmount);
};

const updateStock = (productId) => {
  const product = PRODUCT_LIST.find((p) => p.id === productId);
  if (product) {
    product.stock--;
  }
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

const initAddCartBtnEventListeners = () => {
  addCartBtn.addEventListener('click', () => {
    const productToAddId = productSelectDropDown.value;
    const productToAdd = PRODUCT_LIST.find((product) => product.id === productToAddId);

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
};

export { addProductCart, lastSelectedProductId, calcCart, initAddCartBtnEventListeners };
