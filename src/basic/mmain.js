import { updateSelOpts } from './productSelect.js';
import { calcCart } from './cartTotal.js';
import { createCartItem, updateCartItem } from './cartItem.js';


export function main(productList, cartList, productSelect, cartTotal) {
    updateSelOpts(productList, productSelect);
    calcCart(cartList, productList, cartTotal);
  
    // 상품 추가 이벤트
    document.getElementById('add-to-cart').addEventListener('click', function () {
      const selectedItem = productList.find(item => item.id === productSelect.value);
      if (!selectedItem || selectedItem.stock <= 0) return;
  
      const cartItem = document.getElementById(selectedItem.id);
      if (cartItem) {
        updateCartItem(cartItem, selectedItem, 1);
      } else {
        cartList.appendChild(createCartItem(selectedItem));
        selectedItem.stock--;
      }
      calcCart(cartList, productList, cartTotal);
    });
  }