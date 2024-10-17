import { createCartItem, updateCartItem } from '../components/cartItem.js';
import { calculateCart } from '../components/cartTotal.js';
import { updateProductStock } from '../components/productStock.js';

export function handleAddCart({
  productSelect,
  productList,
  cartList,
  cartTotal,
  stockStatus,
}) {
  const selectedItem = productList.find(
    (product) => product.id === productSelect.value
  );
  if (!selectedItem || selectedItem.stock <= 0) return;

  const cartItem = document.getElementById(selectedItem.id);
  if (cartItem) {
    updateCartItem(cartItem, selectedItem, 1);
  } else {
    cartList.appendChild(createCartItem(selectedItem));
    selectedItem.stock--;
  }

  calculateCart(cartList, productList, cartTotal);
  updateProductStock(productList, stockStatus);
}
