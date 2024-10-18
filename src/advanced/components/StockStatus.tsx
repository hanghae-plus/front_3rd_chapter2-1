import { FC, memo } from 'react'
import { MESSAGE, MIN_STOCK } from '../constants'
import { Product } from '../types'
import { StockMessage } from '.'

type StockStatusProps = {
  products: Product[]
}

const StockStatus: FC<StockStatusProps> = ({ products }) => {
  return (
    <div id="stock-status" className="text-sm text-gray-500 mt-2">
      {products
        .filter(({ quantity }) => quantity < MIN_STOCK)
        .map((props) => (
          <StockMessage key={props.name} {...props} />
        ))}
    </div>
  )
}

export default memo(StockStatus)
