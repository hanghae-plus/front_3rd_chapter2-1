import { addEvent } from '../../utils/eventUtils.js';
import {
  handleAddToCart,
  updateCartItemQuantity,
} from './events/handleAddToCart.js';
import { cartItemStore } from './store.js';

export function events() {
  function test3() {
    addEvent('click', '#add-to-cart', handleAddToCart);
  }

  function test1() {
    addEvent('click', '.quantity-change', handleCartClick);
  }

  function test2() {
    addEvent('click', '.remove-item', handleRemoveCartItem);
  }

  return {
    test1,
    test2,
    test3,
  };
}

function handleCartClick(event) {
  console.log('click');
  const target = event.target;
  const { itemId, change } = target.dataset;
  updateCartItemQuantity(itemId, parseInt(change));
}

function handleRemoveCartItem(event) {
  const target = event.target;

  cartItemStore.setState((prevState) => {
    const updatedCartItems = prevState.cartItems.filter(
      (item) => item.id !== target.dataset.itemId
    );

    return { cartItems: updatedCartItems };
  });
}
