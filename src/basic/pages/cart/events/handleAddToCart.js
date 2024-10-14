import { cartItemStore, globalCartStore } from '../store.js';
import { updateCartItemQuantity } from '../modules/updateCartItemQuantity.js';

export function handleAddToCart() {
  const { productList } = globalCartStore.getState();
  const selectedProduct = document.getElementById('product-select');
  const selectedProductItem = productList.find(
    (product) => product.id === selectedProduct.value
  );

  updateCart(selectedProductItem);
}

// 장바구니에 아이템 업데이트
function updateCart(product) {
  const { cartItems } = cartItemStore.getState();
  const setCartItemState = cartItemStore.setState;
  const currentProduct = cartItems.find((item) => item.id === product.id);

  if (product.quantity === 0) return;

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

  // calcCart(); // 장바구니 총액 계산
}
