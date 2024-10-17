import { cartItemState } from '../state.js';
import { calculateCartTotals } from '../modules/calculateCartTotals.js';

export function handleRemoveCartItem(event) {
  const target = event.target;
  const setCartItemState = cartItemState.setState;

  setCartItemState((prevState) => {
    const updatedCartItems = prevState.cartItems.filter(
      (item) => item.id !== target.dataset.itemId
    );

    return { cartItems: updatedCartItems };
  });

  calculateCartTotals();
}
