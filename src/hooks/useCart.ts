import { Dispatch, useEffect, useReducer, useCallback } from 'react'
import { cartAction, CartState } from '../types'
import { cartReducer } from '../reducers'
import { carStore } from '../stores'
import { MESSAGE, FLASH_SALE_CHANCE, FLASH_SALE_INTERVAL, SUGGESTION_INTERVAL } from '../constants'

export function useCart(): [CartState, Dispatch<cartAction>] {
  const [state, dispatch] = useReducer(cartReducer, carStore)

  const runFlashSale = useCallback(() => {
    const availableProducts = state.products.filter((quantity) => quantity)
    if (!availableProducts.length) return

    const luckyItem = availableProducts[Math.floor(Math.random() * availableProducts.length)]

    if (Math.random() < FLASH_SALE_CHANCE) {
      dispatch({ type: 'UPDATE_PRODUCT_PRICE', payload: { id: luckyItem.id, discount: 0.2 } })
      dispatch({ type: 'SET_FLASH_SALE', payload: true })
      alert(MESSAGE.PROMOTION.FLASH_SALE(luckyItem.name))
    }
  }, [state.products])

  const runSuggestion = useCallback(() => {
    if (state.selectedCartId) {
      const availableProducts = state.products.filter(({ id, quantity }) => id !== state.selectedCartId && quantity)
      if (!availableProducts.length) return

      const suggestedItem = availableProducts[Math.floor(Math.random() * availableProducts.length)]
      dispatch({ type: 'UPDATE_PRODUCT_PRICE', payload: { id: suggestedItem.id, discount: 0.05 } })
      dispatch({ type: 'SET_RECOMMENDED_SALE', payload: true })
      alert(MESSAGE.PROMOTION.SUGGESTION(suggestedItem.name))
    }
  }, [state.products, state.selectedCartId])

  useEffect(() => {
    dispatch({ type: 'CALCULATE_TOTAL' })
  }, [state.cart])

  useEffect(() => {
    const setupPromotions = () => {
      const flashSaleTimeout = setTimeout(() => {
        runFlashSale()
        const flashSaleInterval = setInterval(runFlashSale, FLASH_SALE_INTERVAL)
        return () => clearInterval(flashSaleInterval)
      }, Math.random() * 500000)

      const suggestionTimeout = setTimeout(() => {
        runSuggestion()
        const suggestionInterval = setInterval(runSuggestion, SUGGESTION_INTERVAL)
        return () => clearInterval(suggestionInterval)
      }, Math.random() * 600000)

      return () => {
        clearTimeout(flashSaleTimeout)
        clearTimeout(suggestionTimeout)
      }
    }

    const cleanupPromotions = setupPromotions()

    return () => {
      cleanupPromotions()
    }
  }, [runFlashSale, runSuggestion])

  return [state, dispatch]
}
