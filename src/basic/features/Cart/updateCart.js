import { calculateCart } from "./calculateCart";
import { getProductList, updateProductQuantity } from "../../stores/productListStore";

export const updateCart = (event) => {
  const target = event.target;
  // 유효한 카트 액션이 아니면 종료
  if (!isValidCartAction(target)) return;

  const productList = getProductList();
  const productId = target.dataset.productId;
  const product = productList.find((product) => product.id === productId);
  const cartItem = document.getElementById(productId);

  // 수량 변경
  if (target.classList.contains("quantity-change")) {
    handleQuantityChange(target, product, cartItem);
  } else if (target.classList.contains("remove-item")) {
    // 아이템 삭제
    handleRemoveItem(product, cartItem);
  }

  calculateCart();
};

// 유효한 카트 액션인지 확인
const isValidCartAction = (target) => {
  return target.classList.contains("quantity-change") || target.classList.contains("remove-item");
};

// 수량 변경
const handleQuantityChange = (target, product, cartItem) => {
  const quantityChange = parseInt(target.dataset.change);
  const currentQuantity = parseInt(cartItem.querySelector("span").textContent.split("x ")[1]);
  const newQuantity = currentQuantity + quantityChange;

  if (newQuantity > 0 && quantityChange <= product.quantity) {
    cartItem.querySelector("span").textContent =
      `${product.name} - ${product.price}원 x ${newQuantity}`;
    updateProductQuantity(product.id, product.quantity - quantityChange);
  } else if (newQuantity <= 0) {
    removeCartItem(cartItem);
    restoreProductQuantity(product, currentQuantity);
  } else {
    alert("재고가 부족합니다.");
  }
};

// 아이템 삭제
const handleRemoveItem = (product, cartItem) => {
  const currentQuantity = parseInt(cartItem.querySelector("span").textContent.split("x ")[1]);
  restoreProductQuantity(product, currentQuantity);
  cartItem.remove();
};

// 상품 재고 업데이트
const updateProductQuantity = (product, quantityChange) => {
  product.quantity -= quantityChange;
  updateProductQuantity(product.id, product.quantity);
};

// 상품 재고 복원
const restoreProductQuantity = (product, quantity) => {
  product.quantity += quantity;
  updateProductQuantity(product.id, product.quantity);
};
