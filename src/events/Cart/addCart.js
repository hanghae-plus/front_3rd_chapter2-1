import { productList } from "../../utils";
import { calculateCart } from "./CalculateCart";

export function addCart(productSelect, cartContainer) {
  const selectedProductId = productSelect.value;
  const selectedProduct = productList.find((p) => p.id === selectedProductId);
  console.log(cartContainer);
  if (selectedProduct && selectedProduct.stock > 0) {
    let cartItem = document.getElementById(selectedProduct.id);

    if (cartItem) {
      // const currentQuantity = parseInt(cartItem.querySelector("span").textContent.split("x ")[1]) + 1;
      const quantitySpan = cartItem.querySelector("span");
      const currentQuantity = parseInt(quantitySpan.textContent) + 1;
      if (currentQuantity <= selectedProduct.stock) {
        quantitySpan.textContent = `${selectedProduct.name} - ${selectedProduct.price}원 x ${currentQua}`;
        selectedProduct.stock--;
      } else {
        alert("재고가 부족합니다.");
      }
    } else {
      cartItem = document.createElement("div");
      cartItem.id = selectedProduct.id;
      cartItem.innerHTML = `
        <span>${selectedProduct.name} - ${selectedProduct.price}원 x 1</span>
        <div>
          <button class="quantity-change" data-product-id="${selectedProduct.id}" data-change="-1">-</button>
          <button class="quantity-change" data-product-id="${selectedProduct.id}" data-change="1">+</button>
          <button class="remove-item" data-product-id="${selectedProduct.id}">삭제</button>
        </div>`;
      cartContainer.appendChild(cartItem);
      selectedProduct.stock--;
    }
    calculateCart(cartContainer);
  }
}
