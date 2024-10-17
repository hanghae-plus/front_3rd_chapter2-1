import { Dispatch, useCallback } from 'react'
import { cartAction } from '../types'

export function useCartActions(dispatch: Dispatch<cartAction>) {
  const onSelectCart = (id: string) => dispatch({ type: 'SELECT_CART', payload: id })

  const onClickAddToCart = () => dispatch({ type: 'ADD_TO_CART' })

  const onChangeQuantity = (id: string, change: number) =>
    dispatch({ type: 'CHANGE_QUANTITY', payload: { id, change } })

  const onClickRemoveCart = (id: string) => dispatch({ type: 'REMOVE_FROM_CART', payload: id })

  return { onSelectCart, onClickAddToCart, onChangeQuantity, onClickRemoveCart }
}
