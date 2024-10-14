import { calculateCart } from "./calculateCart";
import { getProductList } from "../../stores/productListStore";

export function updateCart(event) {
  const target = event.target;
  const productList = getProductList();

  if (target.classList.contains("quantity-change") || target.classList.contains("remove-item")) {
    const selectedProductId = target.dataset.productId;

    const selectedProduct = productList.find((product) => product.id === selectedProductId);
    let cartItem = document.getElementById(selectedProductId);

    if (target.classList.contains("quantity-change")) {
      const quantityChange = parseInt(target.dataset.change);
      const currentQuantity = parseInt(cartItem.querySelector("span").textContent.split("x ")[1]);
      const newQuantity = currentQuantity + quantityChange;

      if (newQuantity > 0 && quantityChange <= selectedProduct.quantity) {
        cartItem.querySelector("span").textContent =
          `${selectedProduct.name} - ${selectedProduct.price}원 x ${newQuantity}`;
        selectedProduct.quantity -= quantityChange;
      } else if (newQuantity <= 0) {
        cartItem.remove();
        selectedProduct.quantity += currentQuantity;
      } else {
        alert("재고가 부족합니다.");
      }
    } else if (target.classList.contains("remove-item")) {
      const currentQuantity = parseInt(cartItem.querySelector("span").textContent.split("x ")[1]);
      selectedProduct.quantity += currentQuantity;
      cartItem.remove();
    }
    calculateCart(); // 장바구니 계산
  }
}
