import { Dispatch, useCallback } from 'react'
import { cartAction } from '../types'

export function useCartActions(dispatch: Dispatch<cartAction>) {
  // 선택한 장바구니를 변경하는 함수
  const onSelectCart = (id: string) => dispatch({ type: 'SELECT_CART', payload: id })

  // 장바구니에 상품을 추가하는 함수
  const onClickAddToCart = () => dispatch({ type: 'ADD_TO_CART' })

  // 상품 수량을 변경하는 함수
  const onChangeQuantity = (id: string, change: number) =>
    dispatch({ type: 'CHANGE_QUANTITY', payload: { id, change } })

  // 장바구니에서 상품을 제거하는 함수
  const onClickRemoveCart = (id: string) => dispatch({ type: 'REMOVE_FROM_CART', payload: id })

  return { onSelectCart, onClickAddToCart, onChangeQuantity, onClickRemoveCart }
}
