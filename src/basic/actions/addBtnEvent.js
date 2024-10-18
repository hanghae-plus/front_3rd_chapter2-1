import { appendChildren, createElement, getElementById } from '../../util/element.js';
import { ADD_BTN_VIEW_ID, CART_VIEW_ID, SELECT_VIEW_ID } from '../../const/VIEW_ID.js';
import { PROD_LIST } from '../../const/PROD_LIST.js';
import { SOLD_OUT } from '../../const/MASIC_NUMBER.js';
import calcCart from './calcCart.js';
import plusPurchaseCount from '../../util/plusPurchaseCount.js';

export default function addBtnEvent() {
  const addBtnView = getElementById(ADD_BTN_VIEW_ID);

  addBtnView.addEventListener('click', handleClickButton);
}

function handleClickButton() {
  const selectView = getElementById(SELECT_VIEW_ID);
  const selectedOptionId = selectView.value;
  const selectedProduct = findProductById(selectedOptionId);

  if (selectedProduct && hasStock(selectedProduct)) {
    const productViewInCart = getElementById(selectedProduct.id);

    if (productViewInCart) {
      updateExistingProductInCart(productViewInCart, selectedProduct);
    } else {
      addNewProductToCart(selectedProduct);
    }
    calcCart();
    
    localStorage.setItem('selectedOptionId', selectedOptionId);
  }
}

function findProductById(id) {
  return PROD_LIST.find((product) => {
    return product.id === id;
  });
}

function hasStock(product) {
  return product.quantity > SOLD_OUT;
}

function updateExistingProductInCart(productViewInCart, product) {
  const purchaseCount = plusPurchaseCount(productViewInCart);

  if (purchaseCount <= product.quantity) {
    updateProductView(productViewInCart, product, purchaseCount);
  } else {
    alert('재고가 부족합니다.');
  }
}

function updateProductView(productViewInCart, selectedProduct, purchaseCount) {
  productViewInCart.querySelector('span').textContent = selectedProduct.name + ' - ' + selectedProduct.price + '원 x ' + purchaseCount;
  selectedProduct.quantity--;
}

function addNewProductToCart(product) {
  const newProductViewInCart = createElement('div');

  createProductViewInCart(newProductViewInCart, product);

  const cartView = getElementById(CART_VIEW_ID);
  appendChildren(cartView, newProductViewInCart);

  product.quantity--;
}

function createProductViewInCart(newProductViewInCart, selectedProduct) {
  newProductViewInCart.id = selectedProduct.id;
  newProductViewInCart.className = 'flex justify-between items-center mb-2';
  newProductViewInCart.innerHTML = '<span>' + selectedProduct.name + ' - ' + selectedProduct.price + '원 x 1</span><div>' +
    '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' + selectedProduct.id + '" data-change="-1">-</button>' +
    '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' + selectedProduct.id + '" data-change="1">+</button>' +
    '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' + selectedProduct.id + '">삭제</button></div>';
}