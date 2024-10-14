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
  const { cartItems } = cartItemStore.getState();
  const setCartItemState = cartItemStore.setState;
  console.log(product, 'product');
  const currentProduct = cartItems.find((item) => item.id === product.id);

  console.log(currentProduct, 'currentProduct');

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

// 새로운 수량을 설정하는 함수 - 스토어를 통해 상태를 업데이트
export function updateCartItemQuantity(productId, quantityChange) {
  const { cartItems } = cartItemStore.getState();
  const { productList } = globalCartStore.getState();

  // 해당 상품 찾기
  const prevProduct = productList.find((item) => item.id === productId);
  const product = cartItems.find((item) => item.id === productId);

  if (!product) {
    console.error(`Product with id ${productId} not found.`);
    return;
  }

  // 수량 업데이트
  const newSelectQuantity = product.selectQuantity + quantityChange;
  const newQuantity = product.quantity - quantityChange;

  // 재고가 부족한 경우 처리
  if (newSelectQuantity > prevProduct.quantity) {
    alert('재고가 부족합니다.');
    return;
  }

  if (newSelectQuantity === 0) {
    cartItemStore.setState((prevState) => {
      const updatedCartItems = prevState.cartItems.filter(
        (item) => item.id !== productId
      );

      return { cartItems: updatedCartItems };
    });
  }

  // 스토어의 상태 업데이트
  cartItemStore.setState((prevState) => {
    const updatedCartItems = prevState.cartItems.map((item) => {
      if (item.id === productId) {
        return {
          ...item,
          quantity: newQuantity,
          selectQuantity: newSelectQuantity,
        };
      }
      return item;
    });

    return { cartItems: updatedCartItems };
  });
}
