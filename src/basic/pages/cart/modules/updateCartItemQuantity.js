import { cartItemStore, globalCartStore } from '../store.js';

export function updateCartItemQuantity(productId, quantityChange) {
  const { cartItems } = cartItemStore.getState();
  const { productList } = globalCartStore.getState();

  // 해당 상품 찾기
  const prevProduct = productList.find((item) => item.id === productId);
  const product = cartItems.find((item) => item.id === productId);

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
      const updatedCartItems = prevState.cartItems.filter((item) => item.id !== productId);

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
