import { updateCartItem } from '../components/cartItem.js';
import { calculateCart } from '../components/cartTotal.js';
import { updateProductStock } from '../components/productStock.js';

export function handleCartAction(
  event,
  { productList, cartList, cartTotal, stockStatus }
) {
  const target = event.target;
  if (
    target.classList.contains('quantity-change') ||
    target.classList.contains('remove-item')
  ) {
    const productId = target.dataset.productId;
    const product = productList.find((item) => item.id === productId);
    const cartItemElement = document.getElementById(productId);

    if (target.classList.contains('quantity-change')) {
      const countChange = parseInt(target.dataset.change); // +1 또는 -1 값
      updateCartItem(cartItemElement, product, countChange);
    } else if (target.classList.contains('remove-item')) {
      product.stock += parseInt(
        cartItemElement.querySelector('span').textContent.split('x ')[1]
      );
      cartItemElement.remove();
    }

    calculateCart(cartList, productList, cartTotal); // 장바구니 총액 재계산
    updateProductStock(productList, stockStatus); // 재고 업데이트
  }
}
