import { FC } from 'react'
import { MESSAGE } from '../constants'

type StockMessageProps = {
  name: string
  quantity: number
}

const StockMessage: FC<StockMessageProps> = ({ name, quantity }) => {
  return (
    <div key={name}>
      {name}:{quantity ? MESSAGE.STOCK_STATUS.LOW(quantity) : MESSAGE.STOCK_STATUS.EMPTY}
    </div>
  )
}

export default StockMessage
