import { getElementById } from './util/element.js';
import { SELECT_VIEW_ID } from './const/VIEW_ID.js';
import { PROD_LIST } from './const/PROD_LIST.js';
import { SOLD_OUT } from './const/MASIC_NUMBER.js';

export function addBtnEvent() {
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

    return selectedOptionId;
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
  productViewInCart.querySelector('span').textContent = selectedProduct.name + ' - ' + selectedProduct.val + '원 x ' + purchaseCount;
  selectedProduct.quantity--;
}

function plusPurchaseCount(productViewInCart) {
  return parseInt(productViewInCart.querySelector('span').textContent.split('x ')[1]) + 1;
}

function addNewProductToCart(product) {
  const newProductViewInCart = document.createElement('div');

  createProductViewInCart(newProductViewInCart, product);
  cartDisp.appendChild(newProductViewInCart);
  
  product.quantity--;
}

function createProductViewInCart(newProductViewInCart, selectedProduct) {
  newProductViewInCart.id = selectedProduct.id;
  newProductViewInCart.className = 'flex justify-between items-center mb-2';
  newProductViewInCart.innerHTML = '<span>' + selectedProduct.name + ' - ' + selectedProduct.val + '원 x 1</span><div>' +
    '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' + selectedProduct.id + '" data-change="-1">-</button>' +
    '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' + selectedProduct.id + '" data-change="1">+</button>' +
    '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' + selectedProduct.id + '">삭제</button></div>';
}