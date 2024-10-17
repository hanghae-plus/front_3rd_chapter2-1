import { FC, useCallback } from 'react'
import { useCart } from './hooks'
import { Button, CartLayout, CartList, OtherSummary, SelectField, StockStatus } from './components'

const App: FC = () => {
  const [state, dispatch] = useCart()
  const { selectedCartId, products, totalAmount, points, cart, discountRate } = state

  function onClickSelectItem(id: string): void {
    dispatch({ type: 'SELECT_CART', payload: id })
  }

  const onClickAddToCart = useCallback((): void => {
    dispatch({ type: 'ADD_TO_CART' })
  }, [dispatch])

  const onChangeQuantity = useCallback(
    (id: string, change: number): void => {
      dispatch({ type: 'CHANGE_QUANTITY', payload: { id, change } })
    },
    [dispatch],
  )

  const onClickRemoveCart = useCallback(
    (id: string): void => {
      dispatch({ type: 'REMOVE_FROM_CART', payload: id })
    },
    [dispatch],
  )

  return (
    <CartLayout>
      <CartList cart={cart} handleQuantityChange={onChangeQuantity} handleRemoveItem={onClickRemoveCart} />

      <OtherSummary totalAmount={totalAmount} points={points} discountRate={discountRate} />

      <SelectField value={selectedCartId} onChange={onClickSelectItem} options={products} />

      <Button id="add-to-cart" onClick={onClickAddToCart}>
        추가
      </Button>

      <StockStatus products={products} />
    </CartLayout>
  )
}

export default App
