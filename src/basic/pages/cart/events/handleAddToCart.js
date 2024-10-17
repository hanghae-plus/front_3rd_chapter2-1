import { cartItemState, selectedProductItemState } from '../state.js';
import { updateCartItemQuantity } from '../modules/updateCartItemQuantity.js';
import { calculateCartTotals } from '../modules/calculateCartTotals.js';
import { DEFAULT_PRODUCT_LIST } from '../constant/defaultProducts.js';

function addItemToCart(selectedProduct) {
  const { cartItems } = cartItemState.getState();
  const setCartItemState = cartItemState.setState;
  const existingCartItem = cartItems.find((cartItem) => cartItem.id === selectedProduct.id);

  if (selectedProduct.quantity === 0) {
    return;
  }

  if (existingCartItem) {
    updateCartItemQuantity(selectedProduct.id, 1);
  } else {
    setCartItemState((prevState) => {
      return {
        cartItems: [
          ...prevState.cartItems,
          { ...selectedProduct, quantity: selectedProduct.quantity - 1, selectQuantity: 1 },
        ],
      };
    });
  }

  calculateCartTotals();
}

export function handleAddToCart() {
  const setSelectedProductState = selectedProductItemState.setState;
  const $productSelectElement = document.getElementById('product-select');
  const selectedProductItem = DEFAULT_PRODUCT_LIST.find(
    (product) => product.id === $productSelectElement.value
  );

  addItemToCart(selectedProductItem);
  setSelectedProductState({ selectedProductItem: selectedProductItem });
}
