import { cartItemState, selectedProductItemState } from '../state.js';
import { updateCartItemQuantity } from '../modules/updateCartItemQuantity.js';
import { calculateCartTotals } from '../modules/calculateCartTotals.js';
import { DEFAULT_PRODUCT_LIST } from '../constant/defaultProducts.js';

function updateCart(product) {
  const { cartItems } = cartItemState.getState();
  const setCartItemState = cartItemState.setState;
  const currentProduct = cartItems.find((item) => item.id === product.id);

  if (product.quantity === 0) {
    return;
  }

  if (currentProduct) {
    updateCartItemQuantity(product.id, 1);
  } else {
    setCartItemState((prevState) => {
      return {
        cartItems: [
          ...prevState.cartItems,
          { ...product, quantity: product.quantity - 1, selectQuantity: 1 },
        ],
      };
    });
  }

  calculateCartTotals();
}

export function handleAddToCart() {
  const setSelectedItemState = selectedProductItemState.setState;
  const selectedProduct = document.getElementById('product-select');
  const selectedProductItem = DEFAULT_PRODUCT_LIST.find(
    (product) => product.id === selectedProduct.value
  );

  updateCart(selectedProductItem);
  setSelectedItemState({ selectedProductItem: selectedProductItem });
}
