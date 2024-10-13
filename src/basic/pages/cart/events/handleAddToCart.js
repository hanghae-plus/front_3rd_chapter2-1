import { cartItemStore, globalCartStore } from '../store.js';

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
  const setCartItemState = cartItemStore.setState;
  const cartItemElement = document.getElementById(product.id);

  if (cartItemElement) {
    updateCartItemQuantity(product.id, 1);
  } else {
    setCartItemState((prevState) => {
      return {
        cartItems: [...prevState.cartItems, { ...product, q: 1 }],
      };
    });
  }

  // calcCart(); // 장바구니 총액 계산
}

// 새로운 수량을 설정하는 함수 - 스토어를 통해 상태를 업데이트
function updateCartItemQuantity(productId, quantityChange) {
  const { cartItems } = cartItemStore.getState(); // 현재 cartItems 상태 가져오기

  // 해당 상품 찾기
  const product = cartItems.find((item) => item.id === productId);

  // 수량 업데이트
  const newQty = product.q + quantityChange;

  // 재고가 부족한 경우 처리
  if (newQty < 0) {
    alert('재고가 부족합니다.');
    return;
  }

  // 스토어의 상태 업데이트
  cartItemStore.setState((prevState) => {
    const updatedCartItems = prevState.cartItems.map((item) => {
      if (item.id === productId) {
        return { ...item, q: newQty }; // 새로운 수량으로 업데이트
      }
      return item;
    });

    return { cartItems: updatedCartItems };
  });
}
