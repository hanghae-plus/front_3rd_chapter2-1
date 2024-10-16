import { Dispatch, useEffect, useReducer } from 'react'
import { cartAction, CartState } from '../types'
import { cartReducer } from '../reducers'
import { carStore } from '../stores'

export function useCart(): [CartState, Dispatch<cartAction>] {
  const [state, dispatch] = useReducer(cartReducer, carStore)

  useEffect(() => {
    dispatch({ type: 'CALCULATE_TOTAL' })
  }, [state.cart])

  useEffect(() => {
    const flashSaleInterval = setInterval(() => {
      // dispatch({ type: 'SET_FLASH_SALE', payload: Math.random() < 0.5 })
    }, 300000) // Every 5 minutes

    const recommendedSaleInterval = setInterval(() => {
      // dispatch({ type: 'SET_RECOMMENDED_SALE', payload: Math.random() < 0.5 })
    }, 600000) // Every 10 minutes

    return () => {
      clearInterval(flashSaleInterval)
      clearInterval(recommendedSaleInterval)
    }
  }, [])

  return [state, dispatch]
}
