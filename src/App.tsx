import { FC, useCallback, useMemo } from 'react'
import { useCart } from './hooks'
import { Button, CartLayout, CartList, OtherSummary, SelectField, StockStatus } from './components'

const App: FC = () => {
  const [state, dispatch] = useCart()
  const { selectedCartId, products, totalAmount, points, cart, discountRate } = state

  function handleSelectedItem(id: string): void {
    dispatch({ type: 'SELECT_CART', payload: id })
  }

  const handleAddToCart = useCallback((): void => {
    dispatch({ type: 'ADD_TO_CART' })
  }, [dispatch])

  const handleQuantityChange = useCallback(
    (id: string, change: number): void => {
      dispatch({ type: 'CHANGE_QUANTITY', payload: { id, change } })
    },
    [dispatch],
  )

  const handleRemoveItem = useCallback(
    (id: string): void => {
      dispatch({ type: 'REMOVE_FROM_CART', payload: id })
    },
    [dispatch],
  )

  const isDisabledAddButton = useMemo(() => {
    return products.find((p) => p.id === selectedCartId)?.quantity === 0
  }, [products, selectedCartId])

  return (
    <CartLayout>
      <CartList cart={cart} handleQuantityChange={handleQuantityChange} handleRemoveItem={handleRemoveItem} />

      <OtherSummary totalAmount={totalAmount} points={points} discountRate={discountRate} />

      <SelectField value={selectedCartId} onChange={handleSelectedItem} options={products} />

      <Button id="add-to-cart" onClick={handleAddToCart} disabled={isDisabledAddButton}>
        추가
      </Button>

      <StockStatus products={products} />
    </CartLayout>
  )
}

export default App
