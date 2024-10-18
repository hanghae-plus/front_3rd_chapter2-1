import { FC, memo } from 'react'
import { MESSAGE, MIN_STOCK } from '../constants'
import { Product } from '../types'

type StockStatusProps = {
  products: Product[]
}

const StockStatus: FC<StockStatusProps> = ({ products }) => {
  return (
    <div id="stock-status" className="text-sm text-gray-500 mt-2">
      {products
        .filter(({ quantity }) => quantity < MIN_STOCK)
        .map(({ name, quantity }) => (
          <div key={name}>
            {name}:{quantity ? MESSAGE.STOCK_STATUS.LOW(quantity) : MESSAGE.STOCK_STATUS.EMPTY}
          </div>
        ))}
    </div>
  )
}

export default memo(StockStatus)
