import { getProductList, updateProductQuantity } from "../../stores/productListStore";
import { calculateCart } from "./calculateCart";
import { setLastSelectedItem } from "../../stores/lastSelectedProductStore";

export function addCart(productSelect, cartContainer) {
  const selectedProductId = productSelect.value;
  const productList = getProductList();
  const selectedProduct = productList.find((product) => product.id === selectedProductId);

  if (selectedProduct && selectedProduct.quantity > 0) {
    let cartItem = document.getElementById(selectedProduct.id);

    if (cartItem) {
      const quantitySpan = cartItem.querySelector("span");
      const currentQuantity = parseInt(quantitySpan.textContent.split("x")[1].trim());
      const newQuantity = currentQuantity + 1;

      if (newQuantity <= selectedProduct.quantity) {
        quantitySpan.textContent = `${selectedProduct.name} - ${selectedProduct.price}원 x ${newQuantity}`;
        updateProductQuantity(selectedProduct.id, selectedProduct.quantity - 1);
      } else {
        alert("재고가 부족합니다.");
        return;
      }
    } else {
      const newProduct = document.createElement("div");
      newProduct.id = selectedProduct.id;
      newProduct.className = "flex justify-between items-center mb-2";
      newProduct.innerHTML = `
        <span>${selectedProduct.name} - ${selectedProduct.price}원 x 1</span>
        <div>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${selectedProduct.id}" data-change="-1">-</button>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${selectedProduct.id}" data-change="1">+</button>
          <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${selectedProduct.id}">삭제</button>
        </div>`;
      cartContainer.appendChild(newProduct);
      updateProductQuantity(selectedProduct.id, selectedProduct.quantity - 1);
    }
    calculateCart(cartContainer);
    setLastSelectedItem(selectedProduct.id);
  }
}
