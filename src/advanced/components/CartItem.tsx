import { FC, memo } from 'react'
import { Product } from '../types'
import Button from './Button'
import { formatNumber } from '../utils'

type CartItemProps = {
  cart: Product[]
  onChange: (id: string, change: number) => void
  onClick: (id: string) => void
}

const CartItem: FC<CartItemProps> = ({ cart, onChange, onClick }) => {
  return (
    <div id="cart-items">
      {cart.map(({ id, name, price, quantity }) => (
        <div key={id} className="flex justify-between items-center mb-2">
          <span>
            {name} - {formatNumber(price)}원 x {quantity}
          </span>
          <div>
            <Button id="quantity-change" size="sm" onClick={() => onChange(id, -1)} className="mr-1" text="-" />
            <Button id="quantity-change" size="sm" onClick={() => onChange(id, 1)} className="mr-1" text="+" />
            <Button id="remove-item" size="sm" color="error" onClick={() => onClick(id)} text="삭제" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default memo(CartItem)
