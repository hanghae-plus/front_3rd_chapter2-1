import { cartItemStore } from '../store.js';
import { calcCart } from '../modules/calcCart.js';

export function handleRemoveCartItem(event) {
  const target = event.target;

  cartItemStore.setState((prevState) => {
    const updatedCartItems = prevState.cartItems.filter(
      (item) => item.id !== target.dataset.itemId
    );

    return { cartItems: updatedCartItems };
  });

  calcCart(); // 장바구니 총액 계산
}
