import { QUANTITY_CHANGE_CLASS, REMOVE_ITEM_CLASS } from '../../const/VIEW_CLASS.js';
import { getElementById } from '../../util/element.js';
import plusPurchaseCount, { parseQuantity } from '../../util/plusPurchaseCount.js';
import { PROD_LIST } from '../../const/PROD_LIST.js';
import { CART_VIEW_ID } from '../../const/VIEW_ID.js';
import calcCart from './calcCart.js';


export default function addCartEvent() {
  const cartView = getElementById(CART_VIEW_ID);

  cartView.addEventListener('click', handleClickCart);
}

function handleClickCart(event) {
  const target = event.target;

  if (target.classList.contains(QUANTITY_CHANGE_CLASS)) {
    handleQuantityChange(target);
  } else if (target.classList.contains(REMOVE_ITEM_CLASS)) {
    handleRemoveItem(target);
  }
  calcCart();
}

function handleQuantityChange(target) {
  const productId = target.dataset.productId;
  const productView = getElementById(productId);
  const product = findProductById(productId);
  const quantityChange = parseInt(target.dataset.change);
  const newQuantity = plusPurchaseCount(productView, quantityChange);

  if (newQuantity > 0 && newQuantity <= product.quantity + parseQuantity(productView)) {
    updateItemQuantity(productView, product, newQuantity);
    product.quantity -= quantityChange;
  } else if (newQuantity <= 0) {
    productView.remove();
    product.quantity -= quantityChange;
  } else {
    alert('재고가 부족합니다.');
  }
}

function handleRemoveItem(target) {
  const productId = target.dataset.productId;
  const itemView = document.getElementById(productId);
  const product = findProductById(productId);
  const removingQuantity = parseQuantity(itemView);

  product.quantity += removingQuantity;
  itemView.remove();
}

function findProductById(productId) {
  return PROD_LIST.find(product => product.id === productId);
}

function updateItemQuantity(itemView, product, newQuantity) {
  itemView.querySelector('span').textContent = product.name + ' - ' + product.price + '원 x ' + newQuantity;
}