import { CartItem } from '../types';

/**
 * @function updateCartItemQuantity
 * @description 장바구니 내의 특정 상품의 수량을 업데이트하고, 선택된 수량과 사용 가능한 재고 수량을 조정
 * 재고보다 더 많은 수량을 요청하면 경고를 표시하고, 선택된 수량이 0이 되면 상품을 장바구니에서 제거
 * 
 * @param {CartItem[]} cartItems - 현재 장바구니에 있는 상품들의 배열
 * @param {number} quantityChange - 변경하고자 하는 수량
 * @param {Omit<CartItem, 'selectQuantity'>} selectedProductItem - 업데이트하고자 하는 상품 정보
 * @returns {CartItem[]} 업데이트된 장바구니 배열 반환
 */

export const updateCartItemQuantity = (
  cartItems: CartItem[],
  quantityChange: number,
  selectedProductItem: Omit<CartItem, 'selectQuantity'>,
) => {
  return cartItems
    .map((cartItem) => {
      if (cartItem.id !== selectedProductItem.id) {
        return cartItem;
      }

      const updatedSelectQuantity = cartItem.selectQuantity + quantityChange;
      const updatedAvailableQuantity = cartItem.quantity - quantityChange;

      if (updatedSelectQuantity > selectedProductItem.quantity) {
        alert('재고가 부족합니다.');
        return cartItem;
      }

      if (updatedSelectQuantity === 0) {
        return null;
      }

      return {
        ...cartItem,
        selectQuantity: updatedSelectQuantity,
        quantity: updatedAvailableQuantity,
      };
    })
    .filter(Boolean);
};
