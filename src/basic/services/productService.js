import { productList } from '../shared/product.js';
import { getDOMElements } from '../shared/domSelectors.js';
import ProductOption from '../components/ProductOption.js';
import { MAX_QUANTITY } from '../shared/constants.js';

const updateProductOptions = () => {
  const { $productSelect } = getDOMElements();
  $productSelect.innerHTML = '';
  productList.forEach((product) => {
    $productSelect.innerHTML += ProductOption(product);
  });
};

const findProductById = (id) =>
  productList.find((product) => product.id === id);

const updateProductQuantity = (button, cartProduct, product) => {
  const quantityChange = parseInt(button.dataset.change);
  const currentQuantity = getCurrentQuantity(cartProduct.querySelector('span'));
  const newQuantity = currentQuantity + quantityChange;

  if (isValidQuantityChange(newQuantity, product.quantity + currentQuantity)) {
    updateCartProductQuantity(
      cartProduct.querySelector('span'),
      product,
      newQuantity,
    );
    product.quantity -= quantityChange;
  } else if (newQuantity <= 0) {
    removeProduct(cartProduct, product);
  } else {
    alert('재고가 부족합니다.');
  }
};

const isValidQuantityChange = (newQuantity, availableQuantity) => {
  return (
    newQuantity > 0 && newQuantity <= Math.min(availableQuantity, MAX_QUANTITY)
  );
};

const updateCartProductQuantity = (quantitySpan, product, newQuantity) => {
  quantitySpan.textContent = `${product.name} - ${product.price}원 x ${newQuantity}`;
};

const removeCartProduct = (cartProduct) => cartProduct.remove();

const removeProduct = (cartProduct, product) => {
  const removedQuantity = getCurrentQuantity(cartProduct);
  product.quantity += removedQuantity;
  removeCartProduct(cartProduct);
};

const isProductAvailable = (product) => {
  if (!product || product.quantity <= 0) {
    alert('선택한 상품은 현재 구매할 수 없습니다.');
    return false;
  }
  return true;
};

const updateExistingCartProduct = (cartProduct, product) => {
  const quantitySpan = cartProduct.querySelector('span');
  const currentQuantity = getCurrentQuantity(quantitySpan);
  const newQuantity = currentQuantity + 1;

  if (newQuantity <= Math.min(product.quantity, MAX_QUANTITY)) {
    updateCartProductQuantity(quantitySpan, product, newQuantity);
    product.quantity--;
  } else {
    alert('더 이상 수량을 늘릴 수 없습니다.');
  }
};

const getCurrentQuantity = (quantitySpan) => {
  return parseInt(quantitySpan.textContent.split('x ')[1]);
};

export {
  updateProductOptions,
  findProductById,
  updateProductQuantity,
  isValidQuantityChange,
  updateCartProductQuantity,
  removeCartProduct,
  removeProduct,
  isProductAvailable,
  updateExistingCartProduct,
  getCurrentQuantity,
};
