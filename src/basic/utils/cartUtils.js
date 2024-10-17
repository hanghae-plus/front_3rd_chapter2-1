import {
  HeaderText,
  CartDisplay,
  TotalPrice,
  ProductSelect,
  AddButton,
  StockInfo,
  CartItem,
} from '../components';
import { STOCK_OUT_MESSAGE } from '../constants';
import { productList } from '../data';
import { updateCartInfo } from '../state';
import { calculatorCart } from './calculatorUtils';

/**
 * 레이아웃 초기화
 */
export const initCart = () => {
  const root = document.getElementById('app');
  const cont = document.createElement('div');
  const wrap = document.createElement('div');

  cont.className = 'bg-gray-100 p-8';
  wrap.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';

  wrap.innerHTML += HeaderText();
  wrap.innerHTML += CartDisplay();
  wrap.innerHTML += TotalPrice();
  wrap.innerHTML += ProductSelect();
  wrap.innerHTML += AddButton();
  wrap.innerHTML += StockInfo();

  cont.appendChild(wrap);
  root.appendChild(cont);
};

/**
 * 상품 추가 버튼 클릭 이벤트 핸들러
 */
export const handleClickAddToCart = () => {
  const selectedProduct = document.getElementById('product-select').value;
  const targetProduct = productList.find((product) => {
    return product.id === selectedProduct;
  });

  if (targetProduct && targetProduct.quantity > 0) {
    const addProduct = document.getElementById(targetProduct.id);

    addToCart(addProduct, targetProduct);
    calculatorCart();
    updateCartInfo('lastAddedProduct', targetProduct);
  }
};

/**
 * 상품 목록 클릭 이벤트 핸들러
 * @param {*} e
 */
export const handleClickItem = (e) => {
  const target = e.target;

  if (target.classList.contains('quantity-change') || target.classList.contains('remove-item')) {
    const productId = target.dataset.productId;
    const targetItem = document.getElementById(productId);

    const product = productList.find((product) => product.id === productId);

    if (target.classList.contains('quantity-change')) {
      changeQuantity(targetItem, product, target);
    } else if (target.classList.contains('remove-item')) {
      removeItem(targetItem, product);
    }
    calculatorCart();
  }
};

/**
 * 상품 수량 변경
 * @param {*} targetEl
 * @param {*} product
 * @param {*} target
 * @returns
 */
const changeQuantity = (targetEl, product, target) => {
  const quantityChange = parseInt(target.dataset.change);
  const newQuantity =
    parseInt(targetEl.querySelector('span').textContent.split('x ')[1]) + quantityChange;

  if (
    newQuantity > 0 &&
    newQuantity <=
      product.quantity + parseInt(targetEl.querySelector('span').textContent.split('x ')[1])
  ) {
    targetEl.querySelector('span').textContent =
      `${product.name} - ${product.price}원 x ${newQuantity}`;
    product.quantity -= quantityChange;
    return;
  } else if (newQuantity <= 0) {
    targetEl.remove();
    product.quantity -= quantityChange;
    return;
  } else {
    alert(STOCK_OUT_MESSAGE);
    return;
  }
};

/**
 * 상품 삭제
 * @param {*} targetEl
 * @param {*} product
 */
const removeItem = (targetEl, product) => {
  const removeQuantity = parseInt(targetEl.querySelector('span').textContent.split('x ')[1]);
  product.quantity += removeQuantity;
  targetEl.remove();
};

/**
 * 장바구니 추가
 * @param {*} addProduct
 * @param {*} targetProduct
 * @returns
 */
const addToCart = (addProduct, targetProduct) => {
  if (!addProduct) {
    createCartItem(targetProduct);
    return;
  }

  if (addProduct) {
    updateCartItem(addProduct, targetProduct);
    return;
  }
};

/**
 * 장바구니에 새로운 상품 추가
 * @param {*} createProduct
 */
const createCartItem = (createProduct) => {
  const cartItem = document.querySelector('#cart-items');

  const newItem = CartItem(createProduct);
  cartItem.innerHTML += newItem;

  createProduct.quantity--;
};

/**
 * 장바구니에 들어있는 상품의 수량 업데이트
 * @param {*} addProduct
 * @param {*} targetProduct
 * @returns
 */
const updateCartItem = (addProduct, targetProduct) => {
  const productText = addProduct.querySelector('span');
  const updateQuantity = parseInt(productText.textContent.split('x ')[1]) + 1;

  if (updateQuantity <= targetProduct.quantity) {
    productText.textContent = `${targetProduct.name} - ${targetProduct.price}원 x ${updateQuantity}`;
    targetProduct.quantity--;
    return;
  }

  if (updateQuantity > targetProduct.quantity) {
    alert(STOCK_OUT_MESSAGE);
    return;
  }
};

/**
 * 재고 업데이트
 */
export const updateStock = () => {
  let infoMsg = '';
  productList.forEach((item) => {
    if (item.quantity < 5) {
      infoMsg +=
        item.name +
        ': ' +
        (item.quantity > 0 ? '재고 부족 (' + item.quantity + '개 남음)' : '품절') +
        '\n';
    }
  });

  const stockInfo = document.getElementById('stock-status');
  stockInfo.textContent = infoMsg;
};

/**
 * 상품 선택 옵션 업데이트
 */
export const updateSelectOptions = () => {
  const select = document.getElementById('product-select');

  select.innerHTML = '';
  productList.forEach((item) => {
    const optionTag = document.createElement('option');
    optionTag.value = item.id;

    optionTag.textContent = item.name + ' - ' + item.price + '원';
    if (item.quantity === 0) optionTag.disabled = true;
    select.appendChild(optionTag);
  });

  calculatorCart();
};
