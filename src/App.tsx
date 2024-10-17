import { FC, useCallback } from 'react'
import { useCart } from './hooks'
import { Button, CartLayout, CartList, OtherSummary, SelectField, StockStatus } from './components'
import { useCartActions } from './hooks/useCartActions'

const App: FC = () => {
  const [state, dispatch] = useCart()
  const { selectedCartId, products, totalAmount, points, cart, discountRate } = state
  const { onSelectCart, onClickAddToCart, onChangeQuantity, onClickRemoveCart } = useCartActions(dispatch)
  return (
    <CartLayout>
      <CartList cart={cart} onChange={onChangeQuantity} onClick={onClickRemoveCart} />

      <OtherSummary totalAmount={totalAmount} points={points} discountRate={discountRate} />

      <SelectField price={selectedCartId} onChange={onSelectCart} options={products} />

      <Button id="add-to-cart" onClick={onClickAddToCart} text={`추가`} />

      <StockStatus products={products} />
    </CartLayout>
  )
}

export default App
