import { FC } from 'react'
import { useProduct } from './hooks'
import { Button, ProductLayout, ProductList, OtherSummary, SelectField, StockStatus } from './components'
import { useProductActions } from './hooks/useProductActions'

const App: FC = () => {
  const [state, dispatch] = useProduct()
  const { selectedProductId, products, totalAmount, points, cart, discountRate } = state
  const { onSelectCart, onClickAddToCart, onChangeQuantity, onClickRemoveCart } = useProductActions(dispatch)
  return (
    <ProductLayout>
      <ProductList cart={cart} onChange={onChangeQuantity} onClick={onClickRemoveCart} />

      <OtherSummary totalAmount={totalAmount} points={points} discountRate={discountRate} />

      <SelectField price={selectedProductId} onChange={onSelectCart} options={products} />

      <Button id="add-to-cart" onClick={onClickAddToCart} text={`추가`} />

      <StockStatus products={products} />
    </ProductLayout>
  )
}

export default App
