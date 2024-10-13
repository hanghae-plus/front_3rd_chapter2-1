import { productList } from "../../utils";
import { calculateCart } from "./CalculateCart";

export function updateCart(event) {
  const target = event.target;

  if (target.classList.contains("quantity-change") || target.classList.contains("remove-item")) {
    const productId = target.dataset.productId;
    const product = productList.find((p) => p.id === productId);
    let cartItem = document.getElementById(productId);

    if (target.classList.contains("quantity-change")) {
      const qtyChange = parseInt(target.dataset.change);
      const currentQty = parseInt(cartItem.querySelector("span").textContent.split("x ")[1]);
      const newQty = currentQty + qtyChange;

      if (newQty > 0 && newQty <= product.stock + currentQty) {
        cartItem.querySelector("span").textContent =
          `${product.name} - ${product.price}원 x ${newQty}`;
        product.stock -= qtyChange;
      } else if (newQty <= 0) {
        cartItem.remove();
        product.stock += currentQty;
      } else {
        alert("재고가 부족합니다.");
      }
    } else if (target.classList.contains("remove-item")) {
      const currentQty = parseInt(cartItem.querySelector("span").textContent.split("x ")[1]);
      product.stock += currentQty;
      cartItem.remove();
    }
    calculateCart(); // 장바구니 계산
  }
}
