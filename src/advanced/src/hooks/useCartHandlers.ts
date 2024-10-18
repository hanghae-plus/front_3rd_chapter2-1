import { findProductById, updateCartItemQuantity } from '../utils';

/**
 * @function useCartHandlers
 * @description 장바구니 관련 동작들을 처리
 * 
 * @param {CartItem[]} cartItems - 현재 장바구니에 있는 상품들의 배열
 * @param {function} setCartItems - 장바구니 상태를 업데이트하는 함수
 * @returns {object} 장바구니 관련 핸들러 함수들을 객체로 반환
 */

export const useCartHandlers = (cartItems, setCartItems) => {

  /**
   * @function handleAddCartItem
   * @description 선택된 상품을 장바구니에 추가하는 핸들러
   * 
   * @param {string} selectedProductId - 선택된 상품의 ID
   */

  const handleAddCartItem = (selectedProductId) => {
    const selectedProductItem = findProductById(selectedProductId);

    if (selectedProductItem.quantity === 0) {
      return;
    }

    setCartItems((prevState) => {
      const existingCartItem = prevState.find((item) => item.id === selectedProductItem.id);
      if (existingCartItem) {
        return updateCartItemQuantity(prevState, 1, selectedProductItem);
      }

      return [
        ...prevState,
        { ...selectedProductItem, selectQuantity: 1, quantity: selectedProductItem.quantity - 1 },
      ];
    });
  };

  /**
   * @function handleQuantityUpdate
   * @description 장바구니 내 상품의 수량을 변경하는 핸들러
   * 
   * @param {string} productId - 수량을 변경할 상품의 ID
   * @param {'increase' | 'decrease'} changeDirection - 수량을 증가시킬지 감소시킬지 결정하는 옵션
   */

  const handleQuantityUpdate = (productId, changeDirection) => {
    const quantityChange = changeDirection === 'increase' ? 1 : -1;
    setCartItems((prevState) => 
      updateCartItemQuantity(prevState, quantityChange, findProductById(productId))
    );
  };

  /**
   * @function handleRemoveCartItem
   * @description 장바구니에서 상품을 제거하는 핸들러입
   * 
   * @param {string} productId - 제거할 상품의 ID
   */
  const handleRemoveCartItem = (productId) => {
    setCartItems((prevState) => prevState.filter((item) => item.id !== productId));
  };

  return {
    handleAddCartItem,
    handleQuantityUpdate,
    handleRemoveCartItem,
  };
};