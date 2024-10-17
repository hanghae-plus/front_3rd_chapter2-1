import { Dispatch, useCallback } from 'react'
import { productAction } from '../types'

export function useProductActions(dispatch: Dispatch<productAction>) {
  // 선택한 장바구니를 변경하는 함수
  const onSelectCart = useCallback((id: string) => dispatch({ type: 'SELECT_CART', payload: id }), [dispatch])

  // 장바구니에 상품을 추가하는 함수
  const onClickAddToCart = useCallback(() => dispatch({ type: 'ADD_TO_CART' }), [dispatch])

  // 상품 수량을 변경하는 함수
  const onChangeQuantity = useCallback(
    (id: string, change: number) => dispatch({ type: 'CHANGE_QUANTITY', payload: { id, change } }),
    [dispatch],
  )

  // 장바구니에서 상품을 제거하는 함수
  const onClickRemoveCart = useCallback((id: string) => dispatch({ type: 'REMOVE_FROM_CART', payload: id }), [dispatch])

  return { onSelectCart, onClickAddToCart, onChangeQuantity, onClickRemoveCart }
}
